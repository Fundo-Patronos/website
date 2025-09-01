const pessoas = [
  // Conselho de Administração
  {
    name: 'Agnes Querido',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Agnes Blanco Querido.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/agnesblancoquerido/',
  },
  {
    name: 'Alexandre Oliveira',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Alexandre Oliveira.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/alexoliveira/',
  },
  {
    name: 'Érica Jannini',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Erica Jannini.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/ericajannini/',
  },
  {
    name: 'Newton Freire',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Newton Freire.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/newtonfreire/',
  },
  {
    name: 'Rodrigo Ferroni',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Rodrigo Ferroni.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/rodrigoferroni/',
  },
  {
    name: 'Érica Rolim',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Erica Rolim.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/ericarolim/',
  },
  {
    name: 'Anderson Correia',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Anderson Correia.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/andersonrcorreia/',
  },
  {
    name: 'Henrique Mascarenhas',
    role: 'Conselho de Administração',
    imageUrl: '/Conselheiros/Henrique Mascarenhas.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/henriquemascarenhas/',
  },
  // Comitê de Investimentos
  {
    name: 'Felipe Andrioli',
    role: 'Comitê de Investimentos',
    imageUrl: '/Conselheiros/Felipe Andrioli.avif',
    linkedinUrl: 'https://www.linkedin.com/in/felipe-andrioli-cfa-7531a51/',
  },
  {
    name: 'Andrea Bastos Damico',
    role: 'Comitê de Investimentos',
    imageUrl: '/Conselheiros/Andrea Bastos Damico.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/andrea-bastos-damico-532326a4/',
  },
  {
    name: 'Otaviano Canuto',
    role: 'Comitê de Investimentos',
    imageUrl: '/Conselheiros/Otaviano Canuto.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/otaviano-canuto/',
  },
  // Comitê Fiscal
  {
    name: 'Cinthia Peres',
    role: 'Comitê Fiscal',
    imageUrl: '/Conselheiros/Cinthia Peres.png',
    linkedinUrl: 'https://www.linkedin.com/in/cinthiaperes/',
  },
  {
    name: 'Nilo Signorini Jr',
    role: 'Comitê Fiscal',
    imageUrl: '/Conselheiros/Nilo Signorini Junior.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/nilosignorini/',
  },
  {
    name: 'Augusto Santos',
    role: 'Comitê Fiscal',
    imageUrl: '/Conselheiros/Augusto Santos.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/augusto-santos-business/',
  },
  // Diretoria Executiva (apenas os 5 especificados)
  {
    name: 'Tulio Prado',
    role: 'Presidente',
    imageUrl: '/Conselheiros/Tulio Prado.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/tulio-prado/',
  },
  {
    name: 'Gustavo Beltrami',
    role: 'Captação',
    imageUrl: '/Conselheiros/Gustavo Beltrami.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/gustavo-beltrami/',
  },
  {
    name: 'Matheus Pires',
    role: 'Editais e Projetos',
    imageUrl: '/Conselheiros/Matheus Pires.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/matheus-hp-gomes/',
  },
  {
    name: 'Pedro Mota',
    role: 'Investimentos',
    imageUrl: '/Conselheiros/Pedro Mota.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/pedrolula/',
  },
  {
    name: 'Silvio Fernandes',
    role: 'Operações e TI',
    imageUrl: '/Conselheiros/Silvio Fernandes.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/silvio-fernandes/',
  },
]

export default function FundoEquipe() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Nossa equipe</h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Conheça os profissionais que compõem nossos conselhos e diretorias.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
        >
          {pessoas.map((pessoa) => (
            <li key={pessoa.name}>
              <a
                href={pessoa.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  alt={pessoa.name}
                  src={pessoa.imageUrl}
                  className="mx-auto size-24 rounded-full outline-1 -outline-offset-1 outline-black/5"
                />
                <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">{pessoa.name}</h3>
                <p className="text-sm/6 text-gray-600">{pessoa.role}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}