const timeSinceLastOnline = (dateString: string): string => {
  const lastOnlineDate = new Date(dateString) // Convert the string to a Date object
  const now = new Date() // Get the current time

  const diffInMs = now.getTime() - lastOnlineDate.getTime() // Difference in milliseconds
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)) // Convert milliseconds to minutes

  const hours = Math.floor(diffInMinutes / 60) // Calculate full hours
  const minutes = diffInMinutes % 60 // Calculate remaining minutes

  if (diffInMinutes < 1) {
    return "just now" // If less than 1 minute passed
  }

  if (hours >= 1) {
    const hourStr = hours === 1 ? "1 hour" : `${hours} hours` // Handle singular and plural for hours
    return `${hourStr} ago` // Return only hours if 1 hour or more has passed
  }

  return `${minutes} minute${minutes === 1 ? "" : "s"} ago` // Return how many minutes ago
}

export default timeSinceLastOnline
