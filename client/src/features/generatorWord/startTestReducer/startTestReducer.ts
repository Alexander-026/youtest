import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState, Pair, PiecesArrPars } from "../generatorWordTypes"
import { shuffle } from "../../../utils/shuffle"
import { makePieces } from "../../../utils/makePieces"

// Reducer function for handling the startTest action
const startTest: CaseReducer<IGeneratorWordState> = (state) => {
  // Extracting relevant information from the current state
  const { quantityForPractice, divideIntoPieces, fixedPairsWord } =
    state.wordPairCardPractic! // Assuming wordPairCardPractic is never null here

  // Shuffle the fixedPairsWord array
  const shuffledPairsWord = shuffle<Pair>(fixedPairsWord)

  // Create pieces of pairs for the test
  const piecesPairs = makePieces(
    shuffledPairsWord,
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
  state.testParams.currentPiese = piese.pairs
  state.testParams.totalPairs = piecesPairs.length
}

export default startTest
