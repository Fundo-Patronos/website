const posts = [
  {
    id: 1,
    title: 'Trilha de Carreiras',
    href: '#',
    description:
      'Programa estruturado de desenvolvimento profissional que orienta estudantes e recém-formados da Unicamp através de todas as etapas de construção de carreira, desde a descoberta vocacional até a colocação no mercado.',
    imageUrl: 'https://picsum.photos/800/600?random=20',
    date: 'Programa contínuo',
    datetime: '2024',
    author: {
      name: 'Equipe Patronos',
      imageUrl: 'https://picsum.photos/64/64?random=21',
    },
  },
  {
    id: 2,
    title: 'Centro de Carreiras',
    href: '#',
    description: 'Plataforma digital que conecta talentos da Unicamp com oportunidades exclusivas em empresas parceiras, oferecendo recursos de networking, mentoria e desenvolvimento profissional.',
    imageUrl: 'https://picsum.photos/800/600?random=22',
    date: 'Sempre disponível',
    datetime: '2024',
    author: {
      name: 'Equipe Patronos',
      imageUrl: 'https://picsum.photos/64/64?random=23',
    },
  },
]

export default function CarreiraGrid() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Nossos Programas de Carreira
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Conectamos talentos da Unicamp com oportunidades excepcionais no mercado de trabalho.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80"
            >
              <img alt="" src={post.imageUrl} className="absolute inset-0 -z-10 size-full object-cover" />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl inset-ring inset-ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img alt="" src={post.author.imageUrl} className="size-6 flex-none rounded-full bg-white/10" />
                    {post.author.name}
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg/6 font-semibold text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
              <p className="mt-2 text-sm/6 text-gray-300">{post.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}