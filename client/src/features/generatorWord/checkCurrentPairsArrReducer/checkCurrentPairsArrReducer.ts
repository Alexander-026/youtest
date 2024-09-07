import type { CaseReducer } from "@reduxjs/toolkit"
import { current } from "@reduxjs/toolkit"
import type { IGeneratorWordState } from "../../../types/wordPairs"

const checkCurrentPairsArr: CaseReducer<IGeneratorWordState> = state => {
  const {
    piecesArrPairs,
    testParams: {
      currentArrayPairs,
      currentPair,
      toPractice,
      totalPairs,
      totalMistakes,
    },
  } = current(state)

  if (!toPractice || !state.wordPairCardPractic) return
  const currentOriginalArrPairs = piecesArrPairs[currentPair].pairs

  const mistakes = currentOriginalArrPairs.filter((p, i) => {
    const original = currentOriginalArrPairs[i][toPractice].toLowerCase()
    const practic = currentArrayPairs[i].value.toLowerCase()
    console.log("original", original)
    console.log("practic", practic)

    return original !== practic
  })

  if (mistakes.length === 0) {
    state.wordPairCardPractic.pairsWord =
      state.wordPairCardPractic.pairsWord.map(p => {
        const pair = currentOriginalArrPairs.find(m => m.id === p.id)
        if (pair) {
          p.correctAnswers = Math.max(0, pair.correctAnswers + 1)
        }
        return p
      })
    state.testParams.validCurrentArrayPairs = null
    const currentPairNum = currentPair + 1
    if (currentPair < totalPairs - 1) {
      state.testParams.currentPair = currentPairNum
      const currentArray = [...piecesArrPairs[currentPairNum].pairs]
      state.testParams.currentArrayPairs = currentArray.map(pair => ({
        id: pair.id,
        value: "",
      }))
    } else {
      const totalPairs = state.testParams.totalPairs
      const divideIntoPieces = state.wordPairCardPractic?.divideIntoPieces || 5
      const totalWords = totalPairs * divideIntoPieces
      const percent = 100 - (totalMistakes / totalWords) * 100
      const percentage = percent < 0 ? 0 : percent
      state.testParams.testMastered = true
      state.testParams.grade = `${Math.round(percentage)}`
    }
    state.testParams.progress =
      currentPairNum * (100 / state.piecesArrPairs.length)
  } else {
    state.testParams.validCurrentArrayPairs = false
    state.testParams.totalMistakes = totalMistakes + mistakes.length
    state.wordPairCardPractic.pairsWord =
      state.wordPairCardPractic.pairsWord.map(p => {
        const pair = mistakes.find(m => m.id === p.id)
        if (pair) {
          p.correctAnswers = Math.max(0, pair.correctAnswers - 1)
        }
        return p
      })
  }

  console.log("isValid", mistakes)
}

export default checkCurrentPairsArr
