import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import SelecaoAvaliacao from '../components/SelecaoAvaliacao'
import TrilhaTestimonial from '../components/TrilhaTestimonial'
import ImpactoFAQ from '../components/ImpactoFAQ'
import CentroCTA from '../components/CentroCTA'

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
      question: "O que é o programa Trilha de Carreira?",
      answer: "Uma jornada de cinco meses voltada a apoiar alunos com formação preferencialmente nos próximos 2 anos, na transição para o mercado de trabalho, preparando-os para processos seletivos e a tomada de decisões estruturadas e conscientes de carreira e desenvolvimento profissional. Nosso processo de formação de duplas é otimizado para unir alunos da Unicamp com ex-alunos que enfrentaram os mesmos desafios em sua jornada profissional."
    },
    {
      question: "Como é feita a formação das duplas?",
      answer: "A dupla de mentoria será formada a fim de garantir a melhor afinidade e compatibilidade entre mentor e mentorado através de questões presentes no formulário de inscrição. Ele nos ajudará a procurar a combinação ideal para cada dupla."
    },
    {
      question: "Como serão feitas as sessões de mentoria?",
      answer: "O programa de mentoria contará com sessões mensais (cinco ao todo), onde cada dupla terá a liberdade de agendar a melhor data de acordo com as disponibilidades de agenda, respeitando a sugestão de datas do cronograma do regulamento. Os agendamentos das sessões serão sugeridos pelo time do Patronos, sendo que antes de cada sessão os mentores e mentorados terão acesso a um material que os ajudarão a se aprofundar no tema e ter uma sessão mais produtiva."
    },
    {
      question: "Quem pode participar?",
      answer: "Poderão participar alunas e alunos matriculados em quaisquer cursos de graduação e pós-graduação da Unicamp, com conclusão prevista para nos próximos 2 anos."
    },
    {
      question: "Como é feita a seleção?",
      answer: "1) Análise Eliminatória: baseado no cumprimento das condições mínimas de participação do edital. Apenas aplicações completas serão analisadas. 2) Análise Classificatória: baseado na análise de perfil, trajetória e motivações do candidato expostas no formulário de inscrição."
    },
    {
      question: "Quais as responsabilidades e a dedicação mínima no programa?",
      answer: "1) Responder ao questionário que servirá de base para a formação de duplas; 2) Ter participação de 100% nas atividades do Trilha de Carreiras, sendo necessária a presença em todas as sessões de mentoria individual. 3) Os participantes que não engajarem conforme os requisitos acima serão devidamente notificados sobre seu rendimento para que as devidas ações sejam tomadas."
    },
    {
      question: "O que acontece caso o aluno desista do programa?",
      answer: "Em caso de desistência, o Patronos deverá ser comunicado pelo aluno por e-mail com 7 (sete) dias de antecedência, esclarecendo os motivos do abandono do programa. A vaga poderá ser preenchida por alunos da lista de espera, a depender do andamento do programa e compatibilidade com a base de mentores disponíveis."
    },
    {
      question: "Qual o compromisso que assumirei? (Para Mentores)",
      answer: "Os mentores deverão ter sessões mensais de aproximadamente 1h com seus mentorados nos meses de Julho a Dezembro (5 sessões no total)."
    },
    {
      question: "O que deverá ser abordado na mentoria? (Para Mentores)",
      answer: "As sessões de mentoria estarão focadas no autoconhecimento e planejamento de carreira dos mentorados. Antes de cada sessão as duplas receberão materiais de apoio que deverão ser usados como base e lhes auxiliarão durante as conversas."
    },
    {
      question: "Se eu me inscrever é certeza que participarei como mentor? (Para Mentores)",
      answer: "Não. É possível que haja mais mentores inscritos do que necessário para a formação das duplas. Assim, existe a possibilidade da não participação. Mas o teu perfil ficará no banco de mentores para outras oportunidades no Patronos."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Trilhas sempre abertas para novos participantes"
        announcementLink="#"
        title="Trilha de Carreiras"
        description="Desenvolva suas competências através de trilhas estruturadas e personalizadas, desenhadas para impulsionar sua carreira profissional."
        primaryButtonText="Inscrição de Estudantes"
        primaryButtonLink="https://tally.so/r/mYxxxB"
        secondaryButtonText="Inscrição de Mentores"
        secondaryButtonLink="https://tally.so/r/wokkkP"
      />
      <ImpactoAbout
        categoryText="Desenvolvimento Estruturado"
        title="Mentoria estratégica com matching inteligente"
        paragraphs={paragraphs}
        stats={stats}
        imageUrl="/Illustrative Pictures/Trilha de Carreiras.jpg"
      />
      <SelecaoAvaliacao />
      <TrilhaTestimonial />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
      <CentroCTA />
    </div>
  )
}

export default TrilhaDeCarreiras