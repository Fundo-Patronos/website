import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Doadores contribuem.',
    description:
      'Potenciais doadores são convidados a contribuir com o Fundo Patrimonial, criando uma base sólida de recursos para a Unicamp.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Capital é investido.',
    description: 'O montante arrecadado é investido de acordo com as decisões do Conselho de Investimento, garantindo crescimento sustentável.',
    icon: LockClosedIcon,
  },
  {
    name: 'Rendimentos beneficiam a comunidade.',
    description: 'Os rendimentos dos investimentos retornam em benefícios diretos para a Comunidade da Unicamp através de editais anuais.',
    icon: ServerIcon,
  },
]

export default function FeatureScreenshot() {
  return (
    <div className="overflow-hidden bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-stretch">
          <div className="px-6 lg:px-0 lg:pt-4 lg:pr-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base leading-7 font-semibold" style={{color: '#ff9700'}}>Nossa Operação</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Um ciclo perpétuo de crescimento e impacto
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Contribuições se transformam em investimentos que geram rendimentos para sempre, financiando projetos que fortalecem a Unicamp continuamente.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5" style={{color: '#ff9700'}} />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0 flex items-stretch">
            <div className="relative isolate overflow-hidden px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pt-16 sm:pr-0 sm:pl-16 lg:mx-0 lg:max-w-none h-full flex items-center" style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}>
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-red-100 opacity-20 ring-1 ring-white ring-inset"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <img
                  alt="Visualização do ciclo perpétuo de crescimento e impacto do Fundo Patronos"
                  src="/Illustrative Pictures/Website - Home Page Feature Section w Picture (4).svg"
                  width={2432}
                  height={1442}
                  className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10 object-cover"
                  style={{aspectRatio: '2432/1442'}}
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}