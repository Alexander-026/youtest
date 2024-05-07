import { Button, Container, Paper, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Link } from "react-router-dom"
import LoaderWrapper from "../../components/LoaderWrapper"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useEvaluateTestMutation } from "../../app/api/wordPairsApiSlice"

// GradingInput type for the grading mutation

// TestResult component displays the result of the vocabulary test.
const TestResult = () => {
  const { testParams, wordPairCardPractic } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const dispatch = useAppDispatch()
  const { onPair } = generatorWordsSlice.actions

 

  const { testMastered, totalMistakes, grade } = testParams

  const [grading, { data, isLoading: loading }] = useEvaluateTestMutation()

  useEffect(() => {
    if (testMastered && wordPairCardPractic) {
      grading({
        id: wordPairCardPractic.id,
        grade,
        pairsWord: wordPairCardPractic.pairsWord,
      })
    } else {
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade])

  // Check if the result should be displayed
  // const shouldDisplayResult = testMastered && !!data

  return (
    // LoaderWrapper for handling loading state and displaying data
    <LoaderWrapper loading={loading} data={data}>
      {/* Main container for displaying the result */}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* Paper component for styling */}
        <Paper
          sx={{
            width: { md: "50%", xs: "100%" },
            padding: "1rem",
            minHeight: "20rem",
            position: "relative",
          }}
        >
          {/* Typography component for displaying result title */}
          <Typography variant="h5" textAlign="center">
            Result 
          </Typography>
          {/* Typography components for displaying test information */}
          <Typography variant="h6" textAlign="left">
            totalMistakes: {totalMistakes}
          </Typography>
          <Typography variant="h6" textAlign="left">
            Percentage: {data?.lastResult}%
          </Typography>
          {/* Link to navigate back to the generator page */}
          <Link to="/generator" replace>
            <Button
              onClick={() => dispatch(onPair(null))}
              variant="contained"
              size="small"
            >
              Zurück
            </Button>
          </Link>
        </Paper>
      </Container>
    </LoaderWrapper>
  )
}

export default TestResult
