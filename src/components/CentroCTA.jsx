export default function CentroCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Conheça também o Centro de Carreiras
        </h2>
        <p className="mt-6 max-w-xl text-lg/8 text-gray-600">
          Plataforma digital disponível 24/7 que conecta estudantes da Unicamp com mentores residentes de todas as áreas. Acesso ilimitado a profissionais experientes para orientação de carreira, networking e preparação para processos seletivos.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="/impacto/centro"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Acessar Centro
          </a>
        </div>
      </div>
    </div>
  )
}