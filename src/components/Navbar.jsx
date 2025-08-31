import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import SobreNosFlyout from './SobreNosFlyout'
import ImpactoFlyout from './ImpactoFlyout'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  AcademicCapIcon,
  UsersIcon,
  BuildingLibraryIcon,
  HandRaisedIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, HeartIcon } from '@heroicons/react/20/solid'

// Sobre Nós flyout menu items
const aboutItems = [
  { name: 'O Fundo', href: '#', icon: BuildingLibraryIcon },
  { name: 'Transparência', href: '#', icon: ShieldCheckIcon },
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
    date: 'Março 2024',
    datetime: '2024-03',
    category: { title: 'Transparência', href: '#' },
    imageUrl: 'https://picsum.photos/400/200?random=3',
    description: 'Baixe nosso Relatório Anual 2024 e conheça todos os avanços e conquistas que alcançamos no último ano, incluindo projetos apoiados, recursos investidos e impactos gerados na comunidade acadêmica.',
  },
  {
    id: 2,
    title: 'Faça sua contribuição',
    href: '#',
    date: 'Sempre disponível',
    datetime: '2024',
    category: { title: 'Doação', href: '#' },
    imageUrl: 'https://picsum.photos/400/200?random=4',
    description: 'Transforme o futuro da educação superior no Brasil. Sua doação ao Fundo Patronos fortalece a pesquisa, apoia estudantes talentosos e contribui para o desenvolvimento de uma sociedade mais justa.',
  },
]

// Impacto submenu items
const impactItems = [
  { name: 'Projetos Apoiados', description: 'Iniciativas que transformamos em realidade', href: '#', icon: ChartPieIcon },
  { name: 'Resultados', description: 'Números e conquistas alcançadas', href: '#', icon: ChartBarIcon },
  { name: 'Beneficiários', description: 'Quem é impactado pelo nosso trabalho', href: '#', icon: UsersIcon },
  { name: 'Relatórios', description: 'Transparência em nossas ações', href: '#', icon: CursorArrowRaysIcon },
]

const callsToAction = [
  { name: 'Fale Conosco', href: '#', icon: PhoneIcon },
  { name: 'Seja um Doador', href: '#', icon: HeartIcon },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sobreNosOpen, setSobreNosOpen] = useState(false)
  const [impactoOpen, setImpactoOpen] = useState(false)

  // Store timeouts to clear them when needed
  const [sobreNosTimeout, setSobreNosTimeout] = useState(null)
  const [impactoTimeout, setImpactoTimeout] = useState(null)

  // Handle mouse enter/leave for Sobre Nós with proper cleanup
  const handleSobreNosEnter = () => {
    if (sobreNosTimeout) {
      clearTimeout(sobreNosTimeout)
      setSobreNosTimeout(null)
    }
    setSobreNosOpen(true)
  }

  const handleSobreNosLeave = () => {
    const timeout = setTimeout(() => {
      setSobreNosOpen(false)
      setSobreNosTimeout(null)
    }, 150)
    setSobreNosTimeout(timeout)
  }

  // Handle mouse enter/leave for Impacto with proper cleanup
  const handleImpactoEnter = () => {
    if (impactoTimeout) {
      clearTimeout(impactoTimeout)
      setImpactoTimeout(null)
    }
    setImpactoOpen(true)
  }

  const handleImpactoLeave = () => {
    const timeout = setTimeout(() => {
      setImpactoOpen(false)
      setImpactoTimeout(null)
    }, 150)
    setImpactoTimeout(timeout)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sobreNosTimeout) clearTimeout(sobreNosTimeout)
      if (impactoTimeout) clearTimeout(impactoTimeout)
    }
  }, [sobreNosTimeout, impactoTimeout])

  return (
    <header className="bg-white relative">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Fundo Patrimonial Patronos</span>
            <img
              alt="Fundo Patrimonial Patronos"
              src="/Logo-Patronos-Completo.svg"
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Abrir menu principal</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-8 lg:items-center">
          <Link to="/" className="text-sm font-semibold leading-6 text-gray-900 hover:text-red-700 transition-colors px-2 py-1">
            Home
          </Link>
          
          <div
            data-sobre-nos
            onMouseEnter={handleSobreNosEnter}
            onMouseLeave={handleSobreNosLeave}
            className="relative"
          >
            <button className={`flex items-center gap-x-1 text-sm font-semibold leading-6 transition-all duration-200 px-2 py-1 rounded-lg border ${
              sobreNosOpen 
                ? 'text-gray-900 border-gray-300 hover:text-red-700' 
                : 'text-gray-900 border-transparent hover:text-red-700'
            }`}>
              Sobre Nós
              <ChevronDownIcon aria-hidden="true" className={`size-5 flex-none transition-transform duration-200 ${
                sobreNosOpen ? 'text-gray-600 rotate-180' : 'text-gray-400'
              }`} />
            </button>
          </div>

          <div
            data-impacto
            onMouseEnter={handleImpactoEnter}
            onMouseLeave={handleImpactoLeave}
            className="relative"
          >
            <button className={`flex items-center gap-x-1 text-sm font-semibold leading-6 transition-all duration-200 px-2 py-1 rounded-lg border ${
              impactoOpen 
                ? 'text-gray-900 border-gray-300 hover:text-red-700' 
                : 'text-gray-900 border-transparent hover:text-red-700'
            }`}>
              Impacto
              <ChevronDownIcon aria-hidden="true" className={`size-5 flex-none transition-transform duration-200 ${
                impactoOpen ? 'text-gray-600 rotate-180' : 'text-gray-400'
              }`} />
            </button>
          </div>

          <a href="#" className="text-sm font-semibold leading-6 text-gray-900 hover:text-red-700 transition-colors px-2 py-1">
            Parceiros
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="https://doa.re/patronos" target="_blank" rel="noopener noreferrer" className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)', focusVisibleOutlineColor: '#ff9700'}}>
            Doar Agora <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fundo Patrimonial Patronos</span>
              <img
                alt="Fundo Patrimonial Patronos"
                src="/Logo-Patronos-Completo.svg"
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Fechar menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Sobre Nós
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...aboutItems, ...resourceItems].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Impacto
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...impactItems, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Parceiros
                </a>
              </div>
              <div className="py-6">
                <a
                  href="https://doa.re/patronos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Doar Agora
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      
      {/* Sobre Nós Flyout */}
      <SobreNosFlyout 
        isOpen={sobreNosOpen} 
        onClose={() => setSobreNosOpen(false)}
        onMouseEnter={handleSobreNosEnter}
        onMouseLeave={handleSobreNosLeave}
      />
      
      {/* Impacto Flyout */}
      <ImpactoFlyout 
        isOpen={impactoOpen} 
        onClose={() => setImpactoOpen(false)}
        onMouseEnter={handleImpactoEnter}
        onMouseLeave={handleImpactoLeave}
      />
    </header>
  )
}