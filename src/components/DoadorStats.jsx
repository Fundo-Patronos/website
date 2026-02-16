const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DoadorStats({ data }) {
  const isRecurring = data.tipoContribuicao?.toLowerCase().includes('recorrente')

  const stats = [
    { name: 'Total Contribuido', stat: formatCurrency(data.valorTotal) },
    ...(isRecurring ? [{ name: 'Assinatura Mensal', stat: formatCurrency(data.valorAssinatura) }] : []),
  ]

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">Suas Contribuicoes</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
