export default function TransparenciaHero() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-20 pb-16 sm:pt-32 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Transparência Total em Todas as Nossas Operações
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl leading-8">
              Nosso compromisso com a transparência vai além dos relatórios obrigatórios. Disponibilizamos 
              todas as informações sobre como gerenciamos e aplicamos os recursos do Fundo Patrimonial Patronos.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#documentos"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ 
                  background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
                  focusVisibleOutlineColor: '#ff9700'
                }}
              >
                Ver Documentos
              </a>
              <a href="#relatorios" className="text-sm leading-6 font-semibold text-gray-900">
                Relatórios Financeiros <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}