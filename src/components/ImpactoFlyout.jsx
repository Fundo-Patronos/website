import {
  AcademicCapIcon,
  BriefcaseIcon,
  TrophyIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'

const editaisItems = [
  { name: 'Extracurriculares e Projetos de Extensão', href: '/impacto/extras', icon: AcademicCapIcon },
  { name: 'Carreira', href: '/impacto/carreira', icon: BriefcaseIcon },
  { name: 'Talentos e Bolsas', href: '/impacto/talentos', icon: TrophyIcon },
  { name: 'Pesquisa', href: '/impacto/pesquisa', icon: BeakerIcon },
]

const featuredPosts = [
  {
    id: 1,
    title: 'Conheça o Centro de Carreiras',
    href: '#',
    date: 'Sempre disponível',
    datetime: '2024',
    category: { title: 'Carreiras', href: '#' },
    imageUrl: '/centro_carreiras_screenshot.png',
    description: 'Acesse o nosso Centro de Carreiras para conectar-se com talentos que já passaram pela Unicamp e descubra oportunidades profissionais exclusivas.',
  },
  {
    id: 2,
    title: 'Inscreva-se no Edital de Projetos 2025',
    href: '#',
    date: 'Inscrições abertas',
    datetime: '2025',
    category: { title: 'Editais', href: '#' },
    imageUrl: 'https://picsum.photos/400/200?random=6',
    description: 'Inscreva sua equipe extracurricular ou grupo de extensão para receber apoio financeiro e treinamentos especializados para o desenvolvimento de projetos inovadores.',
  },
]

export default function ImpactoFlyout({ isOpen, onClose, onMouseEnter, onMouseLeave }) {
  if (!isOpen) return null

  return (
    <div 
      data-impacto-flyout 
      className="absolute inset-x-0 top-full bg-white shadow-lg ring-1 ring-gray-900/5 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 sm:gap-x-8">
            <div>
              <h3 className="text-sm leading-6 font-medium text-gray-500">Editais</h3>
              <div className="mt-6 flow-root">
                <div className="-my-2">
                  {editaisItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900"
                      style={{'&:hover': {color: '#ff9700'}}}
                    >
                      <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
            <h3 className="sr-only">Posts em destaque</h3>
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
              >
                <div className="relative flex-none">
                  <img
                    alt=""
                    src={post.imageUrl}
                    className="aspect-[2/1] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto"
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-gray-900/10 ring-inset" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4">
                    <time dateTime={post.datetime} className="text-sm leading-6 text-gray-600">
                      {post.date}
                    </time>
                    <a
                      href={post.category.href}
                      onClick={onClose}
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                    >
                      {post.category.title}
                    </a>
                  </div>
                  <h4 className="mt-2 text-sm leading-6 font-semibold text-gray-900">
                    <a href={post.href} onClick={onClose}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{post.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}