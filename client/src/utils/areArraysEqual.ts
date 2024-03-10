import type { Pair } from "../types/wordPairs"

export const areArraysEqual = (arr1: Pair[], arr2: Pair[]): boolean => {
  const unigWords: string[] = []
  const filtered = arr2.filter((item) => {
    const word = `${item.foreign.toLocaleLowerCase()}-${item.native.toLocaleLowerCase()}`
    if (!unigWords.includes(word)) {
      unigWords.push(word)
      return true
    }else {
      return  false
    }
  })
  if (arr1.length !== filtered.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].foreign !== filtered[i].foreign ||
      arr1[i].native !== filtered[i].native
    ) {
      return false
    }
  }

  return true
}
