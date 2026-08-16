
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
const DEFAULT_TIMEOUT_MS = 30_000

export async function request(path, options = {}) {
  const { isFormData = false, timeout = DEFAULT_TIMEOUT_MS, signal, ...customOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  const onExternalAbort = () => controller.abort()
  signal?.addEventListener('abort', onExternalAbort)

  const headers = isFormData ? {} : { 'Content-Type': 'application/json' }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { ...headers, ...customOptions.headers },
      signal: controller.signal,
      ...customOptions,
    })

    let data = null
    try {
      data = await res.json()
    } catch {}

    if (!res.ok) {
      const errorMsg = data?.detail || data?.message || data?.error || `Request gagal (${res.status})`
      throw new Error(errorMsg)
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request ke server timeout. Coba lagi.')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}