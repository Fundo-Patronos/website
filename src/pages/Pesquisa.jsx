import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import ImpactoFAQ from '../components/ImpactoFAQ'

function Pesquisa() {
  const stats = [
    { label: 'Projetos Financiados', value: '75+' },
    { label: 'Pesquisadores Envolvidos', value: '320+' },
    { label: 'Publicações Científicas', value: '150+' },
    { label: 'Investimento em P&D', value: 'R$ 8M' },
  ]

  const paragraphs = [
    'Nossa linha de financiamento à pesquisa visa acelerar descobertas científicas e inovações tecnológicas que posicionem a Unicamp na vanguarda do conhecimento mundial. Apoiamos projetos multidisciplinares que abordam os grandes desafios da humanidade.',
    'Desde pesquisas fundamentais em ciências básicas até aplicações tecnológicas revolucionárias, nosso portfólio contempla projetos nas áreas de inteligência artificial, biotecnologia, sustentabilidade, saúde e ciências sociais aplicadas.',
    'Nossos pesquisadores apoiados publicaram mais de 150 artigos em periódicos de alto impacto, registraram dezenas de patentes e estabeleceram colaborações internacionais que fortalecem a posição da Unicamp no cenário científico global.'
  ]

  const faqs = [
    {
      question: "Quais áreas de pesquisa são elegíveis para financiamento?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre áreas de pesquisa apoiadas pelo programa de financiamento."
    },
    {
      question: "Como submeter uma proposta de pesquisa?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Placeholder text sobre processo de submissão de propostas."
    },
    {
      question: "Qual é o valor máximo de financiamento por projeto?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem. Placeholder text sobre limites de financiamento."
    },
    {
      question: "Como é feito o acompanhamento dos projetos financiados?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre monitoramento e relatórios de progresso dos projetos."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Chamada para projetos de pesquisa 2025"
        announcementLink="#"
        title="Pesquisa"
        description="Financiamos projetos de pesquisa inovadores que contribuem para o avanço científico e tecnológico, fortalecendo a excelência acadêmica da Unicamp."
        primaryButtonText="Submeter Projeto"
        primaryButtonLink="#"
        secondaryButtonText="Ver Projetos Apoiados"
        secondaryButtonLink="#"
      />
      <ImpactoAbout
        categoryText="Pesquisa e Inovação"
        title="Impulsionando descobertas que transformam o mundo"
        paragraphs={paragraphs}
        stats={stats}
        learnMoreText="Explore nosso portfólio de pesquisas"
        learnMoreLink="#"
      />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default Pesquisa