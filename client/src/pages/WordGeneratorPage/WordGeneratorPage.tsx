import { Box, Typography, Stack, CircularProgress } from "@mui/material"
import GeneratorWordPare from "../../components/GeneratorWordPare"
import Pair from "./Pair"
import { useAppSelector } from "../../app/hooks"
import { useGetWordPairsQuery } from "../../app/api/wordPairsApiSlice"

// Component representing the Generator Page
const WordGeneratorPage = () => {
  const { user } = useAppSelector(state => state.user)

  const { data, isLoading } = useGetWordPairsQuery(user?.id || "")
  // Use the useQuery hook from Apollo Client to fetch all word pairs

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Component for generating word pairs */}
      <GeneratorWordPare />

      {/* Header indicating the section with all word pairs */}
      <Typography variant="h6">All Pairs</Typography>

      {/* Stack for displaying word pairs and a loading spinner if data is still loading */}
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        spacing={2}
        justifyContent={{ sm: "flex-start", xs: "center" }}
        alignItems={"center"}
        sx={{ width: "100%", minHeight: "10rem" }}
      >
        {/* Map through the fetched pairs and display each pair using the Pair component */}
        {data?.map(pair => <Pair key={pair.id} pair={pair} />)}

        {/* Display a loading spinner while data is being fetched */}
        {isLoading && <CircularProgress color="primary" />}
      </Stack>
    </Box>
  )
}

export default WordGeneratorPage
