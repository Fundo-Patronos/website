import { Link } from 'react-router-dom'
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/20/solid'

const aboutItems = [
  { name: 'O Fundo', href: '/sobre-nos/fundo', icon: BuildingLibraryIcon, isRouter: true },
  { name: 'Transparência', href: '/sobre-nos/transparencia', icon: ShieldCheckIcon, isRouter: true },
]

// Social media icons (custom SVG components)
const LinkedInIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
  </svg>
)

const YouTubeIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const resourceItems = [
  { name: 'Contato', href: '/sobre-nos/contato', icon: PhoneIcon, isRouter: true },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/fundo-patronos', icon: LinkedInIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/fundopatronos/', icon: InstagramIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@FundoPatronos', icon: YouTubeIcon },
  { name: 'Seja um Voluntário', href: '/sobre-nos/contato', icon: UserGroupIcon, isRouter: true },
  { name: 'Área do Doador', href: 'https://doador.doare.org/', icon: UsersIcon },
]

const featuredPosts = [
  {
    id: 1,
    title: 'Consulte o nosso Relatório Anual 2024',
    href: '#',
    date: 'Abril 2024',
    datetime: '2024-04',
    category: { title: 'Transparência', href: '#' },
    imageUrl: '/Relatorios Anuais/Cover - Fundo Patronos - Relatorio Anual 2024.jpeg',
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
                      item.isRouter ? (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={onClose}
                          className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900"
                          style={{'&:hover': {color: '#ff9700'}}}
                        >
                          <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900"
                          style={{'&:hover': {color: '#ff9700'}}}
                          target={item.name === 'LinkedIn' || item.name === 'Instagram' || item.name === 'YouTube' || item.name === 'Área do Doador' ? '_blank' : '_self'}
                          rel={item.name === 'LinkedIn' || item.name === 'Instagram' || item.name === 'YouTube' || item.name === 'Área do Doador' ? 'noopener noreferrer' : undefined}
                        >
                          <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />
                          {item.name}
                        </a>
                      )
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