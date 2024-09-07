import {
  Badge,
  Box,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material"
import { IoIosNotifications } from "react-icons/io"
import { useCallback, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import WordChoiceStack from "./WordChoiceStack"

// TestChoiceBody component handles the main body of the vocabulary test, including word selection stacks and progress display.
const TestChoiceBody = () => {
  const { testParams } = useAppSelector(state => state["generator-pare-words"])

  const {
    progress,
    selectedForeignKey,
    selectedNativeKey,
    foreignArr,
    nativeArr,
    pageMastered,
    testMastered,
    violations,
    currentPair,
    totalPairs,
    testType
  } = testParams
  const dispatch = useAppDispatch()
  const { checkSelectedWords, nextPage } = generatorWordsSlice.actions

  const checkSelectedWordsTimeout = useRef<any | null>(null)

  // Function to check selected words after a timeout
  const onCheck = useCallback(() => {
    if (selectedForeignKey && selectedNativeKey) {
      if (checkSelectedWordsTimeout.current) {
        clearTimeout(checkSelectedWordsTimeout.current)
      }
      checkSelectedWordsTimeout.current = setTimeout(() => {
        dispatch(checkSelectedWords())
      }, 500)
    } else {
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedForeignKey, selectedNativeKey])

  // Function to move to the next page when mastered
  const onNext = useCallback(() => {
    if (pageMastered) {
      dispatch(nextPage())
    }
  }, [dispatch, nextPage, pageMastered])

  useEffect(() => {
    onCheck()
  }, [onCheck])

  useEffect(() => {
    onNext()
  }, [onNext])

  const foreignId = selectedForeignKey ? selectedForeignKey.split(" ")[0] : null

  const nativeId = selectedNativeKey ? selectedNativeKey.split(" ")[0] : null

  const dontMath = foreignId && nativeId && foreignId !== nativeId

  console.log("foreignArr", foreignArr)

  return (
    <>
      {!testMastered && testType === "choice" && (
        // Main container for the test body
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Paper component containing the test elements */}
          <Paper
            sx={{
              width: { md: "50%", xs: "100%" },
              padding: "1rem",
              minHeight: "20rem",
              position: "relative",
            }}
          >
            {/* Badge for displaying violations */}
            <Badge
              sx={{
                position: "absolute",
                top: "0.3rem",
                right: "0.3rem",
              }}
              badgeContent={violations}
              color="error"
            >
              <Tooltip
                title="Verstöße"
                placement="top"
                TransitionComponent={Zoom}
              >
                <span>
                  <IoIosNotifications />
                </span>
              </Tooltip>
            </Badge>
            <Box sx={{ my: "1rem", px: "1rem" }}>
              {/* Linear progress bar displaying test progress */}
              <LinearProgress variant="determinate" value={progress} />
              <Typography textAlign="center">
                {/* Displaying progress information */}
                {foreignArr.length * (currentPair + 1)}/
                {foreignArr.length * totalPairs}
              </Typography>
            </Box>
            <Box
              sx={{
                // Styling for overflow and maximum height of the word stacks
                overflowY: foreignArr.length > 10 ? "auto" : "none",
                maxHeight: foreignArr.length > 10 ? "20rem" : "100%",
              }}
            >
              {/* Stack component for displaying word choice stacks */}
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                sx={{ py: 1 }}
              >
                {/* WordChoiceStack for foreign words */}
                <WordChoiceStack
                  words={foreignArr}
                  selectedKey={selectedForeignKey}
                  dontMath={!!dontMath}
                  selectedId={nativeId}
                  keyName="foreign"
                />
                {/* WordChoiceStack for native words */}
                <WordChoiceStack
                  words={nativeArr}
                  selectedKey={selectedNativeKey}
                  dontMath={!!dontMath}
                  selectedId={foreignId}
                  keyName="native"
                />
              </Stack>
            </Box>
          </Paper>
        </Container>
      )}
    </>
  )
}

export default TestChoiceBody
