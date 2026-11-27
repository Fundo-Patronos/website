// Dados das equipes apoiadas, agrupados por temporada.
// Para adicionar uma nova temporada, inclua um objeto em `temporadas`;
// para trocar os placeholders, edite `equipes` (imageUrl vazio = bloco neutro).
// As categorias seguem as de EscopoExtracurriculares.jsx.
const temporadas = [
  {
    ano: 2027,
    equipes: [
      { id: 1, nome: 'Nome da equipe', categoria: 'Equipes de Competição', descricao: 'Descrição em breve', imageUrl: '' },
      { id: 2, nome: 'Nome da equipe', categoria: 'Esportes', descricao: 'Descrição em breve', imageUrl: '' },
      { id: 3, nome: 'Nome da equipe', categoria: 'Centros Acadêmicos e Apoio ao Ensino', descricao: 'Descrição em breve', imageUrl: '' },
      { id: 4, nome: 'Nome da equipe', categoria: 'Grupos de Pesquisa e Inovação', descricao: 'Descrição em breve', imageUrl: '' },
      { id: 5, nome: 'Nome da equipe', categoria: 'Arte e Cultura', descricao: 'Descrição em breve', imageUrl: '' },
      { id: 6, nome: 'Nome da equipe', categoria: 'Equipes de Competição', descricao: 'Descrição em breve', imageUrl: '' },
    ],
  },
]

// Apenas a temporada mais recente é exibida.
const temporadaAtual = temporadas.reduce((a, b) => (b.ano > a.ano ? b : a))

export default function ExtrasEquipes() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base/7 font-semibold" style={{ color: '#ff9700' }}>
            Temporada {temporadaAtual.ano}
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Equipes apoiadas
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Conheça as equipes e organizações estudantis que o Patronos apoia nesta temporada.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {temporadaAtual.equipes.map((equipe) => (
            <article key={equipe.id} className="flex flex-col">
              <div className="relative w-full">
                {equipe.imageUrl ? (
                  <img
                    alt={equipe.nome}
                    src={equipe.imageUrl}
                    className="aspect-video w-full rounded-2xl bg-gray-100 object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="aspect-video w-full rounded-2xl bg-gray-100"
                  />
                )}
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold leading-6 text-gray-500">
                  {equipe.categoria}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  {equipe.nome}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  {equipe.descricao}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
