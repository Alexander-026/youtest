import { Box, Typography, TextField, Button, Stack } from "@mui/material"
import { useAppSelector } from "../app/hooks"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { wordPairsSchema } from "../schema/wordPairsSchema"
import { v4 as uuid } from "uuid"
import { useMemo } from "react"
import { useCreateWordPairsMutation } from "../app/api/wordPairsApiSlice"
import type { Pair, GeneratorPars } from "../types/wordPairs"

const GeneratorWordPare = () => {
  const { user } = useAppSelector(state => state.user)

  const [createWordPares] = useCreateWordPairsMutation()
  // React Hook Form hooks

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors,  isDirty, isValid },
  } = useForm<GeneratorPars>({
    mode: "all",
    resolver: yupResolver(wordPairsSchema),
    defaultValues: {
      title: "",
      pairsWord: "",
    },
  })
  // Get values of watched fields from the hook
  const watchedFields = watch()

  const pairs = useMemo<Pair[]>(() => {
    let filteredWords: string[] = []
    const wordsD = watchedFields
      .pairsWord!.split("\n")
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
      item.split(/ = | - /).map(inner => inner.trim().replace(",","")),
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
      .filter(p => !!p.foreign && !!p.native)
    filteredWords = []
    
    return cardPairs.length >= 1 ? cardPairs : []
  }, [watchedFields.pairsWord])

  // Form submit event handler
  const onSubmit: SubmitHandler<GeneratorPars> = async e => {
    console.log("pairs", pairs)
    if (!user) return

    
    // Call the mutation to Create Pairs
    await createWordPares({
      idUser: user.id,
      title: watchedFields.title || "",
      pairsWord: pairs,
    })
    // Reset form field values
    reset()
  }

  const errorMessage = "Es müssen mindestens 10 Wortpaare vorhanden sein"
  const lessThanTen = pairs.length > 0 && pairs.length < 10
  const lessThanTenMessage = lessThanTen ? errorMessage : ""




  return (
    <Box sx={{ width: { sm: "35rem", xs: "100%" } }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center">
            Generator
          </Typography>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title of Pairs"
                size="small"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="pairsWord"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                minRows={2}
                maxRows={10}
                fullWidth
                label="Write a couple of words"
                error={lessThanTen || !!errors.pairsWord}
                helperText={lessThanTenMessage || errors.pairsWord?.message}
              />
            )}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Button
              onClick={() => reset()}
              type="reset"
              disabled={!isDirty}
              variant="outlined"
              size={"small"}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={lessThanTen || !isValid}
              variant="contained"
              size={"small"}
            >
              Generate
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export default GeneratorWordPare
