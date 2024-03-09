import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { initTestParams } from "../generatorWordSlice"
import fixArray from "../../../utils/fixArray"
import { divideIntoPieces } from "../../../utils/makeMarks"
import type {
  IGeneratorWordState,
  Pair,
  WordPairCard,
} from "../../../types/wordPairs"
import { shuffle } from "../../../utils/shuffle"

// Reducer function for handling onPair action
const onPair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<WordPairCard | null>
> = (state, action) => {
  if (action.payload) {
    const pair = action.payload

    const shuffledPairsWord = shuffle<Pair>(pair.pairsWord)

    // Fix the array length and set the state accordingly
    const fixedArr = fixArray(shuffledPairsWord)
    state.wordPairCardPractic = {
      ...pair,
      quantityForPractice: fixedArr.length,
      fixedPairsWord: fixedArr,
      divideIntoPieces: 5,
      divideIntoPiecesMarks: divideIntoPieces(fixedArr.length).array,
    }
  } else {
    // Handle null payload case
    state.wordPairCardPractic = action.payload
    state.piecesArrPairs = []
    state.testParams = initTestParams
  }
}

export default onPair
