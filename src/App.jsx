import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Fundo from './pages/Fundo'
import Transparencia from './pages/Transparencia'
import Extras from './pages/Extras'
import Carreira from './pages/Carreira'
import Talentos from './pages/Talentos'
import Pesquisa from './pages/Pesquisa'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nos/fundo" element={<Fundo />} />
          <Route path="/sobre-nos/transparencia" element={<Transparencia />} />
          <Route path="/impacto/extras" element={<Extras />} />
          <Route path="/impacto/carreira" element={<Carreira />} />
          <Route path="/impacto/talentos" element={<Talentos />} />
          <Route path="/impacto/pesquisa" element={<Pesquisa />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;