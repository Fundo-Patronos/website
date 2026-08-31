import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid'

const BRAND_GRADIENT = 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  // API entrega ISO (YYYY-MM-DD); aceita também DD/MM/YYYY por resiliência
  let date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-')
    date = new Date(year, month - 1, day)
  } else if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/')
    date = new Date(year, month - 1, day)
  }
  if (!date || isNaN(date)) return dateString
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Escala visual das 6 categorias oficiais:
// Patrono e acima = gradiente cheio · Aliado/Protetor = borda gradiente · Amigo = cinza
const GRADIENT_TIERS = ['patrono', 'patrono associado', 'patrono benemérito']
const OUTLINE_TIERS = ['aliado', 'protetor']

const getCategoryBadge = (category) => {
  if (!category) {
    return <span className="text-sm text-gray-400">—</span>
  }
  const key = category.toLowerCase()
  if (GRADIENT_TIERS.includes(key)) {
    return (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white"
        style={{ background: BRAND_GRADIENT }}
      >
        {category}
      </span>
    )
  }
  if (OUTLINE_TIERS.includes(key)) {
    return (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
        style={{
          background: 'linear-gradient(white, white) padding-box, ' + BRAND_GRADIENT + ' border-box',
          border: '2px solid transparent',
          color: '#ff6253',
        }}
      >
        {category}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
      {category}
    </span>
  )
}

const getStatusBadge = (status) => {
  const normalizedStatus = status?.toLowerCase().trim()

  switch (normalizedStatus) {
    case 'ativa':
      return (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-700">
          <CheckCircleIcon className="h-4 w-4" />
          Ativa
        </span>
      )
    case 'cancelada':
      return (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-2.5 py-1 text-sm font-medium text-red-700">
          <XCircleIcon className="h-4 w-4" />
          Cancelada
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600">
          <MinusCircleIcon className="h-4 w-4" />
          N/A
        </span>
      )
  }
}

export default function DoadorInfo({ data }) {
  const isRecurring = data.tipoContribuicao?.toLowerCase().includes('recorrente')

  return (
    <div className="mt-10">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Informações do Doador</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detalhes da sua conta e contribuições.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Nome completo</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.nome || '-'}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.email || '-'}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Categoria</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {getCategoryBadge(data.categoria)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Tipo de contribuição</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                {data.tipoContribuicao || 'Pontual'}
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Primeira doação</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(data.dataPrimeiraDoacao)}
            </dd>
          </div>
          {isRecurring && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Status da assinatura</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-3">
                  {getStatusBadge(data.estadoAssinatura)}
                  {data.estadoAssinatura?.toLowerCase() === 'cancelada' && (
                    <a
                      href="mailto:contato@patronos.org?subject=Reativar%20Assinatura"
                      className="text-sm font-semibold text-red-700 hover:text-red-600 transition-colors"
                    >
                      Reativar assinatura
                    </a>
                  )}
                </div>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
