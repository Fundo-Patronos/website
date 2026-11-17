import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import DoacaoCTA from '../components/DoacaoCTA'
import { colors } from '../lib/theme'
import { rebrand, rebrandTitle, rebrandUrl, rebrandStructuredData } from '../lib/rebrand'

const meanings = [
  {
    title: 'A árvore',
    image: '/marca/arvore.svg',
    meaning: 'Crescimento e perpetuidade',
    description: 'A árvore traduz a ideia de crescer ao longo do tempo e gerar oportunidades para as próximas gerações. É a essência de um fundo patrimonial.',
  },
  {
    title: 'Três frutos',
    image: '/marca/frutos.svg',
    meaning: 'Exatas, Humanidades e Artes, e Biológicas',
    description: 'Os três frutos representam as diferentes áreas do conhecimento. Uma comunidade diversa, conectada pela educação e pelo potencial de transformar o mundo.',
  },
  {
    title: 'Raízes',
    image: '/marca/raizes.svg',
    meaning: 'Solidez e inovação',
    description: 'A base representa os valores que sustentam nossa atuação: solidez para construir um legado e inovação para abrir novos caminhos.',
  },
]

export default function NossaMarca() {
  // Keep metadata accurate on client-side navigation as well as direct visits.
  useEffect(() => {
    const previousTitle = document.querySelector('title')?.dataset.siteDefault || document.title
    document.title = rebrandTitle
    const updates = [
      ['meta[name="description"]', 'content', rebrand.description],
      ['meta[name="robots"]', 'content', 'noindex, nofollow'],
      ['link[rel="canonical"]', 'href', rebrandUrl],
      ['meta[property="og:title"]', 'content', rebrandTitle],
      ['meta[property="og:description"]', 'content', rebrand.description],
      ['meta[property="og:url"]', 'content', rebrandUrl],
      ['meta[property="og:type"]', 'content', 'article'],
      ['meta[property="og:image"]', 'content', `https://www.patronos.org${rebrand.poster}`],
      ['meta[property="og:image:alt"]', 'content', 'Nova identidade visual do Fundo Patronos'],
      ['meta[name="twitter:title"]', 'content', rebrandTitle],
      ['meta[name="twitter:description"]', 'content', rebrand.description],
      ['meta[name="twitter:url"]', 'content', rebrandUrl],
      ['meta[name="twitter:image"]', 'content', `https://www.patronos.org${rebrand.poster}`],
    ]
    const restore = updates.map(([selector, attribute, value]) => {
      const element = document.head.querySelector(selector)
      const previous = element?.dataset.siteDefault || element?.getAttribute(attribute)
      element?.setAttribute(attribute, value)
      return () => {
        if (!element) return
        if (previous === null) element.removeAttribute(attribute)
        else element.setAttribute(attribute, previous)
      }
    })
    let structuredData = document.getElementById('brand-article-data')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'brand-article-data'
      structuredData.type = 'application/ld+json'
      structuredData.textContent = JSON.stringify(rebrandStructuredData)
      document.head.appendChild(structuredData)
    }
    window.scrollTo(0, 0)
    return () => {
      document.title = previousTitle
      restore.forEach(reset => reset())
      structuredData.remove()
    }
  }, [])

  return (
    <article className="bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:pb-16 lg:px-8">
        <Link to="/sobre-nos/fundo" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400">
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Conheça o Fundo Patronos
        </Link>
        <div className="mx-auto mt-12 max-w-4xl text-center sm:mt-16">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: colors.primary }}>Nossa nova identidade</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
            Nossa marca evolui.<br />
            <span className="text-gray-500">Nossa essência permanece.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600">
            Uma nova forma de apresentar o que sempre nos moveu: criar oportunidades para estudantes da Unicamp, hoje e para as próximas gerações.
          </p>
          <p className="mt-6 text-sm leading-6 text-gray-500">
            Equipe Patronos <span aria-hidden="true">·</span> <time dateTime="2026-11-17">{rebrand.date}</time>
          </p>
        </div>
      </header>

      <section aria-label="Vídeo da nova identidade" className="mx-auto max-w-6xl px-6 lg:px-8">
        <figure>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/10">
            <video
              controls
              playsInline
              preload="metadata"
              poster={rebrand.poster}
              width="1920"
              height="1080"
              aria-label="Nossa marca evolui: apresentação da nova identidade do Fundo Patronos"
              aria-describedby="brand-video-caption"
              className="aspect-video w-full focus-visible:outline-2 focus-visible:outline-orange-400"
            >
              <source src={rebrand.video} type="video/mp4" />
              <track kind="descriptions" src="/marca/nova-marca-descricao.vtt" srcLang="pt-BR" label="Descrição em português" />
              Seu navegador não reproduz este vídeo. <a href={rebrand.video}>Baixe o vídeo da nova marca.</a>
            </video>
          </div>
          <figcaption id="brand-video-caption" className="mt-4 flex flex-wrap justify-between gap-2 text-sm leading-6 text-gray-500">
            <span>A evolução da nossa marca em 30 segundos. Vídeo sem áudio.</span>
            <a href={rebrand.video} download className="font-semibold text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-red-700">Baixar vídeo</a>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="new-brand-title" className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 id="new-brand-title" className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Mais clareza. A mesma história.</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Nossa assinatura visual passa a destacar <strong className="font-semibold text-gray-900">Fundo Patronos</strong>. O nome ganha uma composição mais simples, com mais presença para Patronos e uma relação mais equilibrada com o símbolo.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            A árvore permanece intacta. Saem a divisória e a assinatura extensa em três linhas; entram uma nova tipografia e mais espaço entre os elementos. A mudança torna a marca mais clara em diferentes tamanhos, do celular aos materiais institucionais.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            { label: 'Antes', src: '/marca/logo-anterior.svg', alt: 'Logotipo anterior: Associação Fundo Patrimonial Patronos, com árvore e divisória' },
            { label: 'Agora', src: '/Logo-Patronos-Completo.svg', alt: 'Novo logotipo: Fundo Patronos, com a mesma árvore e sem divisória' },
          ].map(logo => (
            <figure key={logo.label} className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-900/5 sm:p-8">
              <figcaption className="text-sm font-semibold text-gray-500">{logo.label}</figcaption>
              <div className="flex h-44 items-center justify-center sm:h-52">
                <img src={logo.src} alt={logo.alt} loading="lazy" className="max-h-36 w-full object-contain" />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="symbol-title" className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold" style={{ color: colors.primary }}>O que permanece</p>
            <h2 id="symbol-title" className="mt-3 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Um símbolo que conta quem somos.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">Cada parte da nossa árvore carrega um significado. Preservar esse símbolo é manter viva a história que estamos construindo juntos.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {meanings.map(item => (
              <section key={item.title} className="rounded-2xl bg-white p-7 ring-1 ring-gray-900/5 sm:p-8">
                <img src={item.image} alt="" loading="lazy" width="924" height="1097" className="mx-auto h-48 w-auto" />
                <h3 className="mt-8 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 min-h-12 text-base font-medium leading-6" style={{ color: colors.primary }}>{item.meaning}</p>
                <p className="mt-4 text-base leading-7 text-gray-600">{item.description}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="purpose-title" className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:px-8">
        <h2 id="purpose-title" className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">O compromisso continua.</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A identidade visual evolui, mas nosso propósito permanece: desenvolver os líderes que farão a diferença no mundo. Seguimos conectando doadores, voluntários e parceiros para apoiar estudantes da Unicamp e construir oportunidades duradouras.
        </p>
        <p className="mt-4 text-lg leading-8 text-gray-600">É essa continuidade que a nova marca expressa. Um fundo voltado para o futuro, com raízes na comunidade que o torna possível.</p>
        <Link to="/sobre-nos/nossa-missao" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400">
          Conheça nossa missão <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </section>
      <div className="border-t border-gray-100"><DoacaoCTA eventLabel="nova_marca_cta" /></div>
    </article>
  )
}
