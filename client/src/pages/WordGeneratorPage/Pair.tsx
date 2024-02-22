import type { WordPairCard } from "../../types/wordPairs"
import { MdFiberNew } from "react-icons/md"
import { Link } from "react-router-dom"
import type { SxProps } from "@mui/material"
import {
  Typography,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardActions,
  Tooltip,
} from "@mui/material"
import { IoMdSettings } from "react-icons/io"
import sumLearnedWords from "../../utils/sumLearnedWords"
import Zoom from "@mui/material/Zoom"

// Styles for each pair item in the card
const stylesItemPair = {
  width: "10rem",
  height: "12rem",
  padding: "1rem",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
} as SxProps

// Styles for icons within each pair item
const iconStyles = {
  position: "absolute",
  top: "0.5rem",
} as const

type PairProps = {
  pair: WordPairCard
}

// Component representing a pair item in the GeneratorPage
const Pair: React.FC<PairProps> = ({ pair }) => {
  return (
    <Card
      sx={{
        ...stylesItemPair,
      }}
    >
      <CardContent sx={{ px: "0" }}>
        {/* Display a new icon if the pair has not been visited */}
        {!pair.visited && <MdFiberNew style={{...iconStyles, right: "0.5rem", color: "green", fontSize: 20}}  />}

        {/* IconButton with a tooltip for navigating to pair settings */}

        <Link to={`/generator/${pair.id}`}>
          <Tooltip
            title="Einstellungen"
            placement="top"
            TransitionComponent={Zoom}
          >
            <IconButton
              aria-label="setting-pair"
              size="small"
              sx={{ ...iconStyles, left: "0.5rem" }}
            >
              <IoMdSettings fontSize="15" />
            </IconButton>
          </Tooltip>
        </Link>

        {/* Stack for displaying pair information */}
        <Stack flexGrow={1}>
          <Typography variant="h6" textAlign="center" noWrap>
            {pair.title}
          </Typography>
          <Typography variant="body2" textAlign="start">
            total words: {pair.totalWords}
          </Typography>

          {/* Display additional information if the pair has been visited */}
          {pair.visited && (
            <>
              <Typography variant="body2" textAlign="start">
                learned words: {sumLearnedWords(pair.pairsWord)}
              </Typography>
              <Typography variant="body2" textAlign="start">
                last result: {pair.lastResult}%
              </Typography>
            </>
          )}
        </Stack>
      </CardContent>

      {/* CardActions for buttons related to the pair */}
      <CardActions>
        <Stack justifyContent="center" flexGrow={1}>
          {/* Link to start the test for the pair */}
          <Link to={`/practic/${pair.id}`}>
            <Button size="small" variant="contained" fullWidth>
              Start Test
            </Button>
          </Link>
        </Stack>
      </CardActions>
    </Card>
  )
}

export default Pair
