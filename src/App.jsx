import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Fundo from './pages/Fundo'
import Transparencia from './pages/Transparencia'
import Extras from './pages/Extras'
import Carreira from './pages/Carreira'
import TrilhaDeCarreiras from './pages/TrilhaDeCarreiras'
import CentroDeCarreiras from './pages/CentroDeCarreiras'
import Talentos from './pages/Talentos'
import Pesquisa from './pages/Pesquisa'
import Parceiros from './pages/Parceiros'
import Contato from './pages/Contato'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nos/fundo" element={<Fundo />} />
          <Route path="/sobre-nos/transparencia" element={<Transparencia />} />
          <Route path="/sobre-nos/contato" element={<Contato />} />
          <Route path="/impacto/extras" element={<Extras />} />
          <Route path="/impacto/carreira" element={<Carreira />} />
          <Route path="/impacto/trilhas" element={<TrilhaDeCarreiras />} />
          <Route path="/impacto/centro" element={<CentroDeCarreiras />} />
          <Route path="/impacto/talentos" element={<Talentos />} />
          <Route path="/impacto/pesquisa" element={<Pesquisa />} />
          <Route path="/parceiros" element={<Parceiros />} />
        </Routes>
      </MainLayout>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;