import TransparenciaHero from '../components/TransparenciaHero'
import RelatoriosAnuais from '../components/RelatoriosAnuais'
import TransparenciaNewsletter from '../components/TransparenciaNewsletter'
import DocumentacoesInstitucionais from '../components/DocumentacoesInstitucionais'
import TransparenciaFAQ from '../components/TransparenciaFAQ'
import DoacaoCTA from '../components/DoacaoCTA'

export default function Transparencia() {
  return (
    <>
      <TransparenciaHero />
      <RelatoriosAnuais />
      <TransparenciaNewsletter />
      <DocumentacoesInstitucionais />
      <TransparenciaFAQ />
      <DoacaoCTA />
    </>
  )
}