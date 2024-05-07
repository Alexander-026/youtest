import { current, type CaseReducer } from "@reduxjs/toolkit"
import type {
  IGeneratorWordState,
  Pair,
  PiecesArrPars,
} from "../../../types/wordPairs"
import { shuffle } from "../../../utils/shuffle"
import { makePieces } from "../../../utils/makePieces"

// Reducer function for handling the startTest action
const startTest: CaseReducer<IGeneratorWordState> = state => {
  const stateWordPairCardPractic = current(state)
  if (!stateWordPairCardPractic.wordPairCardPractic) return
  // Extracting relevant information from the current state
  const { quantityForPractice, divideIntoPieces, fixedPairsWord } =
    stateWordPairCardPractic.wordPairCardPractic // Assuming wordPairCardPractic is never null here

  const piecesPairs = makePieces(
    fixedPairsWord,
    quantityForPractice,
    divideIntoPieces,
  )


  // Shuffle the pieces and assign them to state.piesesArrPairs
  state.piecesArrPairs = shuffle<PiecesArrPars>(piecesPairs)

  // Select the current piece from piesesArrPairs
  const piese = state.piecesArrPairs[state.testParams.currentPair]

  // Shuffle and assign foreignArr and nativeArr for the current test
  state.testParams.foreignArr = shuffle<Pair>(piese.pairs)
  state.testParams.nativeArr = shuffle<Pair>(piese.pairs)

  // Update testParams with relevant information
  state.testParams.totalPairs = piecesPairs.length
}

export default startTest
