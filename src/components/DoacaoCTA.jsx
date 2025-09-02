export default function DoacaoCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <h2 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Retribua para as próximas gerações. Faça sua contribuição hoje.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="https://doa.re/patronos"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Doar agora
          </a>
        </div>
      </div>
    </div>
  )
}