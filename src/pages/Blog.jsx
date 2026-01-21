import { Link } from 'react-router-dom'

const posts = [
  {
    slug: 'bem-vindo-novo-diretor-executivo',
    title: 'Bem-vindo ao nosso novo Diretor Executivo',
    description: 'Temos o prazer de anunciar que João Silva está se juntando ao Fundo Patronos como nosso novo Diretor Executivo.',
    date: '15 de Janeiro, 2026',
    author: {
      name: 'Equipe Patronos',
      image: '/Logo Patronos Simbolo Transparente - SVG .svg',
    },
    category: 'Equipe',
  },
  {
    slug: 'resultados-edital-extras-2025',
    title: 'Resultados do Edital Decola Extras 2025',
    description: 'Confira os projetos selecionados no Edital Decola Extras 2025 e conheça as iniciativas que receberão apoio do Fundo Patronos.',
    date: '10 de Janeiro, 2026',
    author: {
      name: 'Equipe Patronos',
      image: '/Logo Patronos Simbolo Transparente - SVG .svg',
    },
    category: 'Editais',
  },
  {
    slug: 'impacto-centro-carreiras-2025',
    title: 'O Impacto do Centro de Carreiras em 2025',
    description: 'Um ano de conexões, mentorias e oportunidades para estudantes da Unicamp através da nossa plataforma digital.',
    date: '5 de Janeiro, 2026',
    author: {
      name: 'Equipe Patronos',
      image: '/Logo Patronos Simbolo Transparente - SVG .svg',
    },
    category: 'Impacto',
  },
]

export default function Blog() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Blog
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Novidades, histórias de impacto e atualizações do Fundo Patronos.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col items-start">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">{post.date}</time>
                <span
                  className="relative z-10 rounded-full px-3 py-1.5 font-medium text-white"
                  style={{
                    background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
                  }}
                >
                  {post.category}
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link to={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{post.description}</p>
              </div>
              <div className="relative mt-6 flex items-center gap-x-4">
                <img
                  alt={post.author.name}
                  src={post.author.image}
                  className="size-10 rounded-full bg-gray-100 p-1"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{post.author.name}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
