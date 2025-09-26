import ImpactoHero from '../components/ImpactoHero'
import ParceiroGrid from '../components/ParceiroGrid'
import ParceirosCTA from '../components/ParceirosCTA'

function Parceiros() {
  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Construindo o futuro da educação juntos"
        title="Parceiros do Fundo Patronos"
        description="Conheça as organizações e empresas que compartilham nossa visão de transformar a educação superior brasileira através de investimentos estratégicos e parcerias sustentáveis."
        primaryButtonText="Torne-se Parceiro"
        primaryButtonLink="/sobre-nos/contato"
      />
      <ParceiroGrid />
      <ParceirosCTA />
    </div>
  )
}

export default Parceiros