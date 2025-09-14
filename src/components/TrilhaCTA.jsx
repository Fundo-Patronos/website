export default function TrilhaCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Conheça também a Trilha de Carreiras
        </h2>
        <p className="mt-6 max-w-xl text-lg/8 text-gray-600">
          Programa de mentoria de 5 meses para estudantes da Unicamp em fase final de graduação e pós-graduação. Conecta alunos da Unicamp com profissionais experientes através de matching inteligente, facilitando a transição para o mercado de trabalho.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="/impacto/trilhas"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Explorar Trilha
          </a>
        </div>
      </div>
    </div>
  )
}