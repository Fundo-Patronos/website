export default function DoadorHero({ name }) {
  const firstName = name?.split(' ')[0] || 'Doador'

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Ola, {firstName}!
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Bem-vindo a sua area exclusiva. Aqui voce pode acompanhar suas contribuicoes.
      </p>
    </div>
  )
}
