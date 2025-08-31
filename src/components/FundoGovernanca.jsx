import { 
  UserGroupIcon,
  UsersIcon, 
  DocumentTextIcon,
  ArrowPathIcon,
  BriefcaseIcon 
} from '@heroicons/react/20/solid'

const governancaItems = [
  {
    name: 'Assembleia Geral.',
    description:
      'Fórum democrático onde os associados tomam decisões estratégicas.',
    icon: UserGroupIcon,
  },
  {
    name: 'Conselho de Administração.',
    description:
      'Líderes que representam nossa comunidade e nos auxiliam na nossa gestão.',
    icon: UsersIcon,
  },
  {
    name: 'Comitê Fiscal.',
    description:
      'Profissionais com experiência contábil, responsáveis por garantir a integridade e ética do Fundo.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Comitê de Investimentos.',
    description:
      'Profissionais do mercado financeiro que gerenciam a alocação das doações para obtermos rentabilidade dos nossos recursos e investir na Comunidade da Unicamp.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Diretoria Executiva.',
    description:
      'Membros dedicados à operação diária, como prospecção de doadores e lançamento de editais.',
    icon: BriefcaseIcon,
  },
]

export default function FundoGovernanca() {
  return (
    <div className="overflow-hidden bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold" style={{color: '#ff9700'}}>Transparência e responsabilidade</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Nossa governança
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Composta de 5 conselhos formados por profissionais experientes, que garantem uma gestão eficiente e 
                representatividade da nossa comunidade na tomada de decisão.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {governancaItems.map((item) => (
                  <div key={item.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <item.icon aria-hidden="true" className="absolute top-1 left-1 size-5" style={{color: '#ff9700'}} />
                      {item.name}
                    </dt>{' '}
                    <dd className="inline">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <img
              alt="Estrutura de governança do Fundo Patrimonial Patronos"
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}