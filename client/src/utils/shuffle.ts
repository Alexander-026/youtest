/**
 * Shuffles the elements of an array using the Fisher-Yates shuffle algorithm.
 * @param {T[]} arr - The input array to be shuffled.
 * @returns {T[]} - The shuffled array.
 */
export const shuffle = <T>(arr: T[]): T[] => {
  // Create a copy of the original array
  const shuffledArray = [...arr]

  // Implement the Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  // Return the shuffled array
  return shuffledArray
}
