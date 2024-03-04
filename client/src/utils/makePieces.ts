import { v4 as uuid } from "uuid"
import type { Pair, PiecesArrPars } from "../types/wordPairs"

/**
 * Function to distribute pairs into pieces without duplicates.
 * @param pairs - Array of Pair objects to distribute.
 * @param quantity - Total number of pairs to consider.
 * @param piese - Number of pieces to distribute pairs into.
 * @returns An array of PiesesArrPars representing the distribution of pairs.
 */
export const makePieces = (
  pairs: Pair[],
  quantity: number,
  piese: number,
): PiecesArrPars[] => {
  // Calculate the expected length of the resulting array
  const resLength = Math.floor(quantity / piese)
  // Initialize the resulting array with unique IDs and empty pairs array
  const result: PiecesArrPars[] = Array.from({ length: resLength }, () => ({
    id: uuid(),
    pairs: [],
  }))

  

  // Trim the pairs array to the specified quantity
  const trimmed = pairs.slice(0, quantity)

  // Iterate through the trimmed pairs array
  trimmed.forEach((p, index) => {
    let added = false

    // Check if the pair is already present in other subarrays
    for (let i = 0; i < result.length; i++) {
      const hasPair = result[i].pairs.find(item => item.id === p.id)

      // If not present and the subarray is not full, add the pair
      if (!hasPair && result[i].pairs.length < piese) {
        result[i].pairs.push(p)
        added = true
        break
      }
    }

    // If the pair is not added to other subarrays, add it to the first available one
    // && result[index % resLength].pairs.length < piese
    if (!added && piese !== pairs.length) {
      result[index % resLength].pairs.push(p)
    }
  })
  return result
}
