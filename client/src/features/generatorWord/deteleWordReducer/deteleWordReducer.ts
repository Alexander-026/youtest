import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const deteleWord: CaseReducer<IGeneratorWordState, PayloadAction<string>> = (
  state,
  action,
) => {
  if (state.wordPairCardPractic) {
    const id = action.payload
    const { pairsWord } = state.wordPairCardPractic
    const newPairsWord = pairsWord.filter((p) => p.id !== id)
    state.wordPairCardPractic.pairsWord = newPairsWord
  }
}

export default deteleWord
