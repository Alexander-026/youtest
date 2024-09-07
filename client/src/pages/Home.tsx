import { Box, Typography, Stack, Chip, Button, TextField } from "@mui/material"
import { Fragment, useEffect, useRef, useState } from "react"

import { v4 as uuid } from "uuid"
import { shuffle } from "../utils/shuffle"
import { contactMeSchema } from "../schema/contactMeSchema"
import { yupResolver } from "@hookform/resolvers/yup"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import type { ContactMe } from "../types/user"
import { useSendEmailMutation } from "../app/api/usersApiSlice"

type PWord = { id: string; order: number; word: string }

type PazleText = {
  id: string
  text: string
  words: PWord[]
}

const text = `Я не хочу тратить впустую свое время, потому что оно действительно летит, и мне нужно сделать много вещей в моей жизни.
I don't want to waste my time bacause it really flies and I nedd to do so many thigs!
Я хотел бы пожелать тебе крепкого здоровья, настоящего счасться, больших денег и успехов в жизни.
I'd like to wish you strong health, real happiness, big money and success in life.
Во сколько твоя жена обычно возврашается домой ?
What time does your wife usally return home ?`

const Home = () => {
  const [sendMessage, { isLoading, isError, data }] = useSendEmailMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactMe>({
    mode: "all",
    resolver: yupResolver(contactMeSchema),
    defaultValues: {
      email: "",
      fullName: "",
      text: "",
    },
  })
  // const [originalArr, setOriginalArr] = useState<PazleText | null>(null)
  // const [shuffledArr, setShuffledArr] = useState<PWord[]>([])
  // const [newArr, setNewArr] = useState<PWord[]>([])
  // const [loadig, setLoading] = useState<boolean>(true)

  // useEffect(() => {
  //   const arrsText = text.split(/(?<=[.!?])\s+/)

  //   const sentences: PazleText[] = arrsText.reduce((acc, text, index) => {
  //     if (index % 2 !== 0) {
  //       acc.push({
  //         id: uuid(),
  //         text: arrsText[index - 1],
  //         words: text.split(" ").map((w, i) => ({
  //           id: uuid(),
  //           order: i + 1,
  //           word: w,
  //         })),
  //       })
  //     }
  //     return acc
  //   }, [] as PazleText[])

  //   const arr = sentences[0]

  //   setOriginalArr(arr)
  //   setShuffledArr(shuffle<PWord>(arr.words))
  //   setLoading(false)
  // }, [])

  // const deletFromShuffled = (id: PWord) => {

  //   const indexSelected = shuffledArr.indexOf(id)

  //   const [item] = shuffledArr.splice(indexSelected, 1)

  //   setShuffledArr(shuffledArr)
  //   setNewArr((pre) => [...pre, item])

  // }
  // const deletFromNew = (id: PWord) => {

  //   const indexSelected = newArr.indexOf(id)

  //   const [item] = newArr.splice(indexSelected, 1)

  //   setNewArr(newArr)
  //   setShuffledArr((pre) => [...pre, item])

  // }

  // const checkHandler = () => {

  //   let result = true

  //   for(let i = 0; i < originalArr!.words.length; i ++) {
  //     console.log("originalArr!.words", newArr[i].order)
  //     if(originalArr!.words[i].order !== newArr[i].order && originalArr!.words[i].word.toLocaleLowerCase() !== newArr[i].word.toLocaleLowerCase()){
  //       result = false
  //       break;
  //     }
  //   }

  //   console.log("result", result)

  // }

  const onSubmit: SubmitHandler<ContactMe> = async e => {
    try {
      const message = await sendMessage(e).unwrap()

      console.log("message", message)
    } catch (error) {
      console.log("error", e)
    } finally {
      reset()
    }
  }

  return (
    <Box>
      <Typography>Home</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="column"
          gap={{ xs: 2, sm: 3 }}
          sx={{ width: "25rem", margin: "0 auto" }}
        >
          <Typography variant="h5" textAlign="center">
            Contact Me
          </Typography>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                size="small"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                minRows={2}
                maxRows={10}
                fullWidth
                label="Write a couple of words"
                error={!!errors.text}
                helperText={errors.text?.message}
              />
            )}
          />

          <Button
            disabled={!isValid || isLoading}
            variant="contained"
            size="small"
            type="submit"
          >
            {isLoading ? "Loadding" : "Send"}
          </Button>
        </Stack>
      </form>

      {/* {loadig && originalArr === null ? (
        <Typography>LOadding.....</Typography>
      ) : (
        <>
          <Typography>{originalArr?.text}</Typography>

          <Stack
            flexDirection="row"
            sx={{ mb: "1rem", border: "1px solid", minHeight: "10rem" }}
          >
            {newArr.map(w => (
              <Chip key={`${w.id}`} label={w.word} onClick={() => deletFromNew(w)} />
            ))}
          </Stack>
          <Stack flexDirection="row">
            {shuffledArr.map(w => (
              <Chip key={`${w.id}`} label={w.word} onClick={() => deletFromShuffled(w)} />
            ))}
          </Stack>

          <Button disabled={originalArr?.words.length !== newArr.length} variant="contained" onClick={checkHandler}>Check</Button>
        </>
      )} */}
    </Box>
  )
}

export default Home
