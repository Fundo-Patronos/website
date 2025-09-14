const timeline = [
  {
    name: 'Registro na Plataforma',
    description:
      'Alunos se registram no Centro de Carreiras, exclusivo para estudantes da Unicamp. Recomendamos criar a conta com o email da DAC para validação automática',
    date: 'Passo 1',
    dateTime: 'passo-1',
  },
  {
    name: 'Exploração de Oportunidades',
    description:
      'Encontram mentores especializados e oportunidades exclusivas dentro da plataforma, navegando por diferentes áreas de expertise e indústrias',
    date: 'Passo 2',
    dateTime: 'passo-2',
  },
  {
    name: 'Conexão com Mentores',
    description:
      'Entram em contato com mentores residentes, parceiros ou empresas através do Centro de Carreiras, utilizando as ferramentas de networking da plataforma',
    date: 'Passo 3',
    dateTime: 'passo-3',
  },
  {
    name: 'Desenvolvimento de Carreira',
    description:
      'Realizam conversas e sessões de mentoria para tomar decisões estratégicas e dar o próximo passo na carreira profissional',
    date: 'Passo 4',
    dateTime: 'passo-4',
  },
]

export default function CentroComoFunciona() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Como Funciona
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Processo simples e intuitivo para conectar estudantes da Unicamp com mentores e oportunidades profissionais.</p>
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