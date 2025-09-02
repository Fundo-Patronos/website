import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import ImpactoFAQ from '../components/ImpactoFAQ'

function Talentos() {
  const stats = [
    { label: 'Bolsistas Apoiados', value: '180+' },
    { label: 'Áreas Acadêmicas', value: '25' },
    { label: 'Valor Investido', value: 'R$ 3.5M' },
    { label: 'Taxa de Sucesso', value: '94%' },
  ]

  const paragraphs = [
    'Nosso programa Talentos e Bolsas foi criado para identificar e desenvolver os estudantes mais promissores da Unicamp, oferecendo suporte financeiro e acadêmico para que possam se dedicar integralmente aos estudos e pesquisas de excelência.',
    'Através de um processo seletivo rigoroso, identificamos talentos em diversas áreas do conhecimento e oferecemos bolsas que cobrem desde necessidades básicas até financiamento para projetos de pesquisa inovadores e participação em programas internacionais.',
    'Nossos bolsistas recebem mentoria personalizada de professores renomados e profissionais de mercado, participam de programas de liderança e têm acesso a uma rede exclusiva de ex-bolsistas que ocupam posições de destaque em empresas e instituições acadêmicas.'
  ]

  const faqs = [
    {
      question: "Quais são os tipos de bolsas disponíveis?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre diferentes modalidades de bolsas oferecidas pelo programa."
    },
    {
      question: "Como funciona o processo seletivo?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Placeholder text sobre etapas do processo seletivo."
    },
    {
      question: "Posso acumular bolsa do Patronos com outras bolsas?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem. Placeholder text sobre compatibilidade com outras bolsas."
    },
    {
      question: "Qual é a duração do programa de bolsas?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat. Placeholder text sobre duração e renovação das bolsas de estudo."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Programa de bolsas 2025 em breve"
        announcementLink="#"
        title="Talentos e Bolsas"
        description="Identificamos e apoiamos talentos excepcionais da Unicamp através de programas de bolsas e mentoria para desenvolvimento acadêmico e profissional."
        primaryButtonText="Candidatar-se a Bolsa"
        primaryButtonLink="#"
        secondaryButtonText="Conhecer Programa"
        secondaryButtonLink="#"
      />
      <ImpactoAbout
        categoryText="Desenvolvimento de Talentos"
        title="Investindo no futuro da excelência acadêmica"
        paragraphs={paragraphs}
        stats={stats}
        learnMoreText="Conheça histórias de nossos bolsistas"
        learnMoreLink="#"
      />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default Talentos