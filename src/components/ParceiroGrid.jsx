const partners = [
  // Row 1
  {
    name: 'VRB',
    logo: '/parceiros/VRB.svg',
    website: 'https://vrb.org.br/',
  },
  {
    name: 'IDIS',
    logo: '/parceiros/IDIS.svg',
    website: 'https://www.idis.org.br/',
  },
  {
    name: 'Rio Endowment',
    logo: '/parceiros/Rio Endowment.svg',
    website: 'https://www.rioendowment.com/',
  },
  {
    name: 'Instituto Reditus',
    logo: '/parceiros/Instituto Reditus.svg',
    website: 'https://www.reditus.org.br/',
  },
  {
    name: 'SempreFEA',
    logo: '/parceiros/SempreFEA.svg',
    website: 'https://semprefea.org.br/',
  },
  {
    name: 'UniAngels',
    logo: '/parceiros/UniAngels.svg',
    website: null,
  },
  {
    name: 'Sweetmix',
    logo: '/parceiros/Sweetmix.svg',
    website: 'https://www.sweetmix.com.br/',
  },
  // Row 2
  {
    name: 'Maltagri Consultoria',
    logo: '/parceiros/Maltagri Consultoria.svg',
    website: null,
  },
  {
    name: 'Noviga',
    logo: '/parceiros/Noviga.svg',
    website: 'https://novigapartner.com.br/',
  },
  {
    name: 'Brazil Foundation',
    logo: '/parceiros/Brazil Foundation.svg',
    website: 'https://brazilfoundation.org/saiba-mais/como-apoiamos/fundo-patrimonial-patronos/',
  },
  {
    name: 'Grand Cru',
    logo: '/parceiros/Grand Cru.svg',
    website: 'https://www.grandcru.com.br/',
  },
  {
    name: 'JF Granja',
    logo: '/parceiros/JF Granja.svg',
    website: 'https://jfgranja.com.br/',
  },
  {
    name: 'XP Investimentos',
    logo: '/parceiros/XP Investimentos.svg',
    website: 'https://www.xpi.com.br/',
  },
  {
    name: 'Santander',
    logo: '/parceiros/Santander.svg',
    website: 'https://www.santander.com.br/',
  },
  // Row 3
  {
    name: 'Doare',
    logo: '/parceiros/Doare.svg',
    website: 'https://doare.org/',
  },
  {
    name: 'Hootsuite',
    logo: '/parceiros/Hootsuite.svg',
    website: 'https://hootsuite.com',
  },
  {
    name: 'Google',
    logo: '/parceiros/Google.svg',
    website: 'https://google.com',
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
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-lg bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600"
                  >
                    <img
                      alt={`Logo ${partner.name}`}
                      src={partner.logo}
                      className="aspect-square w-full rounded-lg object-cover outline -outline-offset-1 outline-black/5 group-hover:opacity-75 transition-opacity"
                    />
                  </a>
                ) : (
                  <div className="group overflow-hidden rounded-lg bg-white">
                    <img
                      alt={`Logo ${partner.name}`}
                      src={partner.logo}
                      className="aspect-square w-full rounded-lg object-cover outline -outline-offset-1 outline-black/5"
                    />
                  </div>
                )}
                <p className="mt-2 block truncate text-sm font-medium text-gray-900">
                  {partner.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}