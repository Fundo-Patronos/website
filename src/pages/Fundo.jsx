import FundoHero from '../components/FundoHero'
import FundoPrincipios from '../components/FundoPrincipios'
import FundoTimeline from '../components/FundoTimeline'
import FundoGovernanca from '../components/FundoGovernanca'
import FundoEquipe from '../components/FundoEquipe'
import DoacaoCTA from '../components/DoacaoCTA'

export default function Fundo() {
  return (
    <>
      <FundoHero />
      <FundoPrincipios />
      <FundoTimeline />
      <FundoGovernanca />
      <FundoEquipe />
      <DoacaoCTA />
    </>
  )
}