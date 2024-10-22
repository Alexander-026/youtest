import {
  getAllConversationsService,
  getConversationService,
  sendMessageService,
} from "../service/message.service.js";
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

export {
  sendMessageController,
  getAllConversationsController,
  getConversationController,
};
