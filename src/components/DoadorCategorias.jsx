import { useState, useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'

const BRAND_GRADIENT = 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

// "a partir de R$ 5 mil" / "R$ 300 mil" — como no Relatório Anual
const formatMil = (value) =>
  value >= 1000 && value % 1000 === 0
    ? `R$ ${(value / 1000).toLocaleString('pt-BR')} mil`
    : formatCurrency(value)

export default function DoadorCategorias({ data }) {
  const [categorias, setCategorias] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fetch failed'))))
      .then((json) => setCategorias(json.categorias))
      .catch((err) => {
        console.error('Erro ao carregar categorias:', err)
        setCategorias([]) // falha silenciosa: a seção some, o resto da página vive
      })
  }, [])

  if (!categorias || categorias.length === 0) return null

  const valorTotal = data.valorTotal || 0
  // Tier atual = o mais alto cujo mínimo já foi atingido (espelha o backend)
  const currentIdx = categorias.reduce(
    (acc, c, i) => (valorTotal >= c.minValor ? i : acc), -1
  )
  const current = currentIdx >= 0 ? categorias[currentIdx] : null
  const next = currentIdx < categorias.length - 1 ? categorias[currentIdx + 1] : null

  // Progresso do piso atual (ou R$ 0) até o próximo tier
  const base = current ? current.minValor : 0
  const progressPct = next
    ? Math.min(100, Math.max(0, ((valorTotal - base) / (next.minValor - base)) * 100))
    : 100

  return (
    <div className="mt-10">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Categorias de Doação</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Reconhecemos cada doador pelo total acumulado de contribuições ao Fundo.
        </p>
      </div>

      {/* Progresso até a próxima categoria */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm ring-1 ring-gray-900/5">
        {next ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-gray-700">
                {current ? (
                  <>Sua categoria atual é <span className="font-semibold">{current.nome}</span>.</>
                ) : (
                  <>Você está a caminho da sua primeira categoria.</>
                )}{' '}
                Faltam <span className="font-semibold">{formatCurrency(next.minValor - valorTotal)}</span> para
                se tornar <span className="font-semibold">{next.nome}</span>.
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(valorTotal)} de {formatMil(next.minValor)}
              </p>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: BRAND_GRADIENT }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-700">
            Você alcançou <span className="font-semibold">{current.nome}</span>, a categoria máxima de
            reconhecimento. Nossa mais profunda gratidão. 💛
          </p>
        )}
      </div>

      {/* Escada de categorias */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => {
          const isCurrent = current?.nome === cat.nome
          const achieved = valorTotal >= cat.minValor
          return (
            <div
              key={cat.nome}
              className="relative rounded-xl bg-white p-5 shadow-sm"
              style={
                isCurrent
                  ? {
                      background: 'linear-gradient(white, white) padding-box, ' + BRAND_GRADIENT + ' border-box',
                      border: '2px solid transparent',
                    }
                  : { border: '1px solid rgb(229 231 235)' }
              }
            >
              {isCurrent && (
                <span
                  className="absolute -top-3 right-4 rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Sua categoria
                </span>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-gray-900">{cat.nome}</h4>
                {achieved && !isCurrent && <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />}
              </div>
              <p className="mt-0.5 text-xs font-medium text-gray-500">a partir de {formatMil(cat.minValor)}</p>
              <ul className="mt-3 space-y-1.5">
                {cat.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-x-2 text-xs leading-5 text-gray-600">
                    <CheckIcon
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: achieved ? '#ff6253' : '#d1d5db' }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
