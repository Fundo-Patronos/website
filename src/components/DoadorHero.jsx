export default function DoadorHero({ name }) {
  const firstName = name?.split(' ')[0] || 'Doador'

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Ola, {firstName}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Bem-vindo a sua area exclusiva. Aqui voce pode acompanhar suas contribuicoes.
      </p>
    </div>
  )
}
