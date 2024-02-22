import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState, Pair } from "../generatorWordTypes"
import { shuffle } from "../../../utils/shuffle"
const newLevel = new Audio("/success-next.mp3")

const nextPage: CaseReducer<IGeneratorWordState> = (state) => {
  const { pageMastered, currentPair, totalPairs } = state.testParams
  const currentPairNum = currentPair + 1
  if (pageMastered && currentPairNum < totalPairs) {
    const piecesPairs = state.piecesArrPairs
    const piese = piecesPairs[currentPairNum]
    state.testParams.foreignArr = shuffle<Pair>(piese.pairs)
    state.testParams.nativeArr = shuffle<Pair>(piese.pairs)
    state.testParams.currentPiese = piese.pairs
    state.testParams.currentPair = currentPairNum
    state.testParams.pageMastered = false
  } else {
    const totalPairs = state.testParams.totalPairs
    const divideIntoPieces = state.wordPairCardPractic?.divideIntoPieces || 5
    const totalWords = totalPairs * divideIntoPieces
    const totalMistakes = state.testParams.totalMistakes
    const percent = 100 - (totalMistakes / totalWords) * 100
    const percentage = percent < 0 ? 0 : percent
    state.testParams.testMastered = true
    state.testParams.grade = `${Math.round(percentage)}`
  }
  state.testParams.progress =
    currentPairNum * (100 / state.piecesArrPairs.length)
  newLevel.play()
}

export default nextPage
