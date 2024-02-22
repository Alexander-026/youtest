import type { WordPairCardPractic } from "../../types/wordPairs"
import testWordPairCardData from "./testWordPairCardData"

const testWordPairCardPracticData: WordPairCardPractic = {
  ...testWordPairCardData,
  fixedPairsWord: testWordPairCardData.pairsWord,
  quantityForPractice: 10,
  divideIntoPieces: 5,
  divideIntoPiecesMarks: [{ value: 5 }, { value: 10 }],
}

export default testWordPairCardPracticData
