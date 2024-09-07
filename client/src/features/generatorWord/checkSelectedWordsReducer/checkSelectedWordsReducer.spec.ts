import { stateWithStartedTest } from "./../startTestReducer/startTestReducer.spec"
import generatorReducer, {
  checkSelectedWordsAction,
} from "../generatorWordSlice"
import type { IGeneratorWordState, Pair } from "../../../types/wordPairs"

interface TestCheckKeysParams {
  foreignKey: string
  nativeKey: string
  expectedNativeIsMastered: boolean
  expectedForeignIsMastered: boolean
  expectedTotalMistakes: number
  expectedCorrectAnswers: number
}

const checkKeys = (foreign: string, native: string): IGeneratorWordState => {
  return generatorReducer(
    {
      ...stateWithStartedTest,
      testParams: {
        ...stateWithStartedTest.testParams,
        selectedForeignKey: foreign,
        selectedNativeKey: native,
      },
    },
    checkSelectedWordsAction(),
  )
}

const { foreignArr, nativeArr } = stateWithStartedTest.testParams

const firstForeignPair = foreignArr[0]
const firstNativePair = nativeArr.find(
  (pair: Pair) => pair === firstForeignPair,
)!
const secondNativePair = nativeArr.find(
  (pair: Pair) => pair !== firstForeignPair,
)!

describe("check selected words action", () => {
  const testCheckKeys = ({
    foreignKey,
    nativeKey,
    expectedNativeIsMastered,
    expectedForeignIsMastered,
    expectedTotalMistakes,
    expectedCorrectAnswers,
  }: TestCheckKeysParams) => {
    const stateWithCheckedKeys = checkKeys(foreignKey, nativeKey)
    const {
      selectedForeignKey,
      selectedNativeKey,
      totalMistakes,
      nativeArr,
      foreignArr,
    } = stateWithCheckedKeys.testParams

    const { pairsWord } = stateWithCheckedKeys.wordPairCardPractic!

    const nativeIsMastered = !!nativeArr.find(
      (pair) => `${pair.id} ${pair.native}` === nativeKey,
    )?.mastered
    const foreignIsMastered = !!foreignArr.find(
      (pair) => `${pair.id} ${pair.foreign}` === foreignKey,
    )?.mastered
    const selectedForeignCorrectAnswers = pairsWord.find(
      (pair) => `${pair.id} ${pair.native}` === nativeKey,
    )?.correctAnswers

    expect(nativeIsMastered).toEqual(expectedNativeIsMastered)
    expect(foreignIsMastered).toEqual(expectedForeignIsMastered)
    expect(totalMistakes).toEqual(expectedTotalMistakes)
    expect(selectedForeignCorrectAnswers).toEqual(expectedCorrectAnswers)
    expect(selectedForeignKey).toBe("")
    expect(selectedNativeKey).toBe("")
  }
  it("should handle check when two keys are equal", () => {
    testCheckKeys({
      foreignKey: `${firstForeignPair.id} ${firstForeignPair.foreign}`,
      nativeKey: `${firstNativePair.id} ${firstNativePair.native}`,
      expectedForeignIsMastered: true,
      expectedNativeIsMastered: true,
      expectedTotalMistakes: 0,
      expectedCorrectAnswers: 1,
    })
  })
  it("should handle check when two keys are not equal", () => {
    testCheckKeys({
      foreignKey: `${firstForeignPair.id} ${firstForeignPair.foreign}`,
      nativeKey: `${secondNativePair.id} ${secondNativePair.native}`,
      expectedForeignIsMastered: false,
      expectedNativeIsMastered: false,
      expectedTotalMistakes: 1,
      expectedCorrectAnswers: 0,
    })
  })
})
