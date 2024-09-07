/* eslint-disable react-hooks/exhaustive-deps */
import TestWords from "./TestWords"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useCallback, useEffect } from "react"
import LoaderWrapper from "../../components/LoaderWrapper"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useVisitWordPairsMutation } from "../../app/api/wordPairsApiSlice"

// Component representing the Practice Words Page
const PracticWordsPage = () => {
  // Extracting the "id" parameter from the route using useParams
  const { id } = useParams()
  // Accessing Redux state and dispatch function
  const { wordPairCardPractic, piecesArrPairs } = useAppSelector(
    (state) => state["generator-pare-words"],
  )
  const dispatch = useAppDispatch()
  // Extracting actions from the generatorWordsSlice
  const { onPair, startTest } = generatorWordsSlice.actions

  const [visitPair, { isLoading: loading }] = useVisitWordPairsMutation()
  
  const visitHandler = useCallback(async () => {
    if (id && !wordPairCardPractic) {
      const pair =  await visitPair({ id }).unwrap()
      dispatch(onPair(pair))
      dispatch(startTest())
    }
    
  }, [])

  useEffect(() => {
    visitHandler()
  }, [])
  // Wrapping the TestWords component with a LoaderWrapper to handle loading state

  return (
    <LoaderWrapper loading={loading} data={!!piecesArrPairs}>
      <TestWords />
    </LoaderWrapper>
  )
}

export default PracticWordsPage
