import { AcademicCapIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Inovação, Tecnologia e Pesquisa',
    description:
      'Apoiamos causas importantes da humanidade como inteligência artificial, engenharia genética, exploração espacial, mudanças climáticas, descarbonização e reflorestamento.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Carreira',
    description:
      'Oferecemos suporte ao desenvolvimento profissional dos estudantes, fortalecendo a formação de profissionais qualificados e preparados para os desafios do futuro.',
    href: '#',
    icon: AcademicCapIcon,
  },
  {
    name: 'Acesso',
    description:
      'Promovemos a inclusão através de bolsas de estudo, laptops e cursos de inglês para alunos em vulnerabilidade social, garantindo oportunidades para todos.',
    href: '#',
    icon: UsersIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            Nossa Missão na Unicamp
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Acelere a missão acadêmica da Unicamp através do nosso apoio em três frentes principais que transformam o ensino, pesquisa e impacto social na universidade.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-xl font-semibold text-gray-900">
                  <div className="mb-6 flex size-10 items-center justify-center rounded-lg" style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}>
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href={feature.href} className="text-sm font-semibold leading-6" style={{color: '#ff9700'}}>
                      Saiba mais <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}