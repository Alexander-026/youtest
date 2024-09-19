import type { IKeyString } from "./keyString"

export type Pair = {
  id: string
  foreign: string
  native: string
  transcription: string
  mastered: boolean
  correctAnswers: number
  correctlyWritted: number
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

export type TestType =  "writing" | "choice"
export type TypePractice = "native" | "foreign"
export type CurrentPair = {
  id: string
  value: string
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
  allMistakes:  Pair[]
  pageMastered: boolean
  testMastered: boolean
  violations: number
  totalMistakes: number
  hasMistake: string | null
  grade: string
  testType: TestType
  toPractice: null | TypePractice
  currentArrayPairs:  CurrentPair[]
  validCurrentArrayPairs: null | boolean

}

export interface IGeneratorWordState extends IKeyString {
  wordPairCardPractic: WordPairCardPractic | null
  piecesArrPairs: PiecesArrPars[]
  testParams: TestParams
}
export type GeneratorPars = {
  title: string
  pairsWord: string
}

export type InputPairs = {
  idUser: string
  title: string
  pairsWord: Pair[]
}

export type GradingInput = {
  id: string
  grade: string
  pairsWord: Pair[]
}
