import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import EscopoExtracurriculares from '../components/EscopoExtracurriculares'
import CriteriosAvaliacao from '../components/CriteriosAvaliacao'
import ExtrasCronograma from '../components/ExtrasCronograma'
import ImpactoFAQ from '../components/ImpactoFAQ'
import ExtrasCTA from '../components/ExtrasCTA'

function Extras() {
  const stats = [
    { label: 'Projetos Apoiados', value: '30+' },
    { label: 'Estudantes Impactados', value: '2,700' },
    { label: 'Áreas do Conhecimento', value: 'Todas' },
  ]

  const paragraphs = [
    'Nosso programa de Extracurriculares e Projetos de Extensão tem como missão fomentar o empreendedorismo estudantil e a inovação social na Unicamp. Apoiamos iniciativas que vão além da sala de aula, conectando conhecimento acadêmico com impacto real na sociedade.',
    'Desde 2021, temos investido em projetos que abordam desafios sociais, ambientais e tecnológicos. Nossos editais contemplam desde startups nascentes até projetos de extensão que levam conhecimento para comunidades carentes.',
    'Através de mentoria especializada, recursos financeiros e networking, proporcionamos aos estudantes as ferramentas necessárias para transformar suas ideias em realidade e gerar impacto positivo duradouro.'
  ]

  const faqs = [
    {
      question: "O que é o Edital Decola Extras?",
      answer: "É um programa destinado a organizações extracurriculares e de extensão que buscam apoio financeiro ou institucional para executar projetos relacionados a qualquer área de atuação, com impacto positivo na Unicamp e na sociedade em geral."
    },
    {
      question: "Quanto de investimento pode ser solicitado?",
      answer: "Os projetos podem solicitar o valor que considerarem necessário, limitado ao teto de R$ 7.500 por projeto. É importante destacar que o apoio financeiro será concedido por meio de um sistema de reembolso. Isso significa que as equipes deverão inicialmente cobrir os custos com recursos próprios e, posteriormente, solicitar o reembolso dentro do valor aprovado. O reembolso é obrigatório como forma de repasse dos recursos, e o valor solicitado não poderá ultrapassar R$ 7.500. Equipes de projetos não selecionados serão contempladas com um treinamento exclusivo como forma de reconhecimento e capacitação para futuras oportunidades."
    },
    {
      question: "Qual o período de duração do programa?",
      answer: "O programa tem duração de 1 (um) ano, iniciando após a divulgação dos selecionados. Os projetos podem ter qualquer duração dentro deste período estabelecido."
    },
    {
      question: "Quem pode participar?",
      answer: "Organizações extracurriculares ou de extensão são consideradas aquelas sem cunho político-partidário e fins lucrativos, atuando em áreas como cultura, educação, esporte, inovação, social, ambiental, saúde, jornadas profissionais ou outras alinhadas aos pilares do Patronos. São exemplos: Centros Acadêmicos, Atléticas, Ligas, Grupos, Semanas Acadêmicas, Associações, Conjuntos, Comissões e Times. Os quadros de membros e dos conselhos das organizações devem ser majoritariamente compostos por pessoas da comunidade da Unicamp (alunos de graduação, pós-graduação stricto sensu, funcionários e/ou docentes). As organizações devem ser reconhecidamente pertencentes e vinculadas à Unicamp, sendo isso verificável mediante consulta a membros da comunidade."
    },
    {
      question: "Quem deve enviar o projeto?",
      answer: "O representante legal ou qualquer membro ou conselheiro da organização extracurricular ou de extensão designado para essa responsabilidade."
    },
    {
      question: "Que tipo de projetos podem ser inscritos?",
      answer: "O programa tem como premissa ser amplo e abrangente. Serão aceitos projetos cujas iniciativas sejam de cunho social, educacional, esportivo, cultural, ambiental, voltado à saúde, atividades de inovação e empreendedorismo, ou outras que estimulem e impactem positivamente a Unicamp e a sociedade."
    },
    {
      question: "Quantos projetos serão selecionados?",
      answer: "A quantidade de projetos selecionados limita-se aos recursos financeiros disponíveis e à decisão da banca avaliadora. Durante a etapa de avaliação, as propostas serão selecionadas para apresentar um pitch do seu projeto à banca avaliadora. Após a avaliação pela banca, será realizada a seleção final dos projetos que receberão apoio financeiro mediante análise e aprovação do Conselho de Administração do Patronos, a partir das informações do processo seletivo e da banca examinadora."
    },
    {
      question: "Quais as responsabilidades dos selecionados?",
      answer: "A execução dos projetos deve ser realizada visando a entrega dos resultados esperados pactuados na contratação, zelando pelos princípios da legalidade, ética, impessoalidade, moralidade, economicidade e eficiência. Relatórios parciais e finais sobre a execução física dos projetos deverão ser entregues pelas organizações, bem como relatórios de prestação de contas sobre o uso dos recursos financeiros. Cabe também aos selecionados utilizarem da imagem institucional Patronos na divulgação da parceria e dos resultados do projeto."
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
        primaryButtonLink="https://tally.so/r/nr4bd5"
        secondaryButtonText="Ver Regulamento"
        secondaryButtonLink="/Regulamento Decola Extras 2026.pdf"
      />
      <ImpactoAbout
        categoryText="Empreendedorismo Estudantil"
        title="Transformando ideias em impacto real"
        paragraphs={paragraphs}
        stats={stats}
        imageUrl="/Escopo Extracurriculares/Baja 3 -Filtrada.jpg"
      />
      <EscopoExtracurriculares />
      <CriteriosAvaliacao />
      <ExtrasCronograma />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
      <ExtrasCTA />
    </div>
  )
}

export default Extras