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

  const trimmed = pairs.slice(0,quantity)


  let currentResIndex = 0
  let currentItemIndex = 0

  while (trimmed.length > 0) {
    const pair = trimmed[currentItemIndex]
    if (!result[currentResIndex].pairs.includes(pair)) {
      if (result[currentResIndex].pairs.length < piese) {
        result[currentResIndex].pairs.push(pair)
        trimmed.splice(currentItemIndex, 1)
      } else {
        currentResIndex++
        currentItemIndex = 0
      }
    } else {
      currentItemIndex++
    }
  }

  return result
}
