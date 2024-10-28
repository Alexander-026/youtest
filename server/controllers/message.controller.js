import {
  getAllConversationsService,
  getConversationService,
  readMessageService,
  sendMessageService,
  getUnreadMessagesService
} from "../service/message.service.js";
import {  } from "../service/user.service.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessageController = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    const receiverSocketId = getReceiverSocketId(receiverId);
    const newMessage = await sendMessageService(receiverId, senderId, message);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

const getAllConversationsController = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const allConversations = await getAllConversationsService(senderId);

    return res.status(200).json(allConversations);
  } catch (error) {
    next(error);
  }
};

const getConversationController = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { id: conversationId } = req.params;

    const conversation = await getConversationService(conversationId, senderId);

   

    return res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

const readMessageController = async (req, res, next) => {
  try {
   
    const readerId = req.user.id;
    const { id: receiverId } = req.params;
    const { unreadMessagesId } = req.body;

    const receiverSocketId = getReceiverSocketId(receiverId);

    const readMessages = await  readMessageService(readerId,  unreadMessagesId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("readMessages", readMessages);
    }

    return res.status(200).json(readMessages)
  } catch (error) {
    next(error);
  }
};


const getUnreadMessagesController = async (req, res, next) => {
  try {
    const myUserId = req.user.id;
    const result = await getUnreadMessagesService(myUserId)

    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export {
  sendMessageController,
  getAllConversationsController,
  getConversationController,
  readMessageController,
  getUnreadMessagesController
};


