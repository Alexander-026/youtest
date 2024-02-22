import type { Pair } from "../types/wordPairs"

export default function filterArray(arr: Pair[]): {
  filtered: Pair[]
  updated: Pair[]
} {
  let filtered = []
  let updated = []

  filtered = arr.filter(
    (pair, index, self) =>
      !!pair.foreign && !!pair.native && self.indexOf(pair) === index,
  )

  updated = arr.filter((pair, index, self) => self.indexOf(pair) === index)

  return {
    filtered,
    updated,
  }
}
