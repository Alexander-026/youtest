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
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);

  return {
    id: newMessage._id,
    senderId: newMessage.senderId,
    receiverId: newMessage.receiverId,
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
                  wasOnline: "$$participant.wasOnline"
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

export {
  sendMessageService,
  getAllConversationsService,
  getConversationService,
};
