// import ApiError from "../exceptions/apiError.js";

import {
  create,
  getAll,
  update,
  detelePairs,
  evaluate,
  visit,
} from "../service/wordPairCardService.js";

const createWordPairs = async (req, res, next) => {
  try {
    const { idUser, title, pairsWord } = req.body;
    const newWordPairs = await create(idUser, title, pairsWord);

    return res.status(201).json(newWordPairs);
  } catch (error) {
    next(error);
  }
};

const visitWordPairs = async (req, res, next) => {
  try {
    const result = await visit(req.body.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateWordPairs = async (req, res, next) => {
  try {
    const { id, pairsWord } = req.body;
    const result = await update(id, pairsWord);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteWordPairs = async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await detelePairs(id);
    return res.status(204).json(result);
  } catch (error) {
    next(error);
  }
};

const evaluateTest = async (req, res, next) => {
  try {
    const { id, grade, pairsWord } = req.body;
    const evaluatedTest = await evaluate(id, grade, pairsWord);

    return res.status(200).json(evaluatedTest);
  } catch (error) {
    next(error);
  }
};

const getAllWordPars = async (req, res, next) => {
  try {
    const wordCards = await getAll(req.params.id);
    return res.json(wordCards);
  } catch (error) {
    next(error);
  }
};

export {
  createWordPairs,
  visitWordPairs,
  updateWordPairs,
  deleteWordPairs,
  evaluateTest,
  getAllWordPars,
};
