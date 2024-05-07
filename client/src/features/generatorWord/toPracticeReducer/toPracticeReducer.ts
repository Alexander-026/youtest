import { current } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type {
  IGeneratorWordState,
  TypePractice,
} from "../../../types/wordPairs"

const toPractice: CaseReducer<
  IGeneratorWordState,
  PayloadAction<TypePractice>
> = (state, action) => {

  const {piecesArrPairs, testParams: {currentPair}} = current(state) 
  const currentArray = [...piecesArrPairs[currentPair].pairs]
  state.testParams.toPractice = action.payload
  state.testParams.currentArrayPairs = currentArray.map((pair) => ({id: pair.id, value: ''}))
}

export default toPractice
