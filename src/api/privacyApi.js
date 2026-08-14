const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8000'

const DEFAULT_TIMEOUT_MS = 30_000

export class PrivacyApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message)
    this.name = 'PrivacyApiError'
    this.status = status
    this.cause = cause
  }
}

async function postImage(path, file, { signal } = {}) {
  if (!file) {
    throw new PrivacyApiError('Tidak ada gambar yang dipilih.')
  }

  const formData = new FormData()
  formData.append('image', file)

  const timeoutController = new AbortController()

  const timeoutId = setTimeout(() => {
    timeoutController.abort()
  }, DEFAULT_TIMEOUT_MS)

  const onExternalAbort = () => timeoutController.abort()

  signal?.addEventListener('abort', onExternalAbort)

  let response

  try {
    response = await fetch(`${BACKEND_BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
      signal: timeoutController.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new PrivacyApiError(
        'Privacy engine tidak merespons (timeout). Coba lagi.',
        { cause: error }
      )
    }

    throw new PrivacyApiError(
      'Tidak dapat menghubungi privacy engine. Periksa koneksi internet atau URL backend.',
      { cause: error }
    )
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', onExternalAbort)
  }

  let data = null

  try {
    data = await response.json()
  } catch {}

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request gagal (${response.status})`

    throw new PrivacyApiError(message, {
      status: response.status,
      cause: data,
    })
  }

  if (!data || data.success === false) {
    const message =
      data?.message ||
      data?.error ||
      'Privacy engine mengembalikan status gagal.'

    throw new PrivacyApiError(message, {
      status: response.status,
      cause: data,
    })
  }

  return data
}

export function scanPrivacy(file, options) {
  return postImage('/scan', file, options)
}

export function blurPrivacy(file, options) {
  return postImage('/blur', file, options)
}