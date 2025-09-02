import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import CarreiraGrid from '../components/CarreiraGrid'
import SelecaoAvaliacao from '../components/SelecaoAvaliacao'
import CarreiraTestimonial from '../components/CarreiraTestimonial'
import ImpactoFAQ from '../components/ImpactoFAQ'

function Carreira() {
  const stats = [
    { label: 'Conexões Realizadas', value: '1.200+' },
    { label: 'Empresas Parceiras', value: '150+' },
    { label: 'Taxa de Colocação', value: '87%' },
    { label: 'Eventos de Networking', value: '24' },
  ]

  const paragraphs = [
    'Nosso Centro de Carreiras é uma ponte estratégica entre o talento acadêmico da Unicamp e as demandas do mercado de trabalho. Oferecemos uma plataforma completa de desenvolvimento profissional, networking e conexão com oportunidades exclusivas.',
    'Trabalhamos diretamente com empresas líderes de mercado para identificar oportunidades que maximizem o potencial dos nossos talentos. Nossos programas incluem mentoria individualizada, workshops de desenvolvimento profissional e eventos de networking exclusivos.',
    'Desde a criação do centro, mais de 1.200 conexões profissionais foram estabelecidas, resultando em colocações em posições estratégicas em empresas de todos os portes e setores da economia brasileira e internacional.'
  ]

  const faqs = [
    {
      question: "Como funciona o programa de mentoria?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre funcionamento do programa de mentoria profissional."
    },
    {
      question: "Quem pode participar do Centro de Carreiras?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Placeholder text sobre critérios de participação."
    },
    {
      question: "Como são formadas as duplas mentor-mentorado?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem. Placeholder text sobre processo de matching."
    },
    {
      question: "Qual a duração do programa?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre duração e cronograma do programa de carreiras."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Centro de Carreiras sempre disponível"
        announcementLink="#"
        title="Carreira"
        description="Conectamos talentos da Unicamp com oportunidades profissionais e oferecemos recursos para desenvolvimento de carreira e networking."
        primaryButtonText="Acessar Centro de Carreiras"
        primaryButtonLink="#"
        secondaryButtonText="Explorar Oportunidades"
        secondaryButtonLink="#"
      />
      <ImpactoAbout
        categoryText="Desenvolvimento Profissional"
        title="Conectando talentos com oportunidades excepcionais"
        paragraphs={paragraphs}
        stats={stats}
        learnMoreText="Explore todas as oportunidades disponíveis"
        learnMoreLink="#"
      />
      <CarreiraGrid />
      <SelecaoAvaliacao />
      <CarreiraTestimonial />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default Carreira