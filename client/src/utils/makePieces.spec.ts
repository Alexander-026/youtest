import type {
  Pair,
  PiecesArrPars,
} from "../types/wordPairs"
import { makePieces } from "./makePieces"

describe("makePieces function", () => {
  it("should distribute pairs into pieces without duplicates and with correct division", () => {
    // Generate an array of pairs for testing
    const pairs: Pair[] = Array.from({ length: 10 }, (_, index) => ({
      id: `pair_${index}`,
      foreign: `foreign_${index}`,
      transcription: `transcription${index}`,
      native: `native_${index}`,
      mastered: false,
      correctAnswers: 0,
    }))

    // Set the quantity of pairs and the desired number of pieces
    const quantity = 10
    const piese = 5

    // Call your function to create pieces
    const result: PiecesArrPars[] = makePieces(pairs, quantity, piese)

    // Check that all subarrays have unique objects with the expected length
    result.forEach(({ pairs: subArray }) => {
      const uniqueIds = new Set(subArray.map((item) => item.id))

      // Check that the number of unique IDs is equal to the length of the subarray
      expect(uniqueIds.size).toBe(subArray.length)

      // Check that the number of unique IDs is equal to the specified 'piese' value
      expect(uniqueIds.size).toBe(piese)
    })

    // Check that the number of created subarrays matches the expected value
    expect(result.length).toBe(Math.floor(quantity / piese))

    // Check that the division of quantity by piese is without remainder
    expect(quantity % piese).toBe(0)

    // Check that piese is at least 5
    expect(piese).toBeGreaterThanOrEqual(5)

    // Check that piese is at most the length of pairs
    expect(piese).toBeLessThanOrEqual(pairs.length)
  })

  // Add other tests based on the functionality of your function
})
