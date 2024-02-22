import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"

const resetUpdatePair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<Pair[]>
> = (state, action) => {
  if (state.wordPairCardPractic) {
    state.wordPairCardPractic.pairsWord = action.payload
  } else {
    return
  }
}

export default resetUpdatePair
