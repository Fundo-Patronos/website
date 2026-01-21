import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

// Sample blog posts data - in production this would come from a CMS or API
const blogPosts = {
  'bem-vindo-novo-diretor-executivo': {
    title: 'Bem-vindo ao nosso novo Diretor Executivo',
    subtitle: 'Temos o prazer de anunciar que João Silva está se juntando ao Fundo Patronos.',
    date: '15 de Janeiro, 2026',
    readTime: '5 min de leitura',
    authors: [
      {
        name: 'Equipe Patronos',
        role: 'Fundo Patronos',
        image: '/Logo Patronos Simbolo Transparente - SVG .svg',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'É com grande entusiasmo que anunciamos a chegada de João Silva como nosso novo Diretor Executivo. João traz consigo mais de 15 anos de experiência em gestão de fundos patrimoniais e uma paixão genuína pela educação superior brasileira.',
      },
      {
        type: 'paragraph',
        text: 'Formado pela Unicamp em Engenharia de Computação, João construiu uma carreira brilhante no setor financeiro antes de dedicar os últimos anos ao terceiro setor. Sua experiência combinada em finanças e impacto social o torna o candidato ideal para liderar o Fundo Patronos em sua próxima fase de crescimento.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60',
        alt: 'Placeholder - Novo Diretor Executivo',
        caption: 'João Silva, novo Diretor Executivo do Fundo Patronos',
      },
      {
        type: 'heading',
        text: 'Uma conversa com João',
      },
      {
        type: 'question',
        text: 'O que te motivou a se juntar ao Fundo Patronos?',
      },
      {
        type: 'paragraph',
        text: 'A Unicamp foi transformadora na minha vida. Tudo que conquistei profissionalmente tem raízes na formação que recebi aqui. Quando surgiu a oportunidade de contribuir para que outros estudantes tenham as mesmas oportunidades, não hesitei.',
      },
      {
        type: 'question',
        text: 'Quais são suas prioridades para os próximos anos?',
      },
      {
        type: 'paragraph',
        text: 'Minha prioridade é expandir o alcance dos nossos programas. O Centro de Carreiras já conecta centenas de estudantes com mentores, mas quero que esse número chegue a milhares. Também pretendo fortalecer nossas parcerias com empresas e aumentar significativamente nosso patrimônio.',
      },
      {
        type: 'question',
        text: 'Qual mensagem você deixa para a comunidade Unicamp?',
      },
      {
        type: 'paragraph',
        text: 'O Fundo Patronos é de todos nós. Cada doação, cada hora de mentoria, cada conexão feita através das nossas plataformas fortalece esse ecossistema. Juntos, estamos construindo um legado que vai beneficiar gerações de estudantes.',
      },
      {
        type: 'heading',
        text: 'Sobre João Silva',
      },
      {
        type: 'paragraph',
        text: 'João é formado em Engenharia de Computação pela Unicamp (turma de 2005) e possui MBA pela Stanford Graduate School of Business. Antes de se juntar ao Fundo Patronos, atuou como diretor em grandes instituições financeiras e foi conselheiro de diversas organizações do terceiro setor.',
      },
      {
        type: 'paragraph',
        text: 'Nas horas vagas, João é um entusiasta de corrida e já completou três maratonas. Ele também é mentor voluntário no Centro de Carreiras desde 2022.',
      },
    ],
  },
  'resultados-edital-extras-2025': {
    title: 'Resultados do Edital Decola Extras 2025',
    subtitle: 'Confira os projetos selecionados e conheça as iniciativas que receberão apoio.',
    date: '10 de Janeiro, 2026',
    readTime: '4 min de leitura',
    authors: [
      {
        name: 'Equipe Patronos',
        role: 'Fundo Patronos',
        image: '/Logo Patronos Simbolo Transparente - SVG .svg',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'O Edital Decola Extras 2025 recebeu um número recorde de inscrições este ano. Foram mais de 50 projetos de toda a comunidade Unicamp competindo pelas vagas do programa.',
      },
      {
        type: 'paragraph',
        text: 'Após um rigoroso processo de avaliação conduzido por nosso comitê de seleção, temos o prazer de anunciar os 10 projetos selecionados que receberão apoio financeiro e mentoria ao longo de 2026.',
      },
      {
        type: 'heading',
        text: 'Projetos Selecionados',
      },
      {
        type: 'paragraph',
        text: 'Os projetos selecionados representam a diversidade e a excelência da comunidade Unicamp, abrangendo áreas como tecnologia, sustentabilidade, saúde e empreendedorismo social.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
        alt: 'Equipes de projetos',
        caption: 'Representantes dos projetos selecionados no Edital Decola Extras 2025',
      },
      {
        type: 'paragraph',
        text: 'Cada projeto receberá até R$ 5.000 em apoio financeiro, além de acesso a mentorias especializadas e à rede de parceiros do Fundo Patronos.',
      },
      {
        type: 'heading',
        text: 'Próximos Passos',
      },
      {
        type: 'paragraph',
        text: 'Os representantes dos projetos selecionados serão contatados em breve para a assinatura dos termos de compromisso e início das atividades do programa.',
      },
    ],
  },
  'impacto-centro-carreiras-2025': {
    title: 'O Impacto do Centro de Carreiras em 2025',
    subtitle: 'Um ano de conexões, mentorias e oportunidades para estudantes da Unicamp.',
    date: '5 de Janeiro, 2026',
    readTime: '6 min de leitura',
    authors: [
      {
        name: 'Equipe Patronos',
        role: 'Fundo Patronos',
        image: '/Logo Patronos Simbolo Transparente - SVG .svg',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: '2025 foi um ano transformador para o Centro de Carreiras. Nossa plataforma digital conectou milhares de estudantes com mentores de diversas áreas, proporcionando orientação profissional de alta qualidade de forma totalmente gratuita.',
      },
      {
        type: 'heading',
        text: 'Números do Ano',
      },
      {
        type: 'paragraph',
        text: 'Ao longo de 2025, registramos mais de 2.500 sessões de mentoria realizadas, com uma taxa de satisfação de 98% entre os participantes. Nossa base de mentores cresceu 40%, alcançando profissionais em mais de 15 países.',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
        alt: 'Sessão de mentoria',
        caption: 'Estudantes e mentores conectados através do Centro de Carreiras',
      },
      {
        type: 'heading',
        text: 'Histórias de Sucesso',
      },
      {
        type: 'paragraph',
        text: 'Entre as muitas histórias inspiradoras do ano, destacamos estudantes que conseguiram estágios em empresas de tecnologia de ponta, outros que foram aceitos em programas de pós-graduação no exterior, e empreendedores que validaram suas ideias de negócio com mentores experientes.',
      },
      {
        type: 'question',
        text: 'O que esperar de 2026?',
      },
      {
        type: 'paragraph',
        text: 'Para 2026, planejamos expandir ainda mais nossa rede de mentores, lançar novas funcionalidades na plataforma e criar programas específicos para áreas de alta demanda como inteligência artificial, sustentabilidade e empreendedorismo.',
      },
    ],
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Post não encontrado</h1>
          <p className="mt-4 text-gray-600">O artigo que você procura não existe ou foi removido.</p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: '#ff9700' }}
          >
            <ArrowLeftIcon className="size-4" />
            Voltar para o Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-white">
      {/* Back link */}
      <div className="mx-auto max-w-3xl px-6 pt-8 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="size-4" />
          Voltar para o Blog
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-3xl px-6 pt-12 pb-8 lg:px-8">
        {/* Date */}
        <p className="text-center text-sm text-gray-500">{post.date}</p>

        {/* Title with gradient */}
        <h1
          className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{
            background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-center text-lg text-gray-600">{post.subtitle}</p>

        {/* Authors */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4">
            {post.authors.map((author, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={author.image}
                  alt={author.name}
                  className="size-12 rounded-full bg-gray-100 p-1"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{author.name}</p>
                  <p className="text-sm text-gray-500">{author.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read time */}
        <p className="mt-6 text-center text-sm text-gray-400">{post.readTime}</p>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
        <div className="prose prose-lg prose-gray max-w-none">
          {post.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={index} className="mt-6 text-gray-700 leading-8">
                    {block.text}
                  </p>
                )
              case 'heading':
                return (
                  <h2
                    key={index}
                    className="mt-12 text-2xl font-semibold text-gray-900"
                  >
                    {block.text}
                  </h2>
                )
              case 'question':
                return (
                  <p key={index} className="mt-8 font-semibold text-gray-900">
                    {block.text}
                  </p>
                )
              case 'image':
                return (
                  <figure key={index} className="mt-10">
                    <img
                      src={block.src}
                      alt={block.alt}
                      className="w-full rounded-xl"
                    />
                    {block.caption && (
                      <figcaption className="mt-3 text-center text-sm text-gray-500">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              default:
                return null
            }
          })}
        </div>

        {/* Share section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <p className="text-sm font-semibold text-gray-900">Compartilhe este artigo</p>
          <div className="mt-4 flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Twitter</span>
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Related posts CTA */}
        <div className="mt-16 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(255, 151, 0, 0.1), rgba(255, 98, 83, 0.1), rgba(252, 70, 150, 0.1), rgba(201, 100, 226, 0.1))' }}>
          <h3 className="text-lg font-semibold text-gray-900">Continue lendo</h3>
          <p className="mt-2 text-gray-600">
            Explore mais histórias de impacto e novidades do Fundo Patronos.
          </p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: '#ff9700' }}
          >
            Ver todos os artigos
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
