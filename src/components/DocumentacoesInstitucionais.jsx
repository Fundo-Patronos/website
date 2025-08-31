const posts = [
  {
    id: 1,
    title: 'Estatuto Social',
    href: '/Docs%20Institucionais/Estatuto%20Social%20-%20Fundo%20Patronos%202020.pdf',
    description: 'Documento que estabelece a estrutura organizacional, objetivos e direitos do Fundo Patrimonial Patronos, definindo as bases de sua governança.',
    imageUrl: '/Illustrative%20Pictures/Docs%20Institucionais/di-1.jpg',
    date: '2020',
    datetime: '2020',
    category: { title: 'Governança', href: '#' },
  },
  {
    id: 2,
    title: 'Demonstrações Financeiras',
    href: '/Docs%20Institucionais/Fundo%20Patronos%20-%20Demonstrativo%20Financeiro.pdf',
    description: 'Relatórios financeiros auditados que apresentam de forma transparente a situação patrimonial, resultado das operações e fluxo de caixa do fundo.',
    imageUrl: '/Illustrative%20Pictures/Docs%20Institucionais/di-2.jpg',
    date: '2024',
    datetime: '2024',
    category: { title: 'Financeiro', href: '#' },
  },
  {
    id: 3,
    title: 'Código de Conduta',
    href: '/Docs%20Institucionais/Fundo%20Patronos%20-%20Codigo%20de%20Conduta%202024.pdf',
    description: 'Diretrizes éticas que orientam o comportamento de todos os colaboradores, conselheiros e parceiros do fundo, garantindo integridade e transparência em todas as ações.',
    imageUrl: '/Illustrative%20Pictures/Docs%20Institucionais/di-3.jpg',
    date: '2024',
    datetime: '2024',
    category: { title: 'Ética', href: '#' },
  },
]

export default function DocumentacoesInstitucionais() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Documentos Institucionais
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <img
                  alt=""
                  src={post.imageUrl}
                  className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="flex max-w-xl grow flex-col justify-between">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative grow">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}