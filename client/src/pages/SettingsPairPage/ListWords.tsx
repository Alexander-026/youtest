import {
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Paper,
  Box,
  CardActions,
  Button,
  Typography,
  CardHeader,
  CircularProgress,
} from "@mui/material"
import { MdDelete } from "react-icons/md"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import type { Pair } from "../../types/wordPairs"
import { areArraysEqual } from "../../utils/areArraysEqual"
import filterArray from "../../utils/filterArray"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useUpdateWordPairsMutation } from "../../app/api/wordPairsApiSlice"

const minimumQuantityCheck = (
  pairsWords: Pair[],
): { min: boolean; max: boolean } => {
  const words = pairsWords
  return {
    min: words.length === 10,
    max: words.length === 100,
  }
}

// ListWords component for managing and displaying pairs of words
const ListWords: React.FC<{ pair: Pair[] }> = ({ pair }) => {
  const [modified, setModified] = useState<boolean>(false)
  const { wordPairCardPractic } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const { updatePair, deteleWord, addPair, onPair, resetUpdatePair } =
    generatorWordsSlice.actions
  const dispatch = useAppDispatch()

  const [update, { isLoading: loading, isError: error, data: updatedPair }] =
    useUpdateWordPairsMutation()

  // Function to trigger the update mutation
  const onUpdate = async () => {
    if (wordPairCardPractic) {
      const updatedPairsWord = filterArray(
        wordPairCardPractic.pairsWord,
      ).filtered

      const updated = await update({
        id: wordPairCardPractic.id,
        pairsWord: updatedPairsWord,
      }).unwrap()
      dispatch(onPair(updated))
    } else {
      return
    }
  }

  // Function to check if the data has been modified
  const checkData = useCallback(() => {
    if ((pair || updatedPair) && wordPairCardPractic?.pairsWord) {
      const pass = !areArraysEqual(
        updatedPair?.pairsWord || pair || [],
        wordPairCardPractic?.pairsWord.filter(p => !!p.foreign && !!p.native),
      )
      setModified(pass)
    } else {
      return
    }
  }, [pair, updatedPair, wordPairCardPractic?.pairsWord])

  useEffect(() => {
    checkData()
  }, [checkData])

  const minAmount: boolean = minimumQuantityCheck(
    wordPairCardPractic?.pairsWord || [],
  ).min
  const maxAmount: boolean = minimumQuantityCheck(
    wordPairCardPractic?.pairsWord || [],
  ).max

  return (
    // Card component for styling
    <Card sx={{ flex: 1 }}>
      {/* CardContent component for displaying the list of pairs */}
      <CardHeader
        sx={{ backgroundColor: "#34495e", padding: "0.5rem" }}
        title={
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Typography color="white">Mutersprache</Typography>
            <Typography color="white">Fremdsprache</Typography>
          </Stack>
        }
      />

      <CardContent
        sx={{ height: "20rem", overflowY: "auto", px: "1rem", mb: "0.5rem" }}
      >
        <Box>
          {wordPairCardPractic?.pairsWord.map((p, i) => {
            return (
              // Paper component for styling each pair
              <Paper
                key={p.id + i}
                sx={{
                  position: "relative",
                  padding: "0.5rem",
                  mb:
                    wordPairCardPractic?.pairsWord.length === i + 1
                      ? "0"
                      : "0.5rem",
                }}
              >
                {/* Stack component for organizing text fields */}
                <Stack gap={1} direction="row" alignItems="center">
                  {/* TextField for editing the native language word */}
                  <Typography variant="body2" textAlign="center" width="3rem">
                    {i + 1}
                  </Typography>
                  <TextField
                    placeholder="Mutersprache"
                    size="small"
                    variant="standard"
                    value={p.native}
                    fullWidth
                    onChange={e =>
                      dispatch(
                        updatePair({
                          id: p.id,
                          field: "native",
                          value: e.target.value,
                        }),
                      )
                    }
                  />
                  {/* TextField for editing the foreign language word */}
                  <TextField
                    placeholder="Fremdsprache"
                    size="small"
                    variant="standard"
                    fullWidth
                    onChange={e =>
                      dispatch(
                        updatePair({
                          id: p.id,
                          field: "foreign",
                          value: e.target.value,
                        }),
                      )
                    }
                    value={p.foreign}
                  />
                  {/* IconButton to delete a pair */}
                  {!minAmount && (
                    <IconButton
                      // sx={{ position: "absolute", top: "0", right: "0" }}
                      size="small"
                      onClick={() => dispatch(deteleWord(p.id))}
                      disabled={minAmount}
                    >
                      <MdDelete />
                    </IconButton>
                  )}
                </Stack>
              </Paper>
            )
          })}
        </Box>
      </CardContent>
      {/* CardActions component for displaying action buttons */}
      <CardActions
        sx={{
          backgroundColor: "#34495e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Button to add a new pair */}
        <Button
          onClick={() => {
            dispatch(addPair())
          }}
          size="small"
          variant="contained"
          disabled={maxAmount}
        >
          Add Pair
        </Button>
        {/* Button to reset changes */}
        <Button
          onClick={() => {
            dispatch(resetUpdatePair(pair))
          }}
          size="small"
          variant="outlined"
          disabled={!modified}
        >
          Reset
        </Button>
        {/* Button to save changes */}
        <Button
          onClick={() => {
            onUpdate()
            setModified(false)
          }}
          size="small"
          variant="contained"
          disabled={!modified || loading}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : "Save"}
        </Button>
      </CardActions>
    </Card>
  )
}

export default ListWords
