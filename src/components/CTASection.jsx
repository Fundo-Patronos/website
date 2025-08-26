import { CheckCircleIcon } from '@heroicons/react/20/solid'

const benefits = [
  'Apoio direto à educação de excelência',
  'Fomento à pesquisa e inovação',
  'Bolsas para estudantes talentosos',
  'Infraestrutura moderna para a Unicamp',
  'Impacto social duradouro',
  'Transparência total nos investimentos',
]

export default function CTASection() {
  return (
    <div className="overflow-hidden bg-white py-12 sm:py-16">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/75 px-6 py-16 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
            <img
              alt="Estudantes da Unicamp em atividade acadêmica"
              src="https://picsum.photos/800/600?random=1"
              className="h-96 w-full flex-none rounded-2xl object-cover lg:aspect-square lg:h-auto lg:max-w-sm"
            />
            <div className="w-full flex-auto">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl">
                Transforme o futuro com sua doação
              </h2>
              <p className="mt-6 text-lg leading-8 text-pretty text-gray-600">
                Sua contribuição ao Fundo Patrimonial Patronos fortalece a Unicamp e amplia seu impacto na sociedade brasileira através da educação, pesquisa e inovação.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-gray-950 sm:grid-cols-2"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircleIcon aria-hidden="true" className="h-7 w-5 flex-none text-blue-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex">
                <a href="#" className="text-sm leading-6 font-semibold text-blue-600 hover:text-blue-500">
                  Fazer minha doação
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-blue-200 to-blue-400 opacity-50"
          />
        </div>
      </div>
    </div>
  )
}