import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import {
  sendMessageController,
  getAllConversationsController,
  getConversationController,
  readMessageController,
  getUnreadMessagesController
} from "../controllers/message.controller.js";
const router = express.Router();

router.post("/send/:id", authMiddleWare, sendMessageController);
router.post("/read/:id", authMiddleWare, readMessageController);
router.get("/conversations", authMiddleWare, getAllConversationsController);
router.get("/conversation/:id", authMiddleWare, getConversationController);
router.get("/getUnreadMessages", authMiddleWare, getUnreadMessagesController);

export default router;
