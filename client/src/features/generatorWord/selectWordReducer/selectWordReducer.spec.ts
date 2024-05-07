import generatorReducer, {
  selectWordAction,
  initialStateGeneratorWord,
} from "../generatorWordSlice"
import type { IGeneratorWordState } from "../../../types/wordPairs"

export const select = (
  keyName: "foreign" | "native",
  key: string,
  state?: IGeneratorWordState,
): IGeneratorWordState => {
  return generatorReducer(
    state ?? initialStateGeneratorWord,
    selectWordAction({ keyName, key }),
  )
}
describe("select word action", () => {
  it("should hanlde for foreign word", () => {
    const foreignKey1 = "1 Foreign Word 1"
    const state1 = select("foreign", foreignKey1)
    expect(state1.testParams.selectedForeignKey).toEqual(foreignKey1)

    const foreignKey2 = "2 Foreign Word 2"
    const state2 = select("foreign", foreignKey2)
    expect(state2.testParams.selectedForeignKey).toEqual(foreignKey2)
    expect(state2.testParams.selectedForeignKey).not.toEqual(foreignKey1)
  })
  it("should hanlde for native word", () => {
    const nativeKey1 = "1 Native Word 1"
    const state1 = select("native", nativeKey1)
    expect(state1.testParams.selectedNativeKey).toEqual(nativeKey1)

    const nativeKey2 = "2 Native Word 2"
    const state2 = select("native", nativeKey2)
    expect(state2.testParams.selectedNativeKey).toEqual(nativeKey2)
    expect(state2.testParams.selectedNativeKey).not.toEqual(nativeKey1)
  })

  it("should hanlde for native and foreign word", () => {
    const nativeKey1 = "1 Native Word 1"
    const foreignKey1 = "1 Foreign Word 1"

    const state1 = select("native", nativeKey1)
    const state2 = select("foreign", foreignKey1, state1)
    const { selectedForeignKey, selectedNativeKey } = state2.testParams
    expect(!!selectedForeignKey && !!selectedNativeKey).toEqual(true)
  })
})
