const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/v1'

const DEFAULT_TIMEOUT_MS = 30_000

export class ApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

export async function request(path, options = {}) {
  const {
    isFormData = false,
    timeout = DEFAULT_TIMEOUT_MS,
    signal,
    ...fetchOptions
  } = options

  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  const onExternalAbort = () => controller.abort()

  signal?.addEventListener(
    'abort',
    onExternalAbort
  )

  try {
    const response = await fetch(
      `${BASE_URL}${path}`,
      {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          ...(isFormData
            ? {}
            : {
                'Content-Type':
                  'application/json',
              }),
          ...(fetchOptions.headers || {}),
        },
      }
    )

    let data = null

    try {
      data = await response.json()
    } catch {
      // Response kosong atau bukan JSON
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        `Request gagal (${response.status})`

      throw new ApiError(
        message,
        {
          status: response.status,
          cause: data,
        }
      )
    }

    if (
      data &&
      typeof data === 'object' &&
      data.success === false
    ) {
      throw new ApiError(
        data.message ||
          'Request gagal',
        {
          status: response.status,
          cause: data,
        }
      )
    }

    return data
  } catch (error) {
    if (
      error.name === 'AbortError'
    ) {
      throw new ApiError(
        'Request ke server timeout. Coba lagi.'
      )
    }

    if (
      error instanceof ApiError
    ) {
      throw error
    }

    throw new ApiError(
      'Tidak dapat terhubung ke server.',
      {
        cause: error,
      }
    )
  } finally {
    clearTimeout(timeoutId)

    signal?.removeEventListener(
      'abort',
      onExternalAbort
    )
  }
}