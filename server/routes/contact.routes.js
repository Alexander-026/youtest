import express from "express";
import { sendEmail } from "../controllers/contact.controller.js";

const router = express.Router();



router.post("/sendemail", sendEmail)


export default router;
