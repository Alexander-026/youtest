import type { Pair } from "../types/wordPairs"

function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * (max - 0 + 1)) + 0
}

export default function fixArray(pairs: Pair[]): Pair[] {
  const arrLength = pairs.length
  const step = 5
  let requiredLength = 10
  const fixedArray = [...pairs]
  const necessaryIndexes: number[] = []

  do {
    if (requiredLength === arrLength) break
    requiredLength += step
  } while (requiredLength < arrLength)

  const requiredQuantity = requiredLength - arrLength

  if (requiredQuantity > 0) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const randomNumber = getRandomNumber(arrLength - 2)
      if (!necessaryIndexes.includes(randomNumber)) {
        necessaryIndexes.push(randomNumber)
        fixedArray.push(pairs[randomNumber])
        if (necessaryIndexes.length === requiredQuantity) {
          break
        }
      } else {
        continue
      }
    }

    return fixedArray
  } else {
    return pairs
  }
}
