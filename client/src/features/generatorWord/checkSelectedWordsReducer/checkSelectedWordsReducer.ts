import { current } from "@reduxjs/toolkit";
import type { CaseReducer } from "@reduxjs/toolkit"
import checkWordsID from "../../../utils/checkWordsID"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"

const checkSelectedWords: CaseReducer<IGeneratorWordState> = state => {
  const piecesArrPairs = current(state.piecesArrPairs)
  const { foreignId, nativeId, hasIds } = checkWordsID(state)
  const {currentPair, } = state.testParams

  if (state.wordPairCardPractic) {
    if (hasIds && foreignId !== nativeId) {
      state.testParams.selectedForeignKey = ""
      state.testParams.selectedNativeKey = ""
      state.testParams.totalMistakes++

      state.wordPairCardPractic.pairsWord =
        state.wordPairCardPractic.pairsWord.map(pair => {
          if (pair.id === foreignId) {
            return {
              ...pair,
              correctAnswers: Math.max(-1, pair.correctAnswers - 1),
            }
          } else {
            return pair
          }
        })
        state.testParams.hasMistake = piecesArrPairs[currentPair].id
        const mistake = state.wordPairCardPractic.pairsWord.find((p) => p.id === foreignId)
        if(mistake && !state.testParams.allMistakes.find(p => p.id === mistake.id)) {
          state.testParams.allMistakes.push(mistake)
        }
      return
    } else if (hasIds && foreignId === nativeId) {
      state.wordPairCardPractic.pairsWord =
        state.wordPairCardPractic.pairsWord.map(pair =>
          pair.id === foreignId
            ? {
                ...pair,
                correctAnswers: Math.min(6, pair.correctAnswers + 1),
              }
            : pair,
        )

      const updatePairs = (pairs: Pair[]): Pair[] => {
        return pairs.map(p =>
          p.id === foreignId ? { ...p, mastered: true } : p,
        )
      }

      state.piecesArrPairs[state.testParams.currentPair].pairs = updatePairs(
        state.piecesArrPairs[state.testParams.currentPair].pairs,
      )
      state.testParams.foreignArr = updatePairs(state.testParams.foreignArr)
      state.testParams.nativeArr = updatePairs(state.testParams.nativeArr)

      const pageMastered =
        !state.testParams.foreignArr.find(p => !p.mastered) &&
        !state.testParams.nativeArr.find(p => !p.mastered)

      state.testParams.pageMastered = pageMastered
      state.testParams.selectedForeignKey = ""
      state.testParams.selectedNativeKey = ""
    }
  }
}

export default checkSelectedWords
