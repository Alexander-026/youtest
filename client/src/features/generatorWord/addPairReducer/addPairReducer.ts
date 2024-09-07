import type { CaseReducer } from "@reduxjs/toolkit"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"
import { v4 as uuid } from "uuid"

// Case reducer for adding a new pair to the wordPairCardPractic state
const addPair: CaseReducer<IGeneratorWordState> = (state) => {
  // Check if the wordPairCardPractic property exists in the state
  if (state.wordPairCardPractic) {
    // Destructure the pairsWord array from the existing state
    const { pairsWord } = state.wordPairCardPractic

    // Create a new pair with a unique ID using uuid()
    const newPair: Pair = {
      id: uuid(),
      foreign: "",
      native: "",
      transcription: "",
      mastered: false,
      correctAnswers: 0,
    }

    // Create a new array with the new pair added at the beginning
    const newArr = [newPair, ...pairsWord]

    // Update the state with the new array of pairs
    state.wordPairCardPractic.pairsWord = newArr
  } else {
    // If wordPairCardPractic is not defined, do nothing or handle the case appropriately
    return
  }
}

export default addPair
