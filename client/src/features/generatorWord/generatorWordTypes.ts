import type { IKeyString } from "../../types/keyString"

export type Pair = {
  id: string
  foreign: string
  native: string
  mastered: boolean
  correctAnswers: number
}

export type PiecesArrPars = {
  id: string
  pairs: Pair[]
}

export type WordPairCard = {
  id: string
  idUser: string
  title: string
  visited: boolean
  totalWords: number
  lastResult: number
  pairsWord: Pair[]
}
export type DivideIntoPiecesMarks = {
  value: number
}
export type WordPairCardPractic = WordPairCard & {
  fixedPairsWord: Pair[]
  quantityForPractice: number
  divideIntoPieces: number
  divideIntoPiecesMarks: DivideIntoPiecesMarks[]
}

export interface TestParams {
  title: string
  progress: number
  totalPairs: number
  currentPair: number
  selectedForeignKey: string
  selectedNativeKey: string
  foreignArr: Pair[]
  nativeArr: Pair[]
  currentPiese: Pair[]
  pageMastered: boolean
  testMastered: boolean
  violations: number
  totalMistakes: number
  grade: string
}

export interface IGeneratorWordState extends IKeyString {
  wordPairCardPractic: WordPairCardPractic | null
  piecesArrPairs: PiecesArrPars[]
  testParams: TestParams
}
