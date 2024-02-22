import type { CaseReducer } from "@reduxjs/toolkit"
import checkWordsID from "../../../utils/checkWordsID"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"

const checkSelectedWords: CaseReducer<IGeneratorWordState> = (state) => {
  const { foreignId, nativeId, hasIds } = checkWordsID(state)

  if (state.wordPairCardPractic) {
    if (hasIds && foreignId !== nativeId) {
      state.testParams.selectedForeignKey = ""
      state.testParams.selectedNativeKey = ""
      state.testParams.totalMistakes++

      state.wordPairCardPractic.pairsWord =
        state.wordPairCardPractic.pairsWord.map((pair) =>
          pair.id === foreignId
            ? {
                ...pair,
                correctAnswers: Math.max(0, pair.correctAnswers - 1),
              }
            : pair,
        )
      return
    } else if (hasIds && foreignId === nativeId) {
      state.wordPairCardPractic.pairsWord =
        state.wordPairCardPractic.pairsWord.map((pair) =>
          pair.id === foreignId
            ? {
                ...pair,
                correctAnswers: Math.min(6, pair.correctAnswers + 1),
              }
            : pair,
        )

      const updatePairs = (pairs: Pair[]): Pair[] => {
        return pairs.map((p) =>
          p.id === foreignId ? { ...p, mastered: true } : p,
        )
      }

      state.piecesArrPairs[state.testParams.currentPair].pairs = updatePairs(
        state.piecesArrPairs[state.testParams.currentPair].pairs,
      )
      state.testParams.foreignArr = updatePairs(state.testParams.foreignArr)
      state.testParams.nativeArr = updatePairs(state.testParams.nativeArr)

      const pageMastered =
        !state.testParams.foreignArr.find((p) => !p.mastered) &&
        !state.testParams.nativeArr.find((p) => !p.mastered)

      state.testParams.pageMastered = pageMastered
      state.testParams.selectedForeignKey = ""
      state.testParams.selectedNativeKey = ""
    }
  }
}

export default checkSelectedWords
