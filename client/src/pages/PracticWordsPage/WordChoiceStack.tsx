import type { Pair } from "../../types/wordPairs"
import { Button, Stack } from "@mui/material"
import { useAppDispatch } from "../../app/hooks"
import { v4 as uuid } from "uuid"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"

type WordChoiceStackProps = {
  words: Pair[]
  selectedKey: string
  dontMath: boolean
  selectedId: string | null
  keyName: "native" | "foreign"
}

// WordChoiceStack component renders a stack of Buttons for word choices with specific styling and logic.
const WordChoiceStack: React.FC<WordChoiceStackProps> = ({
  words,
  selectedKey,
  dontMath,
  selectedId,
  keyName,
}) => {
  const dispatch = useAppDispatch()
  const { selectWord } = generatorWordsSlice.actions

  return (
    // Stack component containing Buttons for word choices
    <Stack sx={{ py: 1, flex: 1, px: 1 }} spacing={2}>
      {words.map((p) => {
        const key = `${p.id} ${p[keyName]}`
        const match = key === selectedKey

        return (
          // Individual Button for a word choice
          <Button
            sx={{ fontSize: { xs: "8px", md: "12px" } }}
            translate="no"
            key={`${key}-${uuid()}`}
            onClick={() => dispatch(selectWord({ keyName, key }))}
            disabled={p.mastered}
            fullWidth
            variant={match ? "contained" : "outlined"}
            color={
              match && dontMath
                ? "error"
                : selectedId === p.id && match
                ? "success"
                : "info"
            }
            size={"small"}
            title={keyName === "foreign" ? p.transcription : ""}
          >
            {p[keyName]}
          </Button>
        )
      })}
    </Stack>
  )
}

export default WordChoiceStack
