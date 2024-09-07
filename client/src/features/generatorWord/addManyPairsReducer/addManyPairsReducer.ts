import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"
const addManyPairs: CaseReducer<IGeneratorWordState, PayloadAction<Pair[]>> = (
  state,
  action,
) => {
  const pairs = action.payload

  if (state.wordPairCardPractic) {
    const { pairsWord } = state.wordPairCardPractic
    const newArr = [...pairs, ...pairsWord]
    state.wordPairCardPractic.pairsWord = newArr
  } else {
    return
  }
}

export default addManyPairs
