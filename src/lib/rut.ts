export function formatRut(rawRut: string | null): string {
  if (!rawRut) return ''

  // Remove any non-alphanumeric characters
  const rut = rawRut.replace(/[^0-9kK]/g, '').toLowerCase()

  if (rut.length < 2) return rut

  const body = rut.slice(0, -1)
  const dv = rut.slice(-1)

  // Add dots every 3 digits from the right
  let formattedBody = ''
  let counter = 0
  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body[i] + formattedBody
    counter++
    if (counter % 3 === 0 && i !== 0) {
      formattedBody = `.${formattedBody}`
    }
  }

  return `${formattedBody}-${dv}`
}
