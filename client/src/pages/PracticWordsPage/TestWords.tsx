import ProtektionTest from "./ProtektionTest"
import TestBody from "./TestBody"
import TestResult from "./TestResult"

// Component representing the Test Words page
const TestWords = () => {
  return (
    // ProtektionTest provides certain functions related to test protection and control.
    <ProtektionTest>
      {/* Component for the main body of the test */}
      <TestBody />

      {/* Component for displaying the test result */}
      <TestResult />
    </ProtektionTest>
  )
}

export default TestWords
