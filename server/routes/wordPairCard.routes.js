import express from "express";
import { authMiddleWare, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createWordPairs,
  visitWordPairs,
  getAllWordPars,
  deleteWordPairs,
  evaluateTest,
  updateWordPairs,
} from "../controllers/wordPairCard.controller.js";

const router = express.Router();

router.post("/create",  createWordPairs);
router.put("/visit", visitWordPairs);
router.put("/update", updateWordPairs);
router.put("/evaluate", evaluateTest);
router.delete("/delete", deleteWordPairs);
router.get("/getAll/:id", getAllWordPars);

export default router;
