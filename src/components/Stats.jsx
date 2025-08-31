const stats = [
  { id: 1, name: 'doadores', value: '+400' },
  { id: 2, name: 'em patrimônio', value: 'R$ 3.0 milhões' },
  { id: 3, name: 'voluntários', value: '+80' },
]

export default function Stats() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
              Nosso Impacto na Unicamp e na Sociedade
            </h2>
            <p className="mt-4 text-lg/8 text-gray-600">Desde nossa fundação, trabalhamos incansavelmente para fortalecer a educação superior brasileira.</p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}