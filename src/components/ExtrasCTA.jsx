export default function ExtrasCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Transforme sua ideia em realidade. Inscreva seu projeto no Edital Decola Extras 2025.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="https://tally.so/r/nr4bd5"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Inscrever Projeto
          </a>
          <a
            href="/Regulamento Decola Extras 2026.pdf"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Ver Regulamento <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}