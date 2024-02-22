import type { Pair } from "../types/wordPairs"

const sumLearnedWords = (pairs: Pair[]): number => {
  let sum = 0

  pairs.forEach((pair) => {
    if (pair.correctAnswers > 5) {
      sum++
    }
  })

  return sum
}

export default sumLearnedWords
