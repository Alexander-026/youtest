import { current } from "@reduxjs/toolkit"
import type { CaseReducer } from "@reduxjs/toolkit"
import type {
  IGeneratorWordState,
  Pair,
  PiecesArrPars,
} from "../../../types/wordPairs"
import { shuffle } from "../../../utils/shuffle"
const newLevel = new Audio("/success-next.mp3")

const nextPage: CaseReducer<IGeneratorWordState> = state => {
  const { pageMastered, currentPair, totalPairs, hasMistake } = state.testParams
  const currentPairNum = currentPair + (hasMistake ? 0 : 1)
  if (pageMastered && currentPairNum < totalPairs) {
    const pairs = current(state.piecesArrPairs).slice()

    const pair = hasMistake
      ? pairs.splice(currentPair,1)
      : false

    const updatedPair: PiecesArrPars | false = pair
      ? { id: pair[0].id, pairs: pair[0].pairs.map(p => ({ ...p, mastered: false })) }
      : false

    const updatedPairs =  updatedPair ? pairs.concat([updatedPair]) : state.piecesArrPairs

    state.piecesArrPairs = updatedPairs
    const piese = state.piecesArrPairs[currentPairNum]
   
    
    state.testParams.foreignArr = shuffle<Pair>(piese.pairs)
    state.testParams.nativeArr = shuffle<Pair>(piese.pairs)
    state.testParams.currentPair = currentPairNum
    state.testParams.pageMastered = false
    state.testParams.hasMistake = null
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
