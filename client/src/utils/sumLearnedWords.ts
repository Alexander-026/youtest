import type { Pair } from "../features/generatorWord/generatorWordTypes"

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
