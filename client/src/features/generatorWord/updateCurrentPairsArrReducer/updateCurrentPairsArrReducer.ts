import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const updateCurrentPairsArr: CaseReducer<
  IGeneratorWordState,
  PayloadAction<{ id: string; value: string }>
> = (state, action) => {
  const { currentArrayPairs } = state.testParams
  const { id, value } = action.payload

  const index = currentArrayPairs.findIndex(p => p.id === id)

  if (index !== -1) {
    currentArrayPairs[index].value = value
  }
}

export default updateCurrentPairsArr
