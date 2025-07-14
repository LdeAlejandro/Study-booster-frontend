import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Notification from './pages/notification/notification.jsx'
import './index.css'
import App from './App.jsx'

const path = window.location.pathname;

const ComponentToRender =
  path === '/notification' ? Notification : App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ComponentToRender />
  </StrictMode>,
)
