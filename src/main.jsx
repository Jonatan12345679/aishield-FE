import React from 'react'
import ReactDOM from 'react-dom/client'
import { PxlKitToastProvider } from '@pxlkit/ui-kit'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PxlKitToastProvider position="bottom-right">
    <App />
    </PxlKitToastProvider>
  </React.StrictMode>,
)