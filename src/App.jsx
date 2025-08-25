import MainLayout from './layouts/MainLayout';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';

function App() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <Stats />
    </MainLayout>
  );
}

export default App;