import { useState } from "react"

type SetValue = (value: string | ((prevValue: string) => string)) => void
type RemoveValue = () => void

function useLocalStorage(key: string): [string, SetValue, RemoveValue] {
  // Attempt to get the value from local storage during component initialization
  const storedValue = localStorage.getItem(key)
  // const initial = storedValue ? storedValue : ""
  const initial = storedValue !== null ? storedValue : "";
  // Use useState to track the value
  const [value, setValue] = useState<string>(initial)

  // Function to set the value with updates to both state and local storage
  const updateValue: SetValue = newValue => {
    // const valueToStore =
    //   newValue instanceof Function ? newValue(value) : newValue
    const valueToStore = typeof newValue === 'function' ? (newValue as (prevValue: string) => string)(value) : newValue;
    setValue(valueToStore)
    localStorage.setItem(key, valueToStore)
  }

  // Function to remove the value from both state and local storage
  const removeValue: RemoveValue = () => {
    setValue("")
    localStorage.removeItem(key)
  }

  return [value, updateValue, removeValue]
}

export default useLocalStorage
