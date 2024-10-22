import wordPairsDto from "../dtos/wordPairsDto.js";
import { WordPairCard } from "../models/wordPairCard.model.js";

const create = async (idUser, title, pairsWord) => {
  const result = await WordPairCard.create({
    idUser,
    title,
    pairsWord,
    totalWords: pairsWord.length,
  });

  const newPairWords = wordPairsDto(result);

  return newPairWords;
};

const visit = async (id) => {
  const pair = await WordPairCard.findByIdAndUpdate(
    id,
    { $set: { visited: true } },
    { returnDocument: "after" }
  );
  const newPairWords = wordPairsDto(pair);

  return newPairWords;
};

const update = async (id, pairsWord) => {
  const pair = await WordPairCard.findByIdAndUpdate(
    id,
    { $set: { pairsWord: pairsWord, totalWords: pairsWord.length } },
    { returnDocument: "after" }
  );
  const newPairWords = wordPairsDto(pair);

  return newPairWords;
};

const detelePairs = async (id) => {
  const deleted = await WordPairCard.findByIdAndDelete(id);
  return deleted;
};

const getAll = async (id) => {
  const result = await WordPairCard.find({ idUser: id });

  const cards = result.map((item) => wordPairsDto(item));

  return cards;
};

const evaluate = async (id, grade, pairsWord) => {
  const pair = await WordPairCard.findByIdAndUpdate(
    id,
    {
      $set: { lastResult: grade, pairsWord },
    },
    { returnDocument: "after" }
  );
  const newPairWords = wordPairsDto(pair);

  return newPairWords;
};

export { create, visit, update, detelePairs, evaluate, getAll };
