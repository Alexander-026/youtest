import testWordPairCardPracticData from "../testWordPairCardPracticData"
import generatorReducer, {
  startTestAction,
  initialStateGeneratorWord,
} from "../generatorWordSlice"

export const stateWithStartedTest = generatorReducer(
  {
    ...initialStateGeneratorWord,
    wordPairCardPractic: {
      ...testWordPairCardPracticData,
    },
  },
  startTestAction(),
)

describe("on Start Test Action", () => {
  it("should hanlde  Start Test", () => {
    const actual = stateWithStartedTest

    expect(actual.piecesArrPairs.length).toEqual(2)
    expect(actual.testParams.foreignArr.length).toEqual(5)
    expect(actual.testParams.nativeArr.length).toEqual(5)
    expect(actual.testParams.totalPairs).toEqual(2)
  })
})
