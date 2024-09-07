import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"
import { divideIntoPieces } from "../../../utils/makeMarks"

const resetConfiguration: CaseReducer<IGeneratorWordState> = (state) => {
  state.wordPairCardPractic!.quantityForPractice =
    state.wordPairCardPractic!.totalWords
  state.wordPairCardPractic!.divideIntoPieces = 5
  state.wordPairCardPractic!.divideIntoPiecesMarks = divideIntoPieces(
    state.wordPairCardPractic!.totalWords,
  ).array
}

export default resetConfiguration
