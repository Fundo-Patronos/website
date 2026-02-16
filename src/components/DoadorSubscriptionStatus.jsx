import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid'

const getStatusConfig = (status) => {
  const normalizedStatus = status?.toLowerCase().trim()

  switch (normalizedStatus) {
    case 'ativa':
      return {
        icon: CheckCircleIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'ring-green-200',
        label: 'Ativa',
        description: 'Sua assinatura esta ativa e suas contribuicoes estao sendo processadas normalmente.',
      }
    case 'cancelada':
      return {
        icon: XCircleIcon,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'ring-red-200',
        label: 'Cancelada',
        description: 'Sua assinatura foi cancelada. Entre em contato conosco se desejar reativa-la.',
      }
    case 'n/a':
    default:
      return {
        icon: MinusCircleIcon,
        color: 'text-gray-400',
        bgColor: 'bg-gray-50',
        borderColor: 'ring-gray-200',
        label: 'N/A',
        description: 'Voce realizou uma doacao pontual. Nao ha assinatura recorrente ativa.',
      }
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return null
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DoadorSubscriptionStatus({ status, subscriptionValue, contributionType }) {
  const config = getStatusConfig(status)
  const isRecurring = contributionType?.toLowerCase().includes('recorrente')
  const formattedValue = formatCurrency(subscriptionValue)

  // Don't show for purely one-time donors
  if (!isRecurring && status?.toLowerCase() === 'n/a') {
    return null
  }

  return (
    <div className={`rounded-xl p-6 shadow-sm ring-1 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-x-4">
        <config.icon className={`h-8 w-8 flex-shrink-0 ${config.color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Status da Assinatura
            </h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {config.description}
          </p>
          {isRecurring && formattedValue && status?.toLowerCase() === 'ativa' && (
            <p className="mt-3 text-sm text-gray-700">
              Valor mensal: <span className="font-semibold">{formattedValue}</span>
            </p>
          )}
          {status?.toLowerCase() === 'cancelada' && (
            <a
              href="mailto:contato@fundopatronos.org.br?subject=Reativar%20Assinatura"
              className="mt-4 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
            >
              Reativar Assinatura
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
