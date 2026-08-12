import React from 'react'
import ReactDOM from 'react-dom/client'
import { PxlKitSurfaceProvider } from '@pxlkit/ui-kit'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'


class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white p-4">
          <h1 className="text-xl font-bold">Terjadi kesalahan sistem pada UI AIShield. Silakan muat ulang halaman.</h1>
        </div>
      )
    }
    return this.props.children
  }
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PxlKitSurfaceProvider surface="pixel">
        <App />
      </PxlKitSurfaceProvider>
    </BrowserRouter>
  </React.StrictMode>
)