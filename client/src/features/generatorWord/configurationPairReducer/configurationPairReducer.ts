import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"
import { divideIntoPieces } from "../../../utils/makeMarks"

const configurationPair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<{
    fieldName: "quantityForPractice" | "divideIntoPieces"
    value: number
  }>
> = (state, action) => {
  const { fieldName, value } = action.payload
  switch (fieldName) {
    case "quantityForPractice":
      state.wordPairCardPractic!.quantityForPractice = value
      state.wordPairCardPractic!.divideIntoPiecesMarks =
        divideIntoPieces(value).array
      state.wordPairCardPractic!.divideIntoPieces =
        divideIntoPieces(value).minDivider
      break
    case "divideIntoPieces":
      state.wordPairCardPractic!.divideIntoPieces = value
      break
    default:
      break
  }
}

export default configurationPair
