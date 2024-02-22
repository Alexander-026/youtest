import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleware.js";
import {
  createWordPairs,
  visitWordPairs,
  getAllWordPars,
  deleteWordPairs,
  updateWordPairs,
} from "../controllers/wordPairCardController.js";

const router = express.Router();

router.post("/create", createWordPairs);
router.put("/visit", visitWordPairs);
router.put("/update", updateWordPairs);
router.delete("/delete", deleteWordPairs);
router.get("/getAll/:id", getAllWordPars);

export default router;
