import ProtektionTest from "./ProtektionTest"
import TestChoiceBody from "./TestChoiceBody"
import TestResult from "./TestResult"
import TestWritingBody from "./TestWritingBody"

// Component representing the Test Words page
const TestWords = () => {
  return (
    // ProtektionTest provides certain functions related to test protection and control.
    <ProtektionTest>
      {/* Component for the main body of the test */}
      <TestChoiceBody />
      <TestWritingBody/>

      {/* Component for displaying the test result */}
      <TestResult />
    </ProtektionTest>
  )
}

export default TestWords
