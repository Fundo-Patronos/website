import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const parts = dateString.split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  return dateString
}

const getCategoryBadge = (category) => {
  switch (category?.toLowerCase()) {
    case 'patrono':
      return (
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
        >
          Patrono
        </span>
      )
    case 'associado':
      return (
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
          style={{
            background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2) border-box',
            border: '2px solid transparent',
            color: '#ff6253',
          }}
        >
          Associado
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
          Amigo
        </span>
      )
  }
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
        <h3 className="text-base font-semibold leading-6 text-gray-900">Informacoes do Doador</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detalhes da sua conta e contribuicoes.</p>
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
            <dt className="text-sm font-medium leading-6 text-gray-900">Tipo de contribuicao</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                {data.tipoContribuicao || 'Pontual'}
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Primeira doacao</dt>
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
