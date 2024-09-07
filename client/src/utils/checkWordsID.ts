import type { IGeneratorWordState } from "../types/wordPairs"

type ResultIds = {
  foreignId: string
  nativeId: string
  hasIds: boolean
}

const checkWordsID = (state: IGeneratorWordState): ResultIds => {
  const foreignId = state.testParams.selectedForeignKey.split(" ")[0]
  const nativeId = state.testParams.selectedNativeKey.split(" ")[0]
  const hasIds = !!foreignId && !!nativeId

  return {
    foreignId,
    nativeId,
    hasIds,
  }
}

export default checkWordsID
