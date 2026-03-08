export const formatName = (firstName: string, lastName: string) => {
  const formattedFirstName = firstName.trim().toLowerCase()
  const formattedLastName = lastName.trim().toLowerCase()

  return `${formattedFirstName} ${formattedLastName}`
}
