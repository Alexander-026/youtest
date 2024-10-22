import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import {
  sendMessageController,
  getAllConversationsController,
  getConversationController,
} from "../controllers/message.controller.js";
const router = express.Router();

router.post("/send/:id", authMiddleWare, sendMessageController);
router.get("/conversations", authMiddleWare, getAllConversationsController);
router.get("/conversation/:id", authMiddleWare, getConversationController);

export default router;
