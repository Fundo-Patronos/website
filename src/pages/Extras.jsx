import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import EscopoExtracurriculares from '../components/EscopoExtracurriculares'
import CriteriosAvaliacao from '../components/CriteriosAvaliacao'
import ImpactoFAQ from '../components/ImpactoFAQ'

function Extras() {
  const stats = [
    { label: 'Projetos Apoiados', value: '45+' },
    { label: 'Estudantes Impactados', value: '800+' },
    { label: 'Áreas de Atuação', value: '12' },
    { label: 'Investimento Total', value: 'R$ 2M' },
  ]

  const paragraphs = [
    'Nosso programa de Extracurriculares e Projetos de Extensão tem como missão fomentar o empreendedorismo estudantil e a inovação social na Unicamp. Apoiamos iniciativas que vão além da sala de aula, conectando conhecimento acadêmico com impacto real na sociedade.',
    'Desde 2021, temos investido em projetos que abordam desafios sociais, ambientais e tecnológicos. Nossos editais contemplam desde startups nascentes até projetos de extensão que levam conhecimento para comunidades carentes.',
    'Através de mentoria especializada, recursos financeiros e networking, proporcionamos aos estudantes as ferramentas necessárias para transformar suas ideias em realidade e gerar impacto positivo duradouro.'
  ]

  const faqs = [
    {
      question: "Como posso inscrever meu projeto extracurricular?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text para explicar o processo de inscrição de projetos extracurriculares."
    },
    {
      question: "Quais são os critérios de seleção?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Placeholder text sobre critérios de seleção."
    },
    {
      question: "Qual é o valor do apoio financeiro?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem. Placeholder text sobre valores de apoio."
    },
    {
      question: "Quando são divulgados os resultados?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre cronograma de divulgação de resultados."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Inscrições abertas para projetos 2025"
        announcementLink="#"
        title="Extracurriculares e Projetos de Extensão"
        description="Apoiamos iniciativas estudantis que promovem inovação, empreendedorismo e impacto social na comunidade universitária da Unicamp."
        primaryButtonText="Inscrever Projeto"
        primaryButtonLink="#"
        secondaryButtonText="Ver Editais"
        secondaryButtonLink="#"
      />
      <ImpactoAbout
        categoryText="Empreendedorismo Estudantil"
        title="Transformando ideias em impacto real"
        paragraphs={paragraphs}
        stats={stats}
        learnMoreText="Conheça todos os projetos apoiados"
        learnMoreLink="#"
      />
      <EscopoExtracurriculares />
      <CriteriosAvaliacao />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default Extras