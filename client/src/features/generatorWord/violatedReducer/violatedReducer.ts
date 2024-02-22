import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../generatorWordTypes"

const violated: CaseReducer<IGeneratorWordState> = (state) => {
  state.testParams.violations = state.testParams.violations + 1
}

export default violated
