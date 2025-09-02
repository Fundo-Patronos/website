const categorias = [
  {
    id: 1,
    title: 'Equipes de Competição',
    imageUrl: '/Escopo%20Extracurriculares/Competicao.avif',
  },
  {
    id: 2,
    title: 'Esportes',
    imageUrl: '/Escopo%20Extracurriculares/Esportes.jpg',
  },
  {
    id: 3,
    title: 'Centros Acadêmicos e Apoio ao Ensino',
    imageUrl: '/Escopo%20Extracurriculares/Centro%20Academico.jpg',
  },
  {
    id: 4,
    title: 'Grupos de Pesquisa e Inovação',
    imageUrl: '/Escopo%20Extracurriculares/Pesquisa.jpg',
  },
  {
    id: 5,
    title: 'Arte e Cultura',
    imageUrl: '/Escopo%20Extracurriculares/Arte%20e%20Cultura.jpg',
  },
]

export default function EscopoExtracurriculares() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Escopo de Extracurriculares
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Apoiamos diferentes tipos de atividades extracurriculares que enriquecem a experiência universitária.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {categorias.map((categoria) => (
            <article key={categoria.id} className="flex flex-col items-center">
              <div className="relative w-full">
                <img
                  alt=""
                  src={categoria.imageUrl}
                  className="aspect-square w-full rounded-2xl bg-gray-100 object-cover"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {categoria.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}