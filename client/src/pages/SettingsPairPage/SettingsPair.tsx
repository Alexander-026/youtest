/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "@mui/material"
import ConfigurationWordTest from "./ConfigurationWordTest"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../app/hooks"
import { useCallback, useEffect } from "react"
import LoaderWrapper from "../../components/LoaderWrapper"
import ListWords from "./ListWords"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useVisitWordPairsMutation } from "../../app/api/wordPairsApiSlice"

// SettingsPair component for configuring and visiting a word pair collection
const SettingsPair = () => {
  // Get the id parameter from the URL
  const { id } = useParams()
  // Get the onPair action from the generatorWordsSlice
  const { onPair } = generatorWordsSlice.actions
  // Get the dispatch function from the Redux store
  const dispatch = useAppDispatch()

  const [visitPair, { isLoading: loading, data }] = useVisitWordPairsMutation()

  const visitHandler = useCallback(async () => {
    if (!id) return

    const pair =  await visitPair({ id }).unwrap()
    dispatch(onPair(pair))
  }, [])

  useEffect(() => {
    visitHandler()
  }, [])

  // Return the component JSX
  return (
    // LoaderWrapper for handling loading state and displaying data
    <LoaderWrapper loading={loading} data={data}>
      {/* Stack component for arranging ConfigurationWordTest and ListWords components */}
      <Stack direction={{ md: "row" }} justifyContent="space-between" gap={3}>
        {/* ConfigurationWordTest component for configuring and starting the test */}
        <ConfigurationWordTest />
        {/* ListWords component for displaying and modifying the list of word pairs */}
        {data && <ListWords pair={data.pairsWord} />}
      </Stack>
    </LoaderWrapper>
  )
}

export default SettingsPair
