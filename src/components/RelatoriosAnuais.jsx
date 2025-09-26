const posts = [
  {
    id: 1,
    title: 'Relatório Anual 2021',
    href: '/Relatorios%20Anuais/Fundo%20Patronos%20-%20Relat%C3%B3trio%20Anual%202021.pdf',
    date: 'Abril 2022',
    datetime: '2022-04',
    category: { title: 'Relatório', href: '#' },
    imageUrl: '/Relatorios%20Anuais/Cover%20-%20Fundo%20Patronos%20-%20Relatorio%20Anual%202021.png',
  },
  {
    id: 2,
    title: 'Relatório Anual 2022',
    href: '/Relatorios%20Anuais/Fundo%20Patronos%20-%20Relat%C3%B3trio%20Anual%202022.pdf',
    date: 'Abril 2023',
    datetime: '2023-04',
    category: { title: 'Relatório', href: '#' },
    imageUrl: '/Relatorios%20Anuais/Cover%20-%20Fundo%20Patronos%20-%20Relatorio%20Anual%202022.png',
  },
  {
    id: 3,
    title: 'Relatório Anual 2023',
    href: '/Relatorios%20Anuais/Fundo%20Patronos%20-%20Relat%C3%B3trio%20Anual%202023.pdf',
    date: 'Abril 2024',
    datetime: '2024-04',
    category: { title: 'Relatório', href: '#' },
    imageUrl: '/Relatorios%20Anuais/Cover%20-%20Fundo%20Patronos%20-%20Relatorio%20Anual%202023.png',
  },
  {
    id: 4,
    title: 'Relatório Anual 2024',
    href: '/Relatorios%20Anuais/Fundo%20Patronos%20-%20Relatorio%20Anual%202024.pdf',
    date: 'Abril 2025',
    datetime: '2025-04',
    category: { title: 'Relatório', href: '#' },
    imageUrl: '/Relatorios%20Anuais/Cover%20-%20Fundo%20Patronos%20-%20Relatorio%20Anual%202024.jpeg',
  },
]

export default function RelatoriosAnuais() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Relatórios Anuais</h2>
          <p className="mt-2 text-lg/8 text-gray-600">Acompanhe o que realizamos nos últimos anos. <br />Relatórios Anuais são divulgados em maio do ano seguinte.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
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
                    {post.title}
                  </h3>
                  <div className="mt-4">
                    <a
                      href={post.href}
                      className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
                      style={{ 
                        background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
                        focusVisibleOutlineColor: '#ff9700'
                      }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}