import {
  Button,
  Stack,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Slider,
  Typography,
  Tooltip,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { WordPairCardPractic } from "../../types/wordPairs"
import { useNavigate, useBlocker } from "react-router-dom"
import sumLearnedWords from "../../utils/sumLearnedWords"
import LoaderWrapper from "../../components/LoaderWrapper"
import ConfirmWindow from "../../components/ConfirmWindow"
import { useState, useMemo } from "react"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import type { IKeyString } from "../../types/keyString"
import { useDeleteWordPairsMutation } from "../../app/api/wordPairsApiSlice"
import { TbWriting } from "react-icons/tb"
import { MdOutlineTouchApp } from "react-icons/md"

function deepEqual(obj1: ConfigParams, obj2: ConfigParams): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

type ConfigParams = IKeyString &
  Pick<
    WordPairCardPractic,
    "divideIntoPieces" | "divideIntoPiecesMarks" | "quantityForPractice"
  >

// ConfigurationWordTest component for configuring and starting the test
const ConfigurationWordTest = () => {
  const { wordPairCardPractic, piecesArrPairs, testParams } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const { testType } = testParams
  const [deteteWordPairs, { isLoading }] = useDeleteWordPairsMutation()

  const {
    configurationPair,
    startTest,
    resetConfiguration,
    onPair,
    onTestType,
  } = generatorWordsSlice.actions
  const dispatch = useAppDispatch()
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const params: ConfigParams = {
    divideIntoPieces: wordPairCardPractic!.divideIntoPieces,
    divideIntoPiecesMarks: wordPairCardPractic!.divideIntoPiecesMarks,
    quantityForPractice: wordPairCardPractic!.quantityForPractice,
  }

  useBlocker(
    ({ currentLocation, nextLocation }) => {
      if (nextLocation.pathname.includes("/practic/")) {
        return false
      }
      dispatch(onPair(null))
      return false
    },
    // currentLocation.pathname !== nextLocation.pathname,
  )

  const memoisedConfigParams = useMemo<ConfigParams>(
    () => params,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const paramasChanged = deepEqual(memoisedConfigParams, params)

  return (
    // LoaderWrapper for handling loading state and displaying data
    <LoaderWrapper
      loading={isLoading}
      data={wordPairCardPractic && !piecesArrPairs.length}
    >
      {/* ConfirmWindow component for confirming deletion */}
      <ConfirmWindow
        ok={() => {
          // Perform deletion and close the confirmation window
          setShowDelete(false)
          if (wordPairCardPractic) {
            deteteWordPairs({ id: wordPairCardPractic.id })
            navigate("/generator", { replace: true })
          }
        }}
        no={() => setShowDelete(false)}
        open={showDelete}
        text=" Sind Sie sicher, dass Sie diese Wortsammlung löschen möchten?"
      />
      {/* Card component for styling */}
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          title={<Typography>{wordPairCardPractic!.title}</Typography>}
          sx={{
            backgroundColor: "#34495e",
            color: "white",
            textAlign: "center",
            padding: "0.5rem",
          }}
        />

        {/* CardContent for displaying configuration details */}
        <CardContent>
          <Typography variant="body1">
            In Tolal:{wordPairCardPractic!.totalWords}
          </Typography>
          <Typography variant="body1">
            Lerned:{sumLearnedWords(wordPairCardPractic!.pairsWord, "correctAnswers")}
          </Typography>
          <Typography variant="body1">
            Last Result:{wordPairCardPractic!.lastResult}%
          </Typography>
          <Typography variant="body1" textAlign="start">
            Quantity For Practice: {wordPairCardPractic!.quantityForPractice}
          </Typography>
          {/* Slider for configuring Quantity For Practice */}
          <Slider
            aria-label="Quantity For Practice"
            value={wordPairCardPractic!.quantityForPractice}
            onChange={(_, value) => {
              dispatch(
                configurationPair({
                  fieldName: "quantityForPractice",
                  value: value as number,
                }),
              )
            }}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={10}
            max={wordPairCardPractic!.fixedPairsWord.length}
          />
          <Typography variant="body1" textAlign="start">
            Divide Into Pieces: {wordPairCardPractic!.divideIntoPieces}
          </Typography>
          {/* Slider for configuring Divide Into Pieces */}
          <Slider
            aria-label=" Divide Into Pieces"
            value={wordPairCardPractic!.divideIntoPieces}
            onChange={(_, value) => {
              dispatch(
                configurationPair({
                  fieldName: "divideIntoPieces",
                  value: value as number,
                }),
              )
            }}
            valueLabelDisplay="auto"
            step={null}
            marks={wordPairCardPractic!.divideIntoPiecesMarks}
            min={5}
            max={wordPairCardPractic!.quantityForPractice}
          />

          <Stack flexDirection="row" justifyContent="center" gap={1}>
            <Tooltip title="In writing">
              <span>
                <Button
                  size="small"
                  variant="contained"
                  disabled={testType === "writing"}
                  onClick={() => {
                    dispatch(onTestType("writing"))
                  }}
                >
                  <TbWriting size={20} />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Choise">
              <span>
                <Button
                  size="small"
                  variant="contained"
                  disabled={testType === "choice"}
                  onClick={() => {
                    dispatch(onTestType("choice"))
                  }}
                >
                  <MdOutlineTouchApp size={20} />
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </CardContent>
        {/* CardActions for displaying action buttons */}
        <CardActions
          sx={{
            backgroundColor: "#34495e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Button to reset configuration */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(resetConfiguration())}
            disabled={paramasChanged}
          >
            Reset
          </Button>
          {/* Button to delete the word pair collection */}
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
          {/* Button to start the test */}
          <Button
            onClick={() => {
              dispatch(startTest())
              navigate("/practic/:id", { replace: true })
            }}
            variant="contained"
            size="small"
          >
            Start Test
          </Button>
        </CardActions>
      </Card>
    </LoaderWrapper>
  )
}

export default ConfigurationWordTest
