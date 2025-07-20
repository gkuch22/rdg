import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import ChatPage from './pages/chatPage'
import QRcode from './pages/qrCode'
import NotFoundPage from './pages/notFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/QRcode" element={<QRcode />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
