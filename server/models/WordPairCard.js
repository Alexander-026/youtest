import { Schema, model, ObjectId } from "mongoose";

export const wordPairCard = new Schema({
  idUser: { type: ObjectId, ref: "User" },
  title: { type: String, require: true },
  visited: { type: Boolean, default: false },
  totalWords: { type: Number, require: true },
  lastResult: { type: String, default: "0" },
  pairsWord: [
    {
      id: { type: String, required: true },
      foreign: { type: String, require: true },
      native: { type: String, require: true },
      transcription: { type: String, require: true },
      mastered: { type: Boolean, default: false },
      correctAnswers: { type: Number, default: 0 },
    },
  ],
});

export const WordPairCard = model("WordPairCard", wordPairCard);
