import type { Pair } from "../types/wordPairs"

const sumLearnedWords = (pairs: Pair[], type: "correctAnswers" | "correctlyWritted" ): number => {
  let sum = 0

  pairs.forEach((pair) => {
    if (pair[type] > 5) {
      sum++
    }
  })

  return sum
}

export default sumLearnedWords
