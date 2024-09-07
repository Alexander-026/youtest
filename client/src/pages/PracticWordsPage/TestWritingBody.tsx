import {
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IoIosNotifications } from "react-icons/io"
import { toPracticeAction } from "../../features/generatorWord/generatorWordSlice"
import {
  updateCurrentPairsArrAction,
  checkCurrentPairsArrAction,
} from "../../features/generatorWord/generatorWordSlice"
import { GrLinkNext } from "react-icons/gr"
import { MdVisibility } from "react-icons/md"
import { MdVisibilityOff } from "react-icons/md"
import { useState } from "react"

const TestWritingBody = () => {
  const [visibility, setVisibility] = useState<string | null>(null)
  const { testParams, piecesArrPairs } = useAppSelector(
    state => state["generator-pare-words"],
  )

  const {
    progress,
    foreignArr,
    testMastered,
    violations,
    currentPair,
    totalPairs,
    testType,
    toPractice,
    currentArrayPairs,
    validCurrentArrayPairs,
  } = testParams
  const dispatch = useAppDispatch()

  const isValid = currentArrayPairs.find(p => p.value.length < 2)

  return (
    <>
      {!testMastered && testType === "writing" && (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
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
              {!toPractice && (
                <Stack
                  flexDirection="row"
                  alignItems={"center"}
                  justifyContent="center"
                  gap={2}
                >
                  <Button
                    variant="contained"
                    onClick={() => dispatch(toPracticeAction("native"))}
                  >
                    Native
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => dispatch(toPracticeAction("foreign"))}
                  >
                    Foreign
                  </Button>
                </Stack>
              )}
              {toPractice && (
                <>
                  {piecesArrPairs[currentPair].pairs.map(pair => {
                    const currentPair = currentArrayPairs.find(
                      p => p.id === pair.id,
                    )

                    return (
                      <Stack
                        sx={{ marginBottom: "1rem", px: "2rem" }}
                        key={pair.id}
                        flexDirection="row"
                        alignItems={"center"}
                        justifyContent="center"
                        gap={2}
                      >
                        {toPractice === "foreign" ? (
                          <Typography sx={{ flex: 1 }}>
                            {pair.native}
                          </Typography>
                        ) : (
                          <TextField
                            variant="standard"
                            value={
                              visibility === pair.id
                                ? pair.native
                                : currentPair?.value
                            }
                            onChange={e =>
                              dispatch(
                                updateCurrentPairsArrAction({
                                  id: pair.id,
                                  value: e.target.value,
                                }),
                              )
                            }
                            autoComplete="off"
                            disabled={visibility === pair.id}
                            sx={{ flex: 1 }}
                            size="small"
                            error={
                              validCurrentArrayPairs !== null
                                ? !validCurrentArrayPairs
                                  ? currentPair?.value.toLocaleLowerCase() !==
                                    pair.native.toLocaleLowerCase()
                                  : false
                                : false
                            }
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    visibility === pair.id
                                      ? setVisibility(null)
                                      : setVisibility(pair.id)
                                  }
                                >
                                  {visibility === pair.id ? (
                                    <MdVisibility />
                                  ) : (
                                    <MdVisibilityOff />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        )}

                        {toPractice === "native" ? (
                          <Typography sx={{ flex: 1 }}>
                            {pair.foreign}
                          </Typography>
                        ) : (
                          <TextField
                            variant="standard"
                            value={
                              visibility === pair.id
                                ? pair.foreign
                                : currentPair?.value
                            }
                            error={
                              validCurrentArrayPairs !== null
                                ? !validCurrentArrayPairs
                                  ? currentPair?.value.toLocaleLowerCase() !==
                                    pair.foreign.toLocaleLowerCase()
                                  : false
                                : false
                            }
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    visibility === pair.id
                                      ? setVisibility(null)
                                      : setVisibility(pair.id)
                                  }
                                >
                                  {visibility === pair.id ? (
                                    <MdVisibility />
                                  ) : (
                                    <MdVisibilityOff />
                                  )}
                                </IconButton>
                              ),
                            }}
                            autoComplete="off"
                            disabled={visibility === pair.id}
                            onChange={e =>
                              dispatch(
                                updateCurrentPairsArrAction({
                                  id: pair.id,
                                  value: e.target.value,
                                }),
                              )
                            }
                            sx={{ flex: 1 }}
                            size="small"
                          />
                        )}
                      </Stack>
                    )
                  })}
                  <Stack
                    flexDirection="row"
                    alignItems={"center"}
                    justifyContent="center"
                  >
                    <Button
                      onClick={() => dispatch(checkCurrentPairsArrAction())}
                      disabled={!!isValid}
                      size="small"
                      variant="contained"
                    >
                      <GrLinkNext />
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          </Paper>
        </Container>
      )}
    </>
  )
}

export default TestWritingBody
