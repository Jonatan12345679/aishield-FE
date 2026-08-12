const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8000'


export async function scanPrivacy(file) {
  const formData = new FormData()

  formData.append('image', file)

  const response = await fetch(
    `${BACKEND_BASE_URL}/scan`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    let message = `Scan failed (${response.status})`

    try {
      const errorData = await response.json()

      message =
        errorData.message ||
        errorData.error ||
        message
    } catch {
      // Response bukan JSON
    }

    throw new Error(message)
  }

  const blob = await response.blob()

  return {
    blob,
    url: URL.createObjectURL(blob),
  }
}


export async function blurPrivacy(file) {
  const formData = new FormData()

  formData.append('image', file)

  const response = await fetch(
    `${BACKEND_BASE_URL}/blur`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    let message = `Blur failed (${response.status})`

    try {
      const errorData = await response.json()

      message =
        errorData.message ||
        errorData.error ||
        message
    } catch {
      // Response bukan JSON
    }

    throw new Error(message)
  }

  const blob = await response.blob()

  return {
    blob,
    url: URL.createObjectURL(blob),
  }
}