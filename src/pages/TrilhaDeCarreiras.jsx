import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import CarreiraGrid from '../components/CarreiraGrid'
import SelecaoAvaliacao from '../components/SelecaoAvaliacao'
import CarreiraTestimonial from '../components/CarreiraTestimonial'
import ImpactoFAQ from '../components/ImpactoFAQ'

function TrilhaDeCarreiras() {
  const stats = [
    { label: 'Duplas Formadas', value: '+300' },
    { label: 'Sessões de Mentoria', value: '5' },
    { label: 'Índice de Satisfação', value: '89%' },
    { label: 'Áreas de Conhecimento', value: 'Todas' },
  ]

  const paragraphs = [
    'Programa de mentoria de 5 meses para estudantes da Unicamp em fase final de graduação e pós-graduação. Conecta jovens talentos com profissionais experientes através de um processo sofisticado de matching, facilitando a transição do ambiente acadêmico para o mercado de trabalho.',
    'Abrange 12 especialidades (Tecnologia, Sustentabilidade, Liderança, Finanças) e 13 indústrias (Startups, Mercado Financeiro, Setor Público, Terceiro Setor). Nosso algoritmo de pareamento conecta estudantes com mentores baseado nos interesses dos participantes e na experiência prática dos orientadores.',
    'Totalmente remoto e acessível a todos os cursos da Unicamp. Prepara estudantes para processos seletivos e decisões de carreira através de orientações personalizadas, oferecendo ferramentas estratégicas para alcançar objetivos profissionais com direcionamento especializado.'
  ]

  const faqs = [
    {
      question: "Como escolher a trilha ideal para meu perfil?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre processo de escolha e orientação personalizada."
    },
    {
      question: "Qual a duração média de cada trilha?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Placeholder text sobre cronograma e duração das trilhas."
    },
    {
      question: "Posso participar de mais de uma trilha simultaneamente?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem. Placeholder text sobre participação múltipla."
    },
    {
      question: "As trilhas oferecem certificação?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre certificação e reconhecimento das trilhas."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Trilhas sempre abertas para novos participantes"
        announcementLink="#"
        title="Trilha de Carreiras"
        description="Desenvolva suas competências através de trilhas estruturadas e personalizadas, desenhadas para impulsionar sua carreira profissional."
        primaryButtonText="Explorar Trilhas"
        primaryButtonLink="#"
        secondaryButtonText="Inscrever-se Agora"
        secondaryButtonLink="#"
      />
      <ImpactoAbout
        categoryText="Desenvolvimento Estruturado"
        title="Mentoria estratégica com matching inteligente"
        paragraphs={paragraphs}
        stats={stats}
      />
      <CarreiraGrid />
      <SelecaoAvaliacao />
      <CarreiraTestimonial />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default TrilhaDeCarreiras