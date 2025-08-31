import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Fundo from './pages/Fundo'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nos/fundo" element={<Fundo />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;