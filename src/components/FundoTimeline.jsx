const timeline = [
  {
    name: 'Fundação do Fundo',
    description:
      'Equipe fundadora formada por 4 ex-alunos da Unicamp, veteranos em projetos extracurriculares e iniciativas institucionais na Universidade. Primeira doação histórica recebida de Fabricio Bloisi.',
    date: 'Nov 2019',
    dateTime: '2019-11',
  },
  {
    name: 'Primeiro Marco de Captação',
    description:
      'Primeiro R$ 1 milhão captado com contribuições estratégicas de C-levels, empreendedores, sócios e executivos das maiores empresas do Brasil.',
    date: 'Dez 2020',
    dateTime: '2020-12',
  },
  {
    name: 'Primeiros Editais Lançados',
    description:
      'Lançamento do primeiro edital de carreiras beneficiando 40 estudantes e primeiro edital de inovação, apoiando 5 projetos de pesquisa e desenvolvimento.',
    date: 'Mar 2021',
    dateTime: '2021-03',
  },
  {
    name: 'Consolidação Institucional',
    description:
      'Expansão completa dos programas, consolidando os três pilares estratégicos - carreira, pesquisa e inovação - e estruturação da governança com os comitês de Administração, Fiscal e Investimentos.',
    date: 'Jun 2022',
    dateTime: '2022-06',
  },
]

export default function FundoTimeline() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Nossa Trajetória
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Conheça os marcos importantes que consolidaram o Fundo Patrimonial Patronos como uma força transformadora na educação superior brasileira.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.name}>
              <time dateTime={item.dateTime} className="flex items-center text-sm/6 font-semibold" style={{color: '#ff9700'}}>
                <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                  <circle r={2} cx={2} cy={2} fill="currentColor" />
                </svg>
                {item.date}
                <div
                  aria-hidden="true"
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                />
              </time>
              <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">{item.name}</p>
              <p className="mt-1 text-base/7 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}