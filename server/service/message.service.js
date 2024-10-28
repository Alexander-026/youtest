import ApiError from "../exceptions/apiError.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

const sendMessageService = async (receiverId, senderId, message) => {
  if (!receiverId || !senderId || !message) {
    throw ApiError.BadRequest(
      "Missing required fields: receiverId, senderId, or message"
    );
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    message,
    conversationId: conversation._id,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);

  return {
    id: newMessage._id,
    senderId: newMessage.senderId,
    receiverId: newMessage.receiverId,
    conversationId: newMessage.conversationId,
    message: newMessage.message,
    isRead: newMessage.isRead,
    createdAt: newMessage.createdAt,
    updatedAt: newMessage.updatedAt,
  };
};

const getAllConversationsService = async (senderId) => {
  if (!senderId) {
    throw ApiError.BadRequest("Missing required field");
  }

  const conversations = await Conversation.aggregate([
    {
      $match: {
        participants: { $in: [new mongoose.Types.ObjectId(senderId)] }, // Находим беседы, в которых есть senderId
      },
    },
    {
      $project: {
        participants: {
          $filter: {
            input: "$participants", // Массив участников
            as: "participant",
            cond: {
              $ne: ["$$participant", new mongoose.Types.ObjectId(senderId)],
            }, // Убираем senderId из участников
          },
        },
      },
    },
    {
      $lookup: {
        // Подгружаем информацию о пользователях
        from: "users", // Коллекция пользователей
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $project: {
        id: "$_id", // Переименовываем _id конференции в id
        _id: 0, // Убираем _id
        participant: {
          // Возвращаем только одного собеседника
          $arrayElemAt: [
            {
              $map: {
                input: "$participants", // Массив участников
                as: "participant",
                in: {
                  id: "$$participant._id", // Переименовываем _id участников в id
                  firstName: "$$participant.firstName",
                  lastName: "$$participant.lastName",
                  image: "$$participant.image",
                  wasOnline: "$$participant.wasOnline",
                },
              },
            },
            0, // Берем первый элемент после фильтрации
          ],
        },
      },
    },
  ]);

  return conversations;
};


const getConversationService = async (conversationId, senderId) => {
  const conversation = await Conversation.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(conversationId) }, // Находим нужный разговор по ID
    },
    {
      $lookup: {
        // Подключаем участников
        from: "users", // Коллекция пользователей
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $lookup: {
        // Подключаем сообщения
        from: "messages", // Коллекция сообщений
        localField: "messages",
        foreignField: "_id",
        as: "messages",
      },
    },
    {
      $project: {
        _id: 1,
        messages: {
          $map: {
            input: "$messages",
            as: "message",
            in: {
              id: "$$message._id", // Переименовываем _id в id
              senderId: "$$message.senderId",
              receiverId: "$$message.receiverId",
              message: "$$message.message",
              isRead: "$$message.isRead",
              conversationId: "$$message.conversationId",
              createdAt: "$$message.createdAt",
              updatedAt: "$$message.updatedAt",
            },
          },
        },
        participants: {
          $filter: {
            input: "$participants", // Массив участников
            as: "participant",
            cond: {
              $ne: ["$$participant._id", new mongoose.Types.ObjectId(senderId)],
            }, // Убираем senderId из участников
          },
        },
      },
    },
    {
      $project: {
        id: "$_id", // Переименовываем _id беседы в id
        _id: 0, // Убираем _id
        participant: {
          $arrayElemAt: [
            {
              $map: {
                input: "$participants", // Массив участников
                as: "participant",
                in: {
                  id: "$$participant._id", // Переименовываем _id участника в id
                  firstName: "$$participant.firstName",
                  lastName: "$$participant.lastName",
                  image: "$$participant.image",
                },
              },
            },
            0, // Берем первого (и единственного) участника
          ],
        },
        messages: 1, // Оставляем преобразованные сообщения
      },
    },
  ]);

  if (!conversation || conversation.length === 0) {
    throw ApiError.BadRequest("Conversation not found!");
  }

  return conversation[0]; // Вернем первый элемент из массива
};

const readMessageService = async (readerId, unreadMessagesId) => {
  if (!readerId || !unreadMessagesId || !Array.isArray(unreadMessagesId)) {
    throw ApiError.BadRequest(
      "Missing or invalid required fields: readerId,  or unreadMessagesId"
    );
  }

  // Проверяем, чтобы все элементы в unreadMessagesId были валидными ObjectId
  const validIds = unreadMessagesId.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  if (validIds.length === 0) {
    throw ApiError.BadRequest("No valid message IDs provided");
  }

  // Проверяем сообщения, которые принадлежат получателю (receiverId === readerId)
  const messagesToRead = await Message.find({
    _id: { $in: validIds },
    receiverId: readerId, // Условие: сообщения должны быть отправлены пользователю с ID readerId
    isRead: false, // Только сообщения, которые ещё не прочитаны
  });

  if (!messagesToRead || messagesToRead.length === 0) {
    throw ApiError.BadRequest("No messages available to read for this user");
  }

  // Обновляем только сообщения, которые соответствуют условию (receiverId === readerId)
  await Message.updateMany(
    { _id: { $in: messagesToRead.map((msg) => msg._id) } }, // Обновляем только найденные сообщения
    { $set: { isRead: true } } // Устанавливаем isRead в true
  );

  // Возвращаем только указанные поля для обновлённых сообщений
  const updatedMessages = await Message.find({
    _id: { $in: messagesToRead.map((msg) => msg._id) },
  })
    .select("_id senderId receiverId message isRead createdAt updatedAt") // Указываем нужные поля
    .lean(); // Используем lean для возврата простых объектов, а не Mongoose документов

  // Переименовываем поле _id в id
  const formattedMessages = updatedMessages.map((msg) => ({
    id: msg._id, // Переименовываем _id в id
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    message: msg.message,
    conversationId: msg.conversationId,
    isRead: msg.isRead,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  }));

  return formattedMessages; // Возвращаем отформатированный массив сообщений
};

const getUnreadMessagesService = async (myUserId) => {
  const result = await Message.find({
    receiverId: myUserId,
    isRead: false,
  }).select("conversationId");

  // Используем reduce для подсчета количества непрочитанных сообщений по conversationId
  const conversationCounts = result.reduce((acc, message) => {
    const convId = message.conversationId.toString(); // Преобразуем ObjectId в строку для единообразия
    acc[convId] = (acc[convId] || 0) + 1;
    return acc;
  }, {});

  // Преобразуем объект в массив объектов { conversationId, count }
  const unreadMessages = Object.entries(conversationCounts).map(
    ([conversationId, count]) => ({
      conversationId,
      count,
    })
  );

  return unreadMessages;
};

export {
  sendMessageService,
  getAllConversationsService,
  getConversationService,
  readMessageService,
  getUnreadMessagesService,
};
