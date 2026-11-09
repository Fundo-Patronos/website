import { useState, useEffect } from 'react'
import ImpactoHero from '../components/ImpactoHero'

const BRAND_GRADIENT = 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'
const DONATE_URL = 'https://doa.re/patronos'

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

// Estilo do selo por categoria (mesmas regras do portal do doador / admin)
function CategoriaBadge({ categoria }) {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap'
  if (['Patrono', 'Patrono Associado', 'Patrono Benemérito'].includes(categoria)) {
    return (
      <span className={`${base} text-white`} style={{ background: BRAND_GRADIENT }}>
        {categoria}
      </span>
    )
  }
  if (['Aliado', 'Protetor'].includes(categoria)) {
    return (
      <span
        className={base}
        style={{
          background: 'linear-gradient(white, white) padding-box, ' + BRAND_GRADIENT + ' border-box',
          border: '1.5px solid transparent',
        }}
      >
        <span
          style={{
            background: BRAND_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {categoria}
        </span>
      </span>
    )
  }
  return <span className={`${base} bg-gray-100 text-gray-700`}>{categoria}</span>
}

function DoadorCard({ doador, destaque }) {
  return (
    <li
      className={`relative flex items-center gap-x-4 rounded-xl bg-white shadow-sm ${
        destaque ? 'p-6 sm:p-8' : 'p-4 sm:p-5 ring-1 ring-gray-900/5'
      }`}
      style={
        destaque
          ? {
              background: 'linear-gradient(white, white) padding-box, ' + BRAND_GRADIENT + ' border-box',
              border: '2px solid transparent',
            }
          : undefined
      }
    >
      {destaque && (
        <span
          className="absolute -top-3 left-4 rounded-full px-3 py-0.5 text-xs font-semibold text-white"
          style={{ background: BRAND_GRADIENT }}
        >
          Maior doador
        </span>
      )}
      <span
        className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
          destaque ? 'h-14 w-14 text-xl text-white' : 'h-10 w-10 text-sm bg-gray-100 text-gray-700'
        }`}
        style={destaque ? { background: BRAND_GRADIENT } : undefined}
      >
        #{doador.posicao}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold text-gray-900 ${destaque ? 'text-xl sm:text-2xl' : 'text-base'}`}
        >
          {doador.nome}
        </p>
        {typeof doador.valorTotal === 'number' && (
          <p className="mt-0.5 text-sm text-gray-500">{formatCurrency(doador.valorTotal)}</p>
        )}
      </div>
      <CategoriaBadge categoria={doador.categoria} />
    </li>
  )
}

function ListaDoadores() {
  const [doadores, setDoadores] = useState(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    fetch('/api/hall-dos-doadores')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fetch failed'))))
      .then((json) => setDoadores(json.doadores || []))
      .catch((err) => {
        console.error('Erro ao carregar o Hall dos Doadores:', err)
        setErro(true)
      })
  }, [])

  let content
  if (erro) {
    content = (
      <p className="text-center text-base leading-7 text-gray-500">
        Não foi possível carregar a lista de doadores agora. Tente novamente em alguns instantes.
      </p>
    )
  } else if (!doadores) {
    content = <p className="text-center text-base leading-7 text-gray-500">Carregando…</p>
  } else if (doadores.length === 0) {
    content = (
      <p className="text-center text-base leading-7 text-gray-500">
        Ainda não há doadores no Hall. Seja o primeiro a fazer parte dessa história!
      </p>
    )
  } else {
    content = (
      <ol className="space-y-4">
        {doadores.map((d, i) => (
          <DoadorCard key={`${d.posicao}-${d.nome}-${i}`} doador={d} destaque={i === 0} />
        ))}
      </ol>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:px-8">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Nossos maiores doadores
        </h2>
        <p className="mx-auto mt-4 mb-10 max-w-xl text-center text-lg leading-8 text-gray-600">
          Doadores que já contribuíram com R$ 5 mil ou mais, ordenados pelo total acumulado de doações.
        </p>
        {content}
      </div>
    </div>
  )
}

function HallCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Faça parte do Hall dos Doadores.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Cada doação fortalece o futuro de estudantes da Unicamp. Doe ao Fundo Patronos e ajude a transformar a educação superior no Brasil.
        </p>
        <div className="mt-10">
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: BRAND_GRADIENT, focusVisibleOutlineColor: '#ff9700' }}
          >
            Seja um doador
          </a>
        </div>
      </div>
    </div>
  )
}

function HallDosDoadores() {
  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Gratidão a quem acredita na Unicamp"
        title="Hall dos Doadores"
        description="Agradecemos a cada pessoa e organização que apoia o Fundo Patronos. Conheça quem mais contribui para transformar a vida de estudantes da Unicamp."
        primaryButtonText="Seja um doador"
        primaryButtonLink={DONATE_URL}
      />
      <ListaDoadores />
      <HallCTA />
    </div>
  )
}

export default HallDosDoadores
