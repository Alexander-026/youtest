import {
  configurationPair,
  deteleWord,
  addPair,
  addManyPairs,
  checkSelectedWords,
  nextPage,
  onPair,
  resetConfiguration,
  selectWord,
  startTest,
  updatePair,
  violated,
  resetUpdatePair,
} from "./generatorWordReducers"

import { createSlice } from "@reduxjs/toolkit"
import type { IGeneratorWordState, TestParams } from "../../types/wordPairs"

export const initTestParams: TestParams = {
  title: "",
  progress: 0,
  totalPairs: 0,
  currentPair: 0,
  selectedForeignKey: "",
  selectedNativeKey: "",
  foreignArr: [],
  nativeArr: [],
  currentPiese: [],
  pageMastered: false,
  testMastered: false,
  violations: 0,
  totalMistakes: 0,
  grade: "null",
}

export const initialStateGeneratorWord: IGeneratorWordState = {
  wordPairCardPractic: null,
  piecesArrPairs: [],
  testParams: { ...initTestParams },
}

export const generatorWordsSlice = createSlice({
  name: "generator-pare-words",
  initialState: initialStateGeneratorWord,
  reducers: {
    onPair,
    startTest,
    resetConfiguration,
    selectWord,
    checkSelectedWords,
    configurationPair,
    nextPage,
    violated,
    updatePair,
    resetUpdatePair,
    deteleWord,
    addPair,
    addManyPairs,
  },
})

export const {
  onPair: onPairAction,
  startTest: startTestAction,
  resetConfiguration: resetConfigurationAction,
  selectWord: selectWordAction,
  checkSelectedWords: checkSelectedWordsAction,
  configurationPair: configurationPairAction,
  nextPage: nextPageAction,
  violated: violatedAction,
  updatePair: updatePairAction,
  deteleWord: deteleWordAction,
  addPair: addPairAction,
  addManyPairs: addManyPairsAction,
} = generatorWordsSlice.actions

export default generatorWordsSlice.reducer
