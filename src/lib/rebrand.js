export const rebrand = {
  slug: 'nossa-marca-evolui',
  path: '/sobre-nos/nossa-marca',
  title: 'Nossa marca evolui. Nossa essência permanece.',
  description: 'Conheça a nova identidade visual do Fundo Patronos, o fundo patrimonial da Unicamp. Um nome em destaque, a mesma árvore e o compromisso com as próximas gerações.',
  date: '17 de novembro de 2026',
  publishedAt: '2026-11-17T12:00:00-03:00',
  category: 'Institucional',
  author: { name: 'Equipe Patronos', image: '/marca/arvore.svg' },
  video: '/marca/patronos-nova-marca.mp4',
  poster: '/marca/nova-marca-poster.png',
}

export const rebrandUrl = `https://www.patronos.org${rebrand.path}`
export const rebrandTitle = `${rebrand.title} | Fundo Patronos`

export const rebrandStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: rebrand.title,
  description: rebrand.description,
  datePublished: rebrand.publishedAt,
  dateModified: rebrand.publishedAt,
  inLanguage: 'pt-BR',
  mainEntityOfPage: rebrandUrl,
  image: `https://www.patronos.org${rebrand.poster}`,
  author: { '@type': 'Organization', name: 'Fundo Patronos', url: 'https://www.patronos.org' },
  publisher: { '@id': 'https://www.patronos.org/#organization' },
  video: {
    '@type': 'VideoObject',
    name: rebrand.title,
    description: 'A evolução do logotipo do Fundo Patronos e os significados da árvore, dos três frutos e das raízes.',
    thumbnailUrl: `https://www.patronos.org${rebrand.poster}`,
    contentUrl: `https://www.patronos.org${rebrand.video}`,
    uploadDate: rebrand.publishedAt,
    duration: 'PT30S',
    inLanguage: 'pt-BR',
  },
}
