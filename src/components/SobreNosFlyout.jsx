import { Link } from 'react-router-dom'
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/20/solid'

const aboutItems = [
  { name: 'O Fundo', href: '/sobre-nos/fundo', icon: BuildingLibraryIcon, isRouter: true },
  { name: 'Transparência', href: '#', icon: ShieldCheckIcon, isRouter: false },
]

const resourceItems = [
  { name: 'Contato', href: '#', icon: PhoneIcon },
  { name: 'Linkedin', href: '#', icon: GlobeAltIcon },
  { name: 'Instagram', href: '#', icon: GlobeAltIcon },
  { name: 'Seja um Voluntário', href: '#', icon: UserGroupIcon },
  { name: 'Área do Doador', href: '#', icon: UsersIcon },
]

const featuredPosts = [
  {
    id: 1,
    title: 'Consulte o nosso Relatório Anual 2024',
    href: '#',
    date: 'Abril 2024',
    datetime: '2024-04',
    category: { title: 'Transparência', href: '#' },
    imageUrl: '/Illustrative Pictures/Relatorio Anual Cover.jpeg',
    description: 'Baixe nosso Relatório Anual 2024 e conheça todos os avanços e conquistas que alcançamos no último ano, incluindo projetos apoiados, recursos investidos e impactos gerados na comunidade acadêmica.',
  },
  {
    id: 2,
    title: 'Faça sua contribuição',
    href: '#',
    date: 'Sempre disponível',
    datetime: '2024',
    category: { title: 'Doação', href: '#' },
    imageUrl: '/Illustrative Pictures/Website - Flyout Menus - CB.svg',
    description: 'Transforme o futuro da educação superior no Brasil. Sua doação ao Fundo Patronos fortalece a pesquisa, apoia estudantes talentosos e contribui para o desenvolvimento de uma sociedade mais justa.',
  },
]

export default function SobreNosFlyout({ isOpen, onClose, onMouseEnter, onMouseLeave }) {
  if (!isOpen) return null

  return (
    <div 
      data-sobre-nos 
      className="absolute inset-x-0 top-full bg-white shadow-lg ring-1 ring-gray-900/5 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
              <div>
                <h3 className="text-sm leading-6 font-medium text-gray-500">Sobre Nós</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {aboutItems.map((item) => (
                      item.isRouter ? (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={onClose}
                          className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900 hover:text-red-700 transition-colors"
                        >
                          <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900 hover:text-red-700 transition-colors"
                        >
                          <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm leading-6 font-medium text-gray-500">Recursos</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {resourceItems.map((item) => (
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