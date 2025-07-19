import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import ChatPage from './pages/chatPage'


function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App
