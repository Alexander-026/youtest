import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"
import checkSelectedWords from "../checkSelectedWordsReducer/checkSelectedWordsReducer"
import checkWordsID from "../../../utils/checkWordsID"
const wrongAnswer: HTMLAudioElement = new Audio("/wrong-answer.mp3")

const selectWord: CaseReducer<
  IGeneratorWordState,
  PayloadAction<{ keyName: "foreign" | "native"; key: string }>
> = (state, action) => {
  const { keyName, key } = action.payload
  const { hasIds } = checkWordsID(state)
  if (hasIds) {
    checkSelectedWords(state, { type: "" })
  }

  if (keyName === "foreign") {
    state.testParams.selectedForeignKey = key
  }
  if (keyName === "native") {
    state.testParams.selectedNativeKey = key
  }

  const uforeignId = state.testParams.selectedForeignKey.split(" ")[0]
  const unativeId = state.testParams.selectedNativeKey.split(" ")[0]
  const uhasIds = !!uforeignId && !!unativeId

  if (uhasIds && uforeignId !== unativeId) {
    wrongAnswer.currentTime = 0
    wrongAnswer.play()
  }
}

export default selectWord
