import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.PROD ? 'https://reviai.vercel.app' : '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
