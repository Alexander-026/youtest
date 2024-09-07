import generatorReducer, {
  configurationPairAction,
} from "../generatorWordSlice"
import { stateWithOnPair } from "../onPairReducer/onPairReducer.spec"

describe("configuration Pair Action", () => {
  it("should hanlde configuration divideIntoPieces with value 5", () => {
    const fieldName = "divideIntoPieces"
    expect(fieldName).toEqual("divideIntoPieces")
    expect(fieldName).not.toEqual("quantityForPractice")
    const configured = generatorReducer(
      stateWithOnPair,
      configurationPairAction({ fieldName, value: 5 }),
    )
    const { divideIntoPieces, divideIntoPiecesMarks, quantityForPractice } =
      configured.wordPairCardPractic!

    expect(divideIntoPieces).toEqual(5)
    expect(quantityForPractice).toEqual(10)
    expect(divideIntoPiecesMarks).toEqual([{ value: 5 }, { value: 10 }])
  })
  it("should hanlde configuration divideIntoPieces with value 10", () => {
    const fieldName = "divideIntoPieces"
    expect(fieldName).toEqual("divideIntoPieces")
    expect(fieldName).not.toEqual("quantityForPractice")
    const configured = generatorReducer(
      stateWithOnPair,
      configurationPairAction({ fieldName, value: 10 }),
    )

    const { divideIntoPieces, divideIntoPiecesMarks, quantityForPractice } =
      configured.wordPairCardPractic!

    expect(divideIntoPieces).toEqual(10)
    expect(quantityForPractice).toEqual(10)
    expect(divideIntoPiecesMarks).toEqual([{ value: 5 }, { value: 10 }])
  })
  it("should hanlde configuration quantityForPractice with value 10", () => {
    const fieldName = "quantityForPractice"
    expect(fieldName).toEqual("quantityForPractice")
    expect(fieldName).not.toEqual("divideIntoPieces")
    const configured = generatorReducer(
      stateWithOnPair,
      configurationPairAction({ fieldName, value: 10 }),
    )

    const { divideIntoPieces, divideIntoPiecesMarks, quantityForPractice } =
      configured.wordPairCardPractic!

    expect(quantityForPractice).toEqual(10)
    expect(divideIntoPieces).toEqual(5)
    expect(divideIntoPiecesMarks).toEqual([{ value: 5 }, { value: 10 }])
  })
})
