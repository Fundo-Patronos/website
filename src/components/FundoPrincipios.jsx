import { HandRaisedIcon, ShieldCheckIcon, LightBulbIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline'

const principios = [
  {
    name: 'PERPETUIDADE',
    description:
      'Construímos um fundo sustentável e perene para garantir o contínuo apoio à comunidade da Unicamp, assegurando a criação de valor a longo prazo.',
    icon: HandRaisedIcon,
  },
  {
    name: 'TRANSPARÊNCIA',
    description:
      'Operamos com máxima transparência, sempre prestando contas aos nossos doadores e à nossa comunidade.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'INOVAÇÃO E IMPACTO',
    description:
      'Valorizamos ideias modernas que buscam solucionar os mais importantes problemas da humanidade.',
    icon: LightBulbIcon,
  },
  {
    name: 'DIVERSIDADE E INTERDISCIPLINARIDADE',
    description:
      'Acreditamos que a diversidade e a conexão entre grupos e ideias sejam chaves para desenvolver e impactar nossa sociedade.',
    icon: UserGroupIcon,
  },
  {
    name: 'COLABORAÇÃO E COMPROMETIMENTO',
    description:
      'Buscamos construir uma comunidade unida, formadora de líderes e comprometida com o futuro do Brasil.',
    icon: StarIcon,
  },
]

export default function FundoPrincipios() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            Nossos princípios
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Os valores que orientam nossa missão e garantem a excelência em tudo que fazemos pela comunidade da Unicamp.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-5 lg:gap-x-8 lg:gap-y-16">
            {principios.map((principio) => (
              <div key={principio.name} className="flex flex-col">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="mb-6 flex size-10 items-center justify-center rounded-lg" style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}>
                    <principio.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {principio.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{principio.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}