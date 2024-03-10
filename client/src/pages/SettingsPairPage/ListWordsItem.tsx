import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

import { MdDelete } from "react-icons/md"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { minimumQuantityCheck } from "./ListWords"

const ListWordsItem = () => {
  const { wordPairCardPractic } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const dispatch = useAppDispatch()
  const { updatePair, deteleWord } = generatorWordsSlice.actions

  const minAmount: boolean = minimumQuantityCheck(
    wordPairCardPractic?.pairsWord || [],
  ).min
  return (
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
  )
}

export default ListWordsItem
