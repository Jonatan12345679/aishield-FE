import { useEffect, useRef, useState } from 'react'

const WS_URL =
  (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/api/v1/ws/events'

const RECONNECT_DELAY_MS = 3000


export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        if (!cancelled) setIsConnected(true)
      }

      ws.onmessage = (event) => {
        if (cancelled) return
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch {
          // abaikan pesan yang bukan JSON valid
        }
      }

      ws.onclose = () => {
        if (cancelled) return
        setIsConnected(false)
        // coba reconnect otomatis, biar dashboard ga "mati" kalau backend
        // sempet restart atau koneksi putus sebentar
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      cancelled = true
      clearTimeout(reconnectTimeoutRef.current)
      wsRef.current?.close()
    }
  }, [])

  return { lastMessage, isConnected }
}