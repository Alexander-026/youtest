import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const violated: CaseReducer<IGeneratorWordState> = (state) => {
  state.testParams.violations = state.testParams.violations + 1
}

export default violated
