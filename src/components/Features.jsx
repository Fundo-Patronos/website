import { AcademicCapIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Educação de Excelência',
    description:
      'Apoiamos programas educacionais inovadores na Unicamp, fortalecendo a formação de profissionais qualificados e preparados para os desafios do futuro.',
    href: '#',
    icon: AcademicCapIcon,
  },
  {
    name: 'Pesquisa e Inovação',
    description:
      'Financiamos projetos de pesquisa de ponta que geram conhecimento científico e tecnológico, contribuindo para o desenvolvimento sustentável do Brasil.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Impacto Social',
    description:
      'Promovemos iniciativas de extensão universitária que levam o conhecimento acadêmico para a sociedade, beneficiando comunidades em todo o país.',
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
            O Fundo Patrimonial Patronos fortalece os três pilares fundamentais da universidade: ensino, pesquisa e extensão, 
            criando um legado duradouro para as futuras gerações.
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