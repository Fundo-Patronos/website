import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import ImpactoFAQ from '../components/ImpactoFAQ'

const partners = [
  {
    name: 'BeConfident',
    logo: '/parceiros/BeConfident.svg',
    website: 'https://beconfident.app/',
  },
  {
    name: 'Matera',
    logo: '/parceiros/Matera.svg',
    website: 'https://www.matera.com/br/',
  },
]

function TalentosPartners() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Parceiros do Programa
          </h2>
        </div>
        <div className="mx-auto mt-10 flex justify-center gap-x-8 gap-y-10">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-lg bg-white focus-within:outline-2 focus-within:outline-offset-2"
            >
              <img
                alt={`Logo ${partner.name}`}
                src={partner.logo}
                className="aspect-square w-64 rounded-lg object-cover outline -outline-offset-1 outline-black/5 group-hover:opacity-75 transition-opacity"
              />
              <p className="mt-2 block truncate text-center text-sm font-medium text-gray-900">
                {partner.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function TalentosBeneficios() {
  const beneficios = [
    {
      title: 'Bolsa Mensal',
      description: 'Apoio financeiro mensal para manutenção da vida universitária, permitindo que você se dedique integralmente aos estudos.',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      title: 'Laptop',
      description: 'Um laptop fornecido pela Matera para uso acadêmico que será seu permanentemente, sem necessidade de devolução.',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
      ),
    },
    {
      title: 'Curso de Inglês',
      description: 'Licença do aplicativo BeConfident para desenvolver fluência em inglês, essencial para sua carreira acadêmica e profissional.',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            O que os bolsistas recebem
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Um pacote completo de apoio para que você possa focar no que realmente importa: sua formação.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
          {beneficios.map((beneficio) => (
            <div key={beneficio.title} className="flex flex-col items-center text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}
              >
                {beneficio.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">{beneficio.title}</h3>
              <p className="mt-2 text-base text-gray-600">{beneficio.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Talentos() {
  const stats = [
    { label: 'Áreas do Conhecimento', value: 'Todas' },
    { label: 'Duração do Apoio', value: '1 ano+' },
    { label: 'Laptop', value: 'Permanente' },
  ]

  const paragraphs = [
    'O Edital de Talentos e Bolsas do Fundo Patronos foi criado para apoiar talentos excepcionais da Unicamp em todas as áreas do conhecimento. Nosso objetivo é identificar estudantes com alto potencial e oferecer as condições necessárias para que possam se dedicar integralmente à sua formação acadêmica.',
    'Os alunos selecionados recebem uma bolsa mensal em dinheiro para manutenção da vida universitária, um laptop para uso acadêmico (que será do aluno permanentemente) e acesso a um curso de inglês através de licenças do aplicativo BeConfident.',
    'O processo de seleção considera tanto as necessidades individuais de cada candidato quanto suas conquistas, planos e atividades na Universidade. O apoio financeiro e a licença para o curso de inglês têm duração inicial de 1 ano, com possibilidade de extensão até a graduação do aluno.',
  ]

  const faqs = [
    {
      question: "Quem pode se candidatar ao programa?",
      answer: "Estudantes de graduação da Unicamp de todas as áreas do conhecimento podem se candidatar. Buscamos talentos excepcionais que demonstrem potencial acadêmico e necessidade de apoio para sua formação."
    },
    {
      question: "Quais são os benefícios oferecidos?",
      answer: "Os bolsistas recebem três benefícios principais: uma bolsa mensal em dinheiro para manutenção da vida universitária, um laptop para uso acadêmico (que será do aluno permanentemente, sem necessidade de devolução) e licença do aplicativo BeConfident para curso de inglês."
    },
    {
      question: "Posso acumular a bolsa do Patronos com outras bolsas?",
      answer: "Sim, as bolsas do programa Talentos e Bolsas podem ser acumuladas com outras bolsas, como por exemplo bolsas de iniciação científica. Isso permite que você maximize as oportunidades disponíveis para sua formação."
    },
    {
      question: "Qual é a duração do programa?",
      answer: "O apoio financeiro (bolsa mensal) e a licença para o curso de inglês têm duração inicial de 1 ano, com possibilidade de extensão até a graduação do aluno, mediante avaliação de desempenho. O laptop é do aluno permanentemente, sem prazo de devolução."
    },
    {
      question: "Como funciona o processo de seleção?",
      answer: "O processo de seleção avalia tanto as necessidades individuais de cada candidato quanto suas conquistas acadêmicas, planos futuros e atividades desenvolvidas na Universidade. Buscamos um equilíbrio entre mérito e necessidade para selecionar os bolsistas."
    },
    {
      question: "Preciso devolver o laptop ao final do programa?",
      answer: "Não. O laptop fornecido pelo programa será do aluno permanentemente, sem necessidade de devolução ao final do período de bolsa ou após a graduação."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Programa de bolsas"
        announcementLink="#"
        title="Talentos e Bolsas"
        description="Apoiamos talentos excepcionais da Unicamp em todas as áreas do conhecimento com bolsa mensal, laptop e curso de inglês para que possam se dedicar integralmente à sua formação."
        primaryButtonText="Em breve"
        primaryButtonLink="#"
        secondaryButtonText="Saiba mais"
        secondaryButtonLink="#beneficios"
        primaryButtonDisabled={true}
      />
      <ImpactoAbout
        categoryText="Desenvolvimento de Talentos"
        title="Investindo no futuro da excelência acadêmica"
        paragraphs={paragraphs}
        stats={stats}
        learnMoreText=""
        learnMoreLink=""
        imageUrl="/Illustrative Pictures/eliott-reyna-iO2d-KYp5JU-unsplash.jpg"
      />
      <div id="beneficios">
        <TalentosBeneficios />
      </div>
      <TalentosPartners />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
    </div>
  )
}

export default Talentos
