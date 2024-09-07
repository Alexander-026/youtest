import type { ReactNode } from "react"
import type React from "react"
import { useCallback, useEffect } from "react"
import useProtection from "../../hooks/useProtektion"
import { Box, IconButton, Tooltip } from "@mui/material"
import Zoom from "@mui/material/Zoom"

import { RiLogoutBoxRFill } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { generatorWordsSlice } from "../../features/generatorWord/generatorWordSlice"
import { useNavigate } from "react-router-dom"
import ConfirmWindow from "../../components/ConfirmWindow"

// Type definition for the properties passed to ProtektionTest
type TypesProtektionTest = {
  children: ReactNode
}

// ProtektionTest component manages protection and control flow for a test scenario
const ProtektionTest: React.FC<TypesProtektionTest> = ({ children }) => {
  // Redux state related to the generatorWordsSlice
  const { piecesArrPairs, testParams } = useAppSelector(
    state => state["generator-pare-words"],
  )
  const { testMastered } = testParams

  // Custom hook for handling protection features
  const {
    blocker,
    blockTest,
    setBlockTest,
    handleFullscreenChange,
    fullscreen,
    handleBeforeUnload,
    showExit,
    setShowExit,
  } = useProtection()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { onPair, violated } = generatorWordsSlice.actions

  // Function to close fullscreen mode when the test is mastered
  const closeFullScreen = useCallback(() => {
    if (testMastered) {
      fullscreen()
      console.log("closeFullScreen")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMastered])

  useEffect(() => {
    closeFullScreen()
  }, [closeFullScreen])

  // Function to exit the test
  const exit = () => {
    if (blocker.state === "blocked") {
      blocker.proceed()
    } else {
      fullscreen()
    }
    dispatch(onPair(null))
    window.removeEventListener("beforeunload", handleBeforeUnload)
    document.removeEventListener("fullscreenchange", handleFullscreenChange)
    navigate("/generator", { replace: true })
  }

  // Determine if children should be displayed based on various conditions
  const shouldDisplayChildren =
    testMastered ||
    (!!piecesArrPairs.length && !blockTest && blocker.state !== "blocked")

  return (
    // Main container with protection features
    <Box
      // Event handler for onBlur to check for violations
      onBlur={event => {
        const currentTarget = event.currentTarget
        if (currentTarget.contains(document.activeElement)) {
          dispatch(violated())
        }
      }}
      tabIndex={0}
      sx={{
        height: "100vh",
        backgroundColor: "#26262626",
      }}
    >
      {/* Display exit button if the test is not mastered */}
      {!testMastered && (
        <Tooltip title="Ausfahrt" placement="top" TransitionComponent={Zoom}>
          <IconButton
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
            }}
            onClick={() => {
              setShowExit(true)
            }}
          >
            <RiLogoutBoxRFill />
          </IconButton>
        </Tooltip>
      )}

      {/* ConfirmWindow for confirming exit during the test */}
      <ConfirmWindow
        ok={exit}
        no={() => setShowExit(false)}
        open={showExit}
        text=" Wollen Sie den Test wirklich stehlen?"
      />

      {/* ConfirmWindow for handling exit in a blocked state */}
      <ConfirmWindow
        ok={exit}
        no={() => {
          blocker.state === "blocked" && blocker.reset()
          dispatch(violated())
        }}
        open={blocker.state === "blocked"}
        text="Sind Sie sicher, dass Sie diese Seite verlassen möchten?"
      />

      {/* ConfirmWindow for handling returning to fullscreen mode */}
      <ConfirmWindow
        ok={() => {
          fullscreen()
          setBlockTest(false)
          dispatch(violated())
        }}
        open={blockTest && blocker.state !== "blocked" && !testMastered}
        text="Zurück zum Vollbildmodus"
        okText="Zurück"
      />

      {/* Render children if conditions are met */}
      {shouldDisplayChildren && children}
    </Box>
  )
}

export default ProtektionTest
