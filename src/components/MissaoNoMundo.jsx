import { RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function MissaoNoMundo() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:mx-0">
          <p
            className="text-base font-semibold leading-7"
            style={{ color: '#c964e2' }}
          >
            Terceira palavra-chave
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            No Mundo
          </h2>
          <div className="mt-10 text-lg leading-8 text-gray-600">
            <p>
              Os grandes desafios da humanidade, como mudanças climáticas, saúde global e avanços
              tecnológicos, não serão resolvidos por recursos ou instituições. Serão resolvidos
              por pessoas.
            </p>
            <p>
              A Unicamp produz alguns dos talentos mais excepcionais do Brasil. Nosso papel é
              garantir que esses talentos tenham as condições para alcançar seu potencial máximo
              e impactar não só o Brasil, mas o mundo.
            </p>
            <p>
              Inteligência artificial, engenharia genética, exploração espacial, descarbonização:
              todos esses avanços dependem de pessoas preparadas para liderar. O futuro está nas
              mãos de quem estamos desenvolvendo hoje.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,151,0,0.1), rgba(255,98,83,0.1), rgba(252,70,150,0.1), rgba(201,100,226,0.1))' }}>
          <div
            className="mx-auto flex size-12 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
          >
            <RocketLaunchIcon className="size-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Cada doação é um investimento em uma pessoa
          </h3>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Quando você apoia o Fundo Patronos, está investindo diretamente no desenvolvimento
            de uma pessoa, com nome, história e potencial para transformar o mundo.
            E esse investimento rende para sempre.
          </p>
        </div>
      </div>
    </div>
  )
}
