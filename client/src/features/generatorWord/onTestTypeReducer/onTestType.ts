import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState, TestType } from "../../../types/wordPairs"

const onTestType: CaseReducer<
  IGeneratorWordState,
  PayloadAction<TestType>
> = (state, action) => {
 
  state.testParams.testType = action.payload
}

export default onTestType
