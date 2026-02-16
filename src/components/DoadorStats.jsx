import { CurrencyDollarIcon, TagIcon, CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  // Handle DD/MM/YYYY format
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

const getCategoryStyles = (category) => {
  switch (category?.toLowerCase()) {
    case 'patrono':
      return {
        badge: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white',
        icon: 'text-orange-500',
      }
    case 'associado':
      return {
        badge: 'bg-white border-2 border-transparent bg-clip-padding text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500',
        badgeStyle: {
          background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2) border-box',
          WebkitBackgroundClip: 'padding-box, border-box',
          color: '#ff6253',
        },
        icon: 'text-pink-500',
      }
    case 'amigo':
    default:
      return {
        badge: 'bg-gray-100 text-gray-700',
        icon: 'text-gray-500',
      }
  }
}

export default function DoadorStats({ data }) {
  const categoryStyles = getCategoryStyles(data.categoria)
  const showSubscriptionValue = data.tipoContribuicao?.toLowerCase().includes('recorrente')

  const stats = [
    {
      name: 'Categoria',
      value: data.categoria || 'Amigo',
      icon: TagIcon,
      isBadge: true,
    },
    {
      name: 'Valor Total Contribuido',
      value: formatCurrency(data.valorTotal),
      icon: CurrencyDollarIcon,
    },
    ...(showSubscriptionValue ? [{
      name: 'Assinatura Mensal',
      value: formatCurrency(data.valorAssinatura),
      subtext: '/mes',
      icon: ArrowPathIcon,
    }] : []),
    {
      name: 'Primeira Doacao',
      value: formatDate(data.dataPrimeiraDoacao),
      icon: CalendarIcon,
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Suas Contribuicoes</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
          >
            <dt>
              <div className={`absolute rounded-lg p-3 ${stat.isBadge ? categoryStyles.icon : 'bg-gray-100'}`}>
                <stat.icon className={`h-6 w-6 ${stat.isBadge ? '' : 'text-gray-600'}`} />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              {stat.isBadge ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${categoryStyles.badge}`}
                  style={categoryStyles.badgeStyle || {}}
                >
                  {stat.value}
                </span>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                  {stat.subtext && (
                    <span className="text-sm font-normal text-gray-500">{stat.subtext}</span>
                  )}
                </p>
              )}
            </dd>
          </div>
        ))}
      </div>

      {/* Contribution Type */}
      <div className="mt-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center gap-x-3">
          <span className="text-sm font-medium text-gray-500">Tipo de Contribuicao:</span>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
            {data.tipoContribuicao || 'Pontual'}
          </span>
        </div>
      </div>
    </div>
  )
}
