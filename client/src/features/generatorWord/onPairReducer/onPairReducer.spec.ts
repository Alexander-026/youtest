import testWordPairCardData from "../testWordPairCardData"
import testWordPairCardPracticData from "../testWordPairCardPracticData"
import generatorReducer, {
  onPairAction,
  initialStateGeneratorWord,
} from "../generatorWordSlice"

export const stateWithOnPair = generatorReducer(
  initialStateGeneratorWord,
  onPairAction(testWordPairCardData),
)

describe("on Pair Action", () => {
  it("should handle null input", () => {
    expect(
      generatorReducer(initialStateGeneratorWord, onPairAction(null)),
    ).toEqual(initialStateGeneratorWord)
  })

  it("should handle WordPairCard object", () => {
    const actual = stateWithOnPair
    expect(actual).toEqual({
      ...initialStateGeneratorWord,
      wordPairCardPractic: testWordPairCardPracticData,
    })
  })
})
