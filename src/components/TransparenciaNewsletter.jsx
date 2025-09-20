import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'

export default function TransparenciaNewsletter() {
  return (
    <div id="newsletter" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Receba nossa newsletter</h2>
            <p className="mt-4 text-lg text-gray-600">
              Receba nossa newsletter e fique por dentro de nossas novidades, projetos apoiados e impactos gerados na comunidade acadêmica.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Endereço de email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Digite seu email"
                autoComplete="email"
                className="min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                style={{ focusOutlineColor: '#ff9700' }}
              />
              <button
                type="submit"
                className="flex-none rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
                style={{ 
                  background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
                  focusVisibleOutlineColor: '#ff9700'
                }}
              >
                Inscrever-se
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/50 p-2 ring-1 ring-gray-200">
                <CalendarDaysIcon aria-hidden="true" className="size-6 text-gray-600" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900">Atualizações mensais</dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Receba mensalmente informações sobre nossos projetos, resultados alcançados e novidades do fundo.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/50 p-2 ring-1 ring-gray-200">
                <HandRaisedIcon aria-hidden="true" className="size-6 text-gray-600" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900">Sem spam</dt>
              <dd className="mt-2 text-base/7 text-gray-600">
                Respeitamos sua privacidade. Enviaremos apenas conteúdo relevante e você pode cancelar a qualquer momento.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}