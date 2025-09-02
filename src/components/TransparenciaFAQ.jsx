const faqs = [
  {
    question: 'O que é um Fundo Patrimonial?',
    answer:
      'Um fundo patrimonial, ou endowment, é uma reserva financeira criada por organizações sem fins lucrativos para garantir sua sustentabilidade. O dinheiro vem de doações e é investido para gerar rendimentos. Parte desses rendimentos é usada nas atividades da organização, enquanto o restante é reinvestido para manter o Fundo crescendo. Assim, mesmo sem novas doações, a organização continua tendo recursos de forma perpétua.',
  },
  {
    question: 'Como o Fundo Patronos opera e acelera a missão acadêmica da Unicamp?',
    answer:
      'O Fundo Patronos acelera a missão acadêmica da Unicamp através de um modelo sustentável de investimentos. Nosso capital é investido profissionalmente para gerar rendimentos ao longo do tempo.\n\nCom esses rendimentos, atuamos em três frentes principais:\n\n• Inovação, Tecnologia e Pesquisa: apoiamos causas importantes da humanidade como inteligência artificial, engenharia genética, exploração espacial, mudanças climáticas, descarbonização e reflorestamento.\n\n• Carreira: oferecemos suporte ao desenvolvimento profissional dos estudantes.\n\n• Acesso: promovemos a inclusão através de bolsas de estudo, laptops e cursos de inglês para alunos em vulnerabilidade social.',
  },
  {
    question: 'Qual o diferencial do modelo de Fundo Patrimonial?',
    answer:
      'No modelo tradicional de filantropia, uma organização arrecada R$ 1 milhão em doações e gasta tudo em um ano. No ano seguinte, precisa captar tudo de novo para continuar funcionando. Com um fundo patrimonial, esse mesmo R$ 1 milhão é investido para gerar rendimentos. Uma parte desses rendimentos é usada para as atividades da organização, enquanto o principal permanece investido. Com o tempo, o Fundo cresce e garante renda contínua, mesmo sem novas doações.',
  },
  {
    question: 'Como posso apoiar o Fundo Patronos?',
    answer:
      'Qualquer pessoa ou empresa pode apoiar nossa causa. Para pessoas físicas, a doação pode ser feita de duas maneiras: um valor determinado ou através de doações recorrentes através do site: https://doa.re/patronos. Empresas também podem contribuir através de parcerias estratégicas. Todas as doações são direcionadas para fortalecer nosso patrimônio e ampliar nosso impacto na comunidade acadêmica.',
  },
  {
    question: 'As doações para o Fundo Patronos oferecem incentivos fiscais?',
    answer:
      'Atualmente, devido à legislação brasileira, não podemos oferecer incentivos fiscais para doadores do Fundo Patronos. No entanto, estamos trabalhando ativamente com outros fundos patrimoniais e representantes no Congresso Nacional para alterar essa legislação e oferecer esse benefício no futuro.',
  },
  {
    question: 'As pessoas que trabalham no Fundo Patronos são remuneradas?',
    answer:
      'Todas as pessoas que trabalham no Fundo Patronos são voluntárias e não recebem remuneração. Trabalhamos no Fundo porque nos sentimos alinhados com a missão e o propósito da organização, dedicando nosso tempo e expertise para fortalecer a educação superior no Brasil e apoiar a comunidade acadêmica da Unicamp.',
  },
]

export default function TransparenciaFAQ() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="mt-4 text-base/7 text-pretty text-gray-600">
              Não encontrou a resposta que procurava? Entre em contato com nossa{' '}
              <a 
                href="#" 
                className="font-semibold hover:opacity-70 transition-opacity"
                style={{ color: '#ff9700' }}
              >
                equipe de relacionamento
              </a>{' '}
              para mais informações.
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base/7 font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-base/7 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}