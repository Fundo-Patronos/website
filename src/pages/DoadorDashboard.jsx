import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DoadorLayout from '../layouts/DoadorLayout'
import DoadorHero from '../components/DoadorHero'
import DoadorStats from '../components/DoadorStats'
import DoadorSubscriptionStatus from '../components/DoadorSubscriptionStatus'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function DoadorDashboard() {
  const { user } = useAuth()
  const [donorData, setDonorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonorData = async () => {
      if (!user?.email) return

      try {
        const response = await fetch(`/api/donor-data?email=${encodeURIComponent(user.email)}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404) {
            setError('not-found')
          } else {
            setError('server-error')
          }
          return
        }

        setDonorData(data)
      } catch (err) {
        console.error('Error fetching donor data:', err)
        setError('network-error')
      } finally {
        setLoading(false)
      }
    }

    fetchDonorData()
  }, [user])

  if (loading) {
    return (
      <DoadorLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" style={{ borderColor: '#ff9700 transparent #ff9700 #ff9700' }}></div>
            <p className="mt-4 text-gray-600">Carregando seus dados...</p>
          </div>
        </div>
      </DoadorLayout>
    )
  }

  if (error === 'not-found') {
    return (
      <DoadorLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Doador nao encontrado</h2>
            <p className="mt-2 text-gray-600">
              O email <span className="font-medium">{user?.email}</span> nao esta registrado em nossa base de doadores.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Se voce ja fez uma doacao, por favor entre em contato conosco para verificarmos seu cadastro.
            </p>
            <a
              href="mailto:contato@fundopatronos.org.br"
              className="mt-6 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
            >
              Entrar em Contato
            </a>
          </div>
        </div>
      </DoadorLayout>
    )
  }

  if (error) {
    return (
      <DoadorLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Erro ao carregar dados</h2>
            <p className="mt-2 text-gray-600">
              Ocorreu um erro ao buscar suas informacoes. Por favor, tente novamente mais tarde.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </DoadorLayout>
    )
  }

  return (
    <DoadorLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <DoadorHero name={donorData.nome} />
        <DoadorStats data={donorData} />
        <DoadorSubscriptionStatus
          status={donorData.estadoAssinatura}
          subscriptionValue={donorData.valorAssinatura}
          contributionType={donorData.tipoContribuicao}
        />
      </div>
    </DoadorLayout>
  )
}
