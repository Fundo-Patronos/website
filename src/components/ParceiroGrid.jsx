const partners = [
  {
    name: 'Parceiro Premium 1',
    category: 'Premium',
    logo: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Premium 2',
    category: 'Premium',
    logo: 'https://images.unsplash.com/photo-1614926857083-7be149266cda?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Estratégico 1',
    category: 'Estratégico',
    logo: 'https://images.unsplash.com/photo-1614705827065-62c3dc488f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Estratégico 2',
    category: 'Estratégico',
    logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Apoiador 1',
    category: 'Apoiador',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Apoiador 2',
    category: 'Apoiador',
    logo: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Institucional 1',
    category: 'Institucional',
    logo: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
  {
    name: 'Parceiro Institucional 2',
    category: 'Institucional',
    logo: 'https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
  },
]

export default function ParceiroGrid() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Nossos Parceiros
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Construindo um futuro melhor para a educação superior em parceria com organizações que compartilham nossa missão e valores.
          </p>
        </div>

        <div className="mt-16">
          <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {partners.map((partner) => (
              <li key={partner.logo} className="relative">
                <div className="group overflow-hidden rounded-lg bg-gray-100 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600">
                  <img
                    alt={`Logo ${partner.name}`}
                    src={partner.logo}
                    className="pointer-events-none aspect-square w-full rounded-lg object-cover outline -outline-offset-1 outline-black/5 group-hover:opacity-75 transition-opacity"
                  />
                  <button type="button" className="absolute inset-0 focus:outline-hidden">
                    <span className="sr-only">Ver detalhes de {partner.name}</span>
                  </button>
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                  {partner.name}
                </p>
                <p className="pointer-events-none block text-sm font-medium text-gray-500">
                  {partner.category}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8">
            Interessado em se tornar um parceiro do Fundo Patronos?
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              focusVisibleOutlineColor: '#ff9700'
            }}
          >
            Entre em Contato
          </a>
        </div>
      </div>
    </div>
  )
}