import {
  Card,
  CardContent,
  Stack,
  CardActions,
  Button,
  ButtonGroup,
  Typography,
  CardHeader,
  CircularProgress,
  Paper,
  TextField,
  IconButton,
} from "@mui/material"
import type React from "react"
import { v4 as uuid } from "uuid"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import type { Pair } from "../../types/wordPairs"
import { areArraysEqual } from "../../utils/areArraysEqual"
import filterArray from "../../utils/filterArray"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useUpdateWordPairsMutation } from "../../app/api/wordPairsApiSlice"
import ListWordsItem from "./ListWordsItem"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { addManySchema } from "../../schema/wordPairsSchema"
import { IoCloseSharp } from "react-icons/io5"
import { FaSearch } from "react-icons/fa"

export const minimumQuantityCheck = (
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
  const [showMany, setShowMany] = useState<boolean>(false)
  const [modified, setModified] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [filter, setFilter] = useState<string>("")
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<{ pairs: string }>({
    mode: "all",
    resolver: yupResolver(addManySchema),
    defaultValues: {
      pairs: "",
    },
  })

  const watchedFields = watch()
  const { wordPairCardPractic } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const { addPair, onPair, resetUpdatePair, addManyPairs } =
    generatorWordsSlice.actions
  const dispatch = useAppDispatch()

  const [update, { isLoading: loading, isError, data: updatedPair }] =
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

  const pairs = useMemo<Pair[]>(() => {
    let filteredWords: string[] = []
    const wordsD = watchedFields
      .pairs!.split("\n")
      .map(item => item.trim().toLocaleLowerCase())
      .filter(item => {
        if (!!item && !filteredWords.includes(item)) {
          filteredWords.push(item)
          return true
        } else {
          return false
        }
      })
    const paresA = wordsD.map(item =>
      item.split(/ - | = /).map(inner => inner.trim().replace(",", "")),
    )
    const cardPairs: Pair[] = paresA
      .map(item => {
        const foreignWord = item[0]
        const transcriptionWord = item[1]
        const nativeWord = item[2]
        return {
          id: uuid(),
          foreign: foreignWord,
          native: nativeWord,
          transcription: transcriptionWord,
          correctAnswers: 0,
          mastered: false,
        }
      })
      .filter(p => !!p.foreign && !!p.native).reverse()
    filteredWords = []
    return cardPairs.length >= 1 ? cardPairs : []
  }, [watchedFields.pairs])

  const addMany: SubmitHandler<{ pairs: string }> = () => {
    dispatch(addManyPairs(pairs))
    reset()
    setShowMany(false)
  }

  useEffect(() => {
    checkData()
  }, [checkData])

  const maxAmount: boolean = minimumQuantityCheck(
    wordPairCardPractic?.pairsWord || [],
  ).max

  return (
    // Card component for styling
    <Card sx={{ flex: 1 }}>
      {/* CardContent component for displaying the list of pairs */}
      <CardHeader
        sx={{
          backgroundColor: "#34495e",
          padding: "0.5rem",
          position: "relative",
        }}
        title={
          <>
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translate(0, -50%)",
                left: "1rem",
                color: "white",
                border: "1px solid",
                width: "1.5rem",
                height: "1.5rem"
              }}
              size="small"
              onClick={() => (setShowSearch((pre) => !pre),  setFilter(""))}
            >
              <FaSearch  />
            </IconButton>
            <TextField
                placeholder="Filter"
                size="small"
                variant="outlined"
               
                onChange={(e) =>
                  setFilter(e.target.value)
                }
               
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFilter("")
                      }}
                    >
                     <IoCloseSharp/>
                    </IconButton>
                  ),
                }}
                value={filter}
                sx={{position: "absolute",  top: showSearch ? "0rem" : "-10rem", left: "4rem", zIndex: 10, bgcolor: "#FFFFFF"}}
              />
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Typography color="white">Foreign language</Typography>
              <Typography color="white">Native language</Typography>
            </Stack>
          </>
        }
      />

      <CardContent
        sx={{ height: "20rem", overflowY: "auto", px: "1rem", mb: "0.5rem" }}
      >
        <Paper
          sx={{
            height: showMany ? "15rem" : "0",
            transition: "height .06s linear",
            overflow: "hidden",
            padding: showMany ? "0.5rem" : "0",
            marginBottom: showMany ? "0.5rem" : "0",
          }}
        >
          <form style={{ height: "100%" }} onSubmit={handleSubmit(addMany)}>
            <Stack
              sx={{ height: "100%", position: "relative", pt: "2rem" }}
              flexBasis={1}
              justifyContent="space-between"
            >
              <Button
                onClick={() => setShowMany(false)}
                variant="outlined"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  p: 0,
                  minWidth: "1rem",
                  width: "1.2rem",
                  height: "1.2rem",
                }}
                size="small"
              >
                <IoCloseSharp />
              </Button>
              <Controller
                name="pairs"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    minRows={3}
                    maxRows={5}
                    fullWidth
                    label="Write a couple of words"
                    error={!!errors.pairs}
                    helperText={errors.pairs?.message}
                  />
                )}
              />
              <Stack flexDirection="row" justifyContent="space-between">
                <Button
                  onClick={() => reset()}
                  disabled={!isDirty}
                  size="small"
                  variant="outlined"
                >
                  Reset
                </Button>
                <Button
                  disabled={!isValid}
                  type="submit"
                  size="small"
                  variant="contained"
                >
                  Add
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>

        <ListWordsItem  filter={filter}/>
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
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          size="small"
        >
          <Button
            onClick={() => {
              dispatch(addPair())
            }}
            disabled={maxAmount || showMany}
          >
            Add One
          </Button>
          <Button onClick={() => setShowMany(true)}>Add Many</Button>
        </ButtonGroup>

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
