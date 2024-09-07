import { useEffect, useState } from "react"
import { useBlocker } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

// Custom hook for handling protection mechanisms
const useProtection = () => {
  // State variables to manage exit confirmation and test blocking
  const [showExit, setShowExit] = useState<boolean>(false)
  const [blockTest, setBlockTest] = useState<boolean>(false)

  // Selecting test parameters from Redux store
  const { testParams } = useAppSelector((state) => state["generator-pare-words"])
  const { testMastered } = testParams

  // Router hook for blocking navigation
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !showExit &&
      !testMastered &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  // Function to toggle fullscreen mode
  function fullscreen() {
    const element = document.documentElement
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if ((document.documentElement as any)["webkitRequestFullscreen"]) {
        ;(document.documentElement as any)["webkitRequestFullscreen"]()
      } else if ((document.documentElement as any)["mozRequestFullScreen"]) {
        ;(document.documentElement as any)["mozRequestFullScreen"]()
      } else if ((document.documentElement as any)["msRequestFullscreen"]) {
        ;(document.documentElement as any)["msRequestFullscreen"]()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any)["webkitExitFullscreen"]) {
        ;(document as any)["webkitExitFullscreen"]()
      } else if ((document as any)["mozCancelFullScreen"]) {
        ;(document as any)["mozCancelFullScreen"]()
      } else if ((document as any)["msExitFullscreen"]) {
        ;(document as any)["msExitFullscreen"]()
      }
    }
  }

  // Event listener for fullscreen changes
  document.addEventListener("fullscreenchange", handleFullscreenChange)

  // Function to handle changes in fullscreen mode
  function handleFullscreenChange() {
    if (document.fullscreenElement) {
      // Entered fullscreen mode
    } else {
      // Exited fullscreen mode, trigger test blocking
      setBlockTest(true)
    }
  }

  // Event listener function for the beforeunload event
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const message = "Sind Sie sicher, dass Sie die Seite verlassen möchten?"
    event.returnValue = message // Standard for most browsers
    return message
  }

  // Effect to toggle fullscreen mode on component mount
  useEffect(() => {
    fullscreen()
  }, [])

  // Effect to add and remove event listeners
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Cleanup function to remove event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Return relevant data and functions from the hook
  return {
    blocker,
    blockTest,
    setBlockTest,
    handleFullscreenChange,
    fullscreen,
    handleBeforeUnload,
    showExit,
    setShowExit,
  }
}

export default useProtection
