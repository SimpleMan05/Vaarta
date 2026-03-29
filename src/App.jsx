import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Translate from './pages/Translate'
import { ThemeProvider } from './context/ThemeContext'
import { PuterProvider } from './context/PuterContext'

export default function App() {
  return (
    <ThemeProvider>
      <PuterProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/translate" element={<Translate />} />
        </Routes>
      </PuterProvider>
    </ThemeProvider>
  )
}
