export type DivideIntoPiecesMarks = {
  value: number
}

type DivideResult = {
  array: DivideIntoPiecesMarks[]
  maxDivider: number
  minDivider: number
}

export const divideIntoPieces = (num: number): DivideResult => {
  const result: DivideResult = {
    array: [],
    maxDivider: 0,
    minDivider: 0,
  }

  for (let i = 5; i <= num; i++) {
    if (num % i === 0) {
      result.array.push({ value: i })
      if (result.maxDivider === 0 || i > result.maxDivider) {
        result.maxDivider = i
      }
      if (result.minDivider === 0 || i < result.minDivider) {
        result.minDivider = i
      }
    }
  }

  return result
}
