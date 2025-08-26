import MainLayout from './layouts/MainLayout';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import LogoClouds from './components/LogoClouds';
import CTASection from './components/CTASection';

function App() {
  return (
    <MainLayout>
      <Hero />
      <LogoClouds />
      <Features />
      <Stats />
      <CTASection />
    </MainLayout>
  );
}

export default App;