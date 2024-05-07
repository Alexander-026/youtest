import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const updatePair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<{ id: string; field: "native" | "foreign"; value: string }>
> = (state, action) => {
  const { id, field, value } = action.payload
  const { wordPairCardPractic } = state

  if (!wordPairCardPractic) return

  const { pairsWord } = wordPairCardPractic

  const index = pairsWord.findIndex(p => p.id === id)

  if (index !== -1) {
    pairsWord[index][field] = value
  }
}

export default updatePair
