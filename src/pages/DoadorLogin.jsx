import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export default function DoadorLogin() {
  const navigate = useNavigate()
  const { user, signInWithGoogle, signInWithEmail, registerWithEmail, sendMagicLink, resetPassword } = useAuth()

  const [mode, setMode] = useState('login') // 'login', 'register', 'magic-link', 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/doador')
    }
  }, [user, navigate])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else if (mode === 'register') {
        await registerWithEmail(email, password)
      } else if (mode === 'magic-link') {
        await sendMagicLink(email)
        setSuccess('Link de acesso enviado! Verifique seu email.')
        setEmail('')
      } else if (mode === 'reset') {
        await resetPassword(email)
        setSuccess('Email de recuperacao enviado! Verifique sua caixa de entrada.')
        setEmail('')
      }
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (code) => {
    const messages = {
      'auth/invalid-email': 'Email invalido.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Usuario nao encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/email-already-in-use': 'Este email ja esta em uso.',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
      'auth/popup-closed-by-user': 'Login cancelado.',
      'auth/network-request-failed': 'Erro de conexao. Verifique sua internet.',
    }
    return messages[code] || 'Ocorreu um erro. Tente novamente.'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/">
              <img
                src="/Logo-Patronos-Completo.svg"
                alt="Fundo Patrimonial Patronos"
                className="mx-auto h-16 w-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Area do Doador
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Acesse sua area exclusiva para visualizar suas contribuicoes
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-x-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              <GoogleIcon />
              Entrar com Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">ou</span>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cadastrar
              </button>
              <button
                type="button"
                onClick={() => { setMode('magic-link'); setError(''); setSuccess(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === 'magic-link' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Link Magico
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-center gap-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {(mode === 'login' || mode === 'register') && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder={mode === 'register' ? 'Minimo 6 caracteres' : '********'}
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                    className="text-sm text-orange-600 hover:text-orange-500"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {mode === 'reset' && (
                <p className="text-sm text-gray-600">
                  Digite seu email para receber um link de recuperacao de senha.
                </p>
              )}

              {mode === 'magic-link' && (
                <p className="text-sm text-gray-600">
                  Enviaremos um link de acesso para seu email. Nao precisa de senha!
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processando...
                  </span>
                ) : mode === 'login' ? (
                  'Entrar'
                ) : mode === 'register' ? (
                  'Criar Conta'
                ) : mode === 'magic-link' ? (
                  'Enviar Link'
                ) : (
                  'Recuperar Senha'
                )}
              </button>
            </form>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="mt-4 w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Voltar ao login
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500">
            <Link to="/" className="text-orange-600 hover:text-orange-500">
              Voltar para o site
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
