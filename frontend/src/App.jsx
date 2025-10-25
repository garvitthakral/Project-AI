import React, { useEffect } from 'react'
import ResumeAnalyzer from './pages/ResumeAnalyzer/ResumeAnalyzer'
import { Routes, Route } from 'react-router-dom'
import BeforeReadme from './pages/ReadmeGen/BeforeReadme'
import Readme from './pages/ReadmeGen/Readme'
import CareerChatbot from './pages/CareerChatbot/CareerChatbot'
import Landing from './pages/Landing/Landing'
import Navbar from './components/Navbar'
import socketApi from './API/SocketApi'
import BeforeBreakdown from './pages/Breakdown/BeforeBreakdown'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/career-chatbot" element={<CareerChatbot />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/readme-gen" element={<BeforeReadme />} />
        <Route path="/readme-gen/:id" element={<Readme />} />
        <Route path="/goal-breakdown" element={<BeforeBreakdown />} />
      </Routes>
    </div>
  )
}

export default App
