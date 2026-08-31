import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

export default function DoadorLayout({ children }) {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Fundo Patrimonial Patronos</span>
            <img
              alt="Fundo Patrimonial Patronos"
              src="/Logo-Patronos-Completo.svg"
              className="h-16 w-auto"
            />
          </Link>
          <div className="flex items-center gap-x-6">
            <span className="text-sm font-semibold text-gray-900">Área do Doador</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Sair
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm leading-6 text-gray-600">
            Associação Fundo Patrimonial Patronos | CNPJ: 40.418.520/0001-33 | Jd. Nossa Senhora Auxiliadora, 257 - Campinas, SP
          </p>
        </div>
      </footer>
    </div>
  )
}
