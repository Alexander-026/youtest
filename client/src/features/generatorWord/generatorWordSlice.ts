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
  onTestType,
  toPractice,
  updateCurrentPairsArr,
  checkCurrentPairsArr
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
  allMistakes: [],
  pageMastered: false,
  testMastered: false,
  violations: 0,
  totalMistakes: 0,
  hasMistake: null,
  grade: "null",
  testType: "choice",
  toPractice: null,
  currentArrayPairs: [],
  validCurrentArrayPairs: null
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
    onTestType,
    toPractice,
    updateCurrentPairsArr,
    checkCurrentPairsArr
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
  onTestType: onTestTypeAction,
  toPractice: toPracticeAction,
  updateCurrentPairsArr: updateCurrentPairsArrAction,
  checkCurrentPairsArr: checkCurrentPairsArrAction
} = generatorWordsSlice.actions

export default generatorWordsSlice.reducer
