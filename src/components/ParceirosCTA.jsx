export default function ParceirosCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Junte-se a nós na construção do futuro da educação superior no Brasil.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Torne-se um parceiro do Fundo Patronos e faça parte de uma rede de organizações comprometidas com o desenvolvimento da Unicamp e o avanço da educação no país.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="#"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Torne-se Parceiro
          </a>
          <a
            href="#"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Saiba mais sobre parcerias <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}