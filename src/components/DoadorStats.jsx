const BRAND_GRADIENT = 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'

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
    { name: 'Total Contribuído', stat: formatCurrency(data.valorTotal) },
    ...(isRecurring ? [{ name: 'Assinatura Mensal', stat: formatCurrency(data.valorAssinatura) }] : []),
  ]

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Suas Contribuições</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
            <div className="h-1.5 w-full" style={{ background: BRAND_GRADIENT }} />
            <div className="px-4 py-5 sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
