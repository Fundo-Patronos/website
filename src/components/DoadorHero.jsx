export default function DoadorHero({ name }) {
  const firstName = name?.split(' ')[0] || 'Doador'

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Olá, {firstName}!
      </h1>
      <p className="mt-2 text-lg leading-8 text-gray-600">
        Bem-vindo à sua Área do Doador. Aqui você pode acompanhar suas contribuições.
      </p>
    </div>
  )
}
