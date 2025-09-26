export default function ContatoDetails() {
  return (
    <div className="bg-white py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-3">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900">Entre em Contato</h2>
              <p className="mt-4 text-base/7 text-gray-600">
                Conecte-se conosco através dos nossos canais oficiais para parcerias, doações e colaborações.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base/7 font-semibold text-gray-900">Website</h3>
                <dl className="mt-3 space-y-1 text-sm/6 text-gray-600">
                  <div>
                    <dt className="sr-only">Website</dt>
                    <dd>
                      <a href="https://www.patronos.org/" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{color: '#ff9700'}}>
                        www.patronos.org/
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base/7 font-semibold text-gray-900">Email</h3>
                <dl className="mt-3 space-y-1 text-sm/6 text-gray-600">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a href="mailto:contato@patronos.org" className="font-semibold" style={{color: '#ff9700'}}>
                        contato@patronos.org
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base/7 font-semibold text-gray-900">Instagram</h3>
                <dl className="mt-3 space-y-1 text-sm/6 text-gray-600">
                  <div>
                    <dt className="sr-only">Instagram</dt>
                    <dd>
                      <a href="https://instagram.com/fundopatronos/" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{color: '#ff9700'}}>
                        instagram.com/fundopatronos/
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base/7 font-semibold text-gray-900">LinkedIn</h3>
                <dl className="mt-3 space-y-1 text-sm/6 text-gray-600">
                  <div>
                    <dt className="sr-only">LinkedIn</dt>
                    <dd>
                      <a href="https://linkedin.com/company/fundo-patronos" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{color: '#ff9700'}}>
                        linkedin.com/company/fundo-patronos
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base/7 font-semibold text-gray-900">YouTube</h3>
                <dl className="mt-3 space-y-1 text-sm/6 text-gray-600">
                  <div>
                    <dt className="sr-only">YouTube</dt>
                    <dd>
                      <a href="https://youtube.com/@FundoPatronos" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{color: '#ff9700'}}>
                        youtube.com/@FundoPatronos
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}