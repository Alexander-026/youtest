import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const updatePair: CaseReducer<
  IGeneratorWordState,
  PayloadAction<{ id: string; field: "native" | "foreign"; value: string }>
> = (state, action) => {
  if (state.wordPairCardPractic) {
    const { id, field, value } = action.payload
    const { pairsWord } = state.wordPairCardPractic

    state.wordPairCardPractic.pairsWord = pairsWord.map((p) => {
      if (p.id === id) {
        if (field === "foreign") {
          p.foreign = value
          return p
        }
        if (field === "native") {
          p.native = value
          return p
        }
        return p
      } else {
        return p
      }
    })
  } else {
    return
  }
}

export default updatePair
