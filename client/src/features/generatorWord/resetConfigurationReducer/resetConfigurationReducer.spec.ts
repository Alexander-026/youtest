import testWordPairCardPracticData from "../testWordPairCardPracticData"

import generatorReducer, {
  resetConfigurationAction,
  initialStateGeneratorWord,
} from "../generatorWordSlice"

describe("Reset Configuration Action", () => {
  it("should handle Reset", () => {
    const actual = generatorReducer(
      {
        ...initialStateGeneratorWord,
        wordPairCardPractic: testWordPairCardPracticData,
      },
      resetConfigurationAction(),
    )

    const {
      quantityForPractice,
      totalWords,
      divideIntoPieces,
      divideIntoPiecesMarks,
    } = actual.wordPairCardPractic!

    expect(quantityForPractice).toEqual(totalWords)
    expect(divideIntoPieces).toEqual(5)
    expect(divideIntoPiecesMarks).toEqual(divideIntoPiecesMarks)
  })
})
