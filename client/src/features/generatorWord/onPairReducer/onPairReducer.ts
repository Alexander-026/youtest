import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import { initTestParams } from "../generatorWordSlice"
import fixArray from "../../../utils/fixArray"
import { divideIntoPieces } from "../../../utils/makeMarks"
import type { IGeneratorWordState, WordPairCard } from "../../../types/wordPairs"

// Reducer function for handling onPair action
const onPair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<WordPairCard | null>
> = (state, action) => {
  if (action.payload) {
    // Clone the payload and remove __typename
    const pair = action.payload

    // Remove __typename from each pair in pairsWord array

    // Fix the array length and set the state accordingly
    const fixedArr = fixArray(pair.pairsWord)
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
