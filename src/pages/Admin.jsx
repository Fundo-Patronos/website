import { useState, useEffect, useCallback } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const TABS = [
  { id: 'donors',      label: 'Doadores'           },
  { id: 'add-pix',     label: 'Adicionar PIX'      },
  { id: 'add-profile', label: 'Cadastrar Perfil'   },
  { id: 'rules',       label: 'Regras de Categoria'},
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'

function formatCurrency(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)
}

function CategoriaBadge({ value }) {
  if (value === 'Patrono') {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ background: BRAND_GRADIENT }}>
        Patrono
      </span>
    )
  }
  if (value === 'Associado') {
    return (
      <span className="inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold bg-white text-orange-600"
        style={{ borderColor: '#ff6253' }}>
        Associado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
      Amigo
    </span>
  )
}

function Feedback({ feedback }) {
  if (!feedback) return null
  const isSuccess = feedback.type === 'success'
  return (
    <div className={`flex items-start gap-2 rounded-md p-3 text-sm ${
      isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    }`}>
      {isSuccess
        ? <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
        : <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />}
      <span>{feedback.msg}</span>
    </div>
  )
}

// ====================== TAB: Doadores (resumo / só leitura) ======================
function DonorsTab({ donors, loading }) {
  if (loading) return <p className="text-gray-600">Carregando...</p>
  if (!donors?.length) return <p className="text-gray-600">Nenhum doador cadastrado ainda.</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">RM</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor Total</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Assinatura</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Categoria</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">1ª Doação</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {donors.map((d) => (
            <tr key={d.email} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-700">{d.email}</td>
              <td className="px-4 py-3 text-gray-900">{d.nome}</td>
              <td className="px-4 py-3 text-gray-700">{d.rm || <span className="text-gray-400 italic">—</span>}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(d.valorTotal)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(d.valorAssinatura)}</td>
              <td className="px-4 py-3"><CategoriaBadge value={d.categoria} /></td>
              <td className="px-4 py-3 text-gray-700">{d.tipoContribuicao}</td>
              <td className="px-4 py-3 text-gray-700">{d.dataPrimeiraDoacao || '—'}</td>
              <td className="px-4 py-3 text-gray-700">{d.estadoAssinatura}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-gray-500">{donors.length} doadores</p>
    </div>
  )
}

// ====================== TAB: Adicionar PIX (form + table) ======================
function AddPixTab({ getToken, events, eventsLoading, onSuccess }) {
  const empty = { id: null, email: '', amount: '', date: new Date().toISOString().split('T')[0] }
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const isEditing = form.id !== null

  const handleEdit = (event) => {
    setForm({ id: event.id, email: event.email, amount: String(event.amount), date: event.occurredAt })
    setFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setForm(empty)
    setFeedback(null)
  }

  const handleDelete = async (event) => {
    if (!window.confirm(`Excluir PIX de ${formatCurrency(event.amount)} de ${event.email} em ${event.occurredAt}?`)) return
    try {
      const token = await getToken()
      const r = await fetch(`/api/admin/donations?id=${event.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({ type: 'success', msg: `Evento ${event.id} removido.` })
      if (form.id === event.id) setForm(empty)
      onSuccess?.()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    try {
      const token = await getToken()
      const body = { email: form.email, amount: form.amount, occurredAt: form.date, source: 'pix' }
      const url = isEditing ? `/api/admin/donations?id=${form.id}` : '/api/admin/donations'
      const method = isEditing ? 'PUT' : 'POST'
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro ao salvar')
      setFeedback({
        type: 'success',
        msg: isEditing
          ? `Evento ${form.id} atualizado.`
          : `PIX de ${formatCurrency(parseFloat(form.amount))} registrado para ${form.email}.`,
      })
      setForm(empty)
      onSuccess?.()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? `Editando evento #${form.id}` : 'Registrar doação PIX'}
          </h3>
          {isEditing && (
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              <XMarkIcon className="h-4 w-4" /> Cancelar edição
            </button>
          )}
        </div>
        <p className="mt-1 mb-4 text-sm text-gray-600">
          Cada PIX vira um evento imutável (até você editar/excluir). Valor total e categoria do doador
          recalculam automaticamente.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email do doador</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doador@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
            <input type="number" step="0.01" min="0.01" required value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="100.00"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input type="date" required value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Feedback feedback={feedback} />
          <button type="submit" disabled={loading}
            className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 sm:w-auto sm:px-6"
            style={{ background: BRAND_GRADIENT }}>
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Registrar PIX'}
          </button>
        </div>
      </form>

      {/* Tabela de eventos */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Histórico de eventos PIX</h3>
        {eventsLoading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : !events?.length ? (
          <p className="text-gray-600">Nenhum evento registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Fonte</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {events.map((ev) => (
                  <tr key={ev.id} className={form.id === ev.id ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{ev.id}</td>
                    <td className="px-4 py-3 text-gray-700">{ev.occurredAt}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{ev.email}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(ev.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {ev.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(ev)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-orange-600"
                          title="Editar">
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(ev)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                          title="Excluir">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-gray-500">{events.length} eventos</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ====================== TAB: Cadastrar Perfil (form + table com edit/delete) ======================
function AddProfileTab({ getToken, donors, donorsLoading, onSuccess }) {
  const empty = { editing: false, email: '', nome: '', rm: '', tipoContribuicao: 'Pontual', estadoAssinatura: 'N/A', valorAssinatura: '0' }
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleEdit = (donor) => {
    setForm({
      editing: true,
      email: donor.email,
      nome: donor.nome,
      rm: donor.rm || '',
      tipoContribuicao: donor.tipoContribuicao,
      estadoAssinatura: donor.estadoAssinatura,
      valorAssinatura: String(donor.valorAssinatura),
    })
    setFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setForm(empty); setFeedback(null) }

  const handleDelete = async (donor) => {
    if (!window.confirm(`Excluir perfil de ${donor.nome} (${donor.email})?\n\nNota: eventos PIX desse email permanecem registrados.`)) return
    try {
      const token = await getToken()
      const r = await fetch(`/api/admin/donors?email=${encodeURIComponent(donor.email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({ type: 'success', msg: `Perfil de ${donor.email} removido.` })
      if (form.email === donor.email) setForm(empty)
      onSuccess?.()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: form.email,
          nome: form.nome,
          rm: form.rm,
          tipoContribuicao: form.tipoContribuicao,
          estadoAssinatura: form.estadoAssinatura,
          valorAssinatura: parseFloat(form.valorAssinatura) || 0,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({ type: 'success', msg: `${form.editing ? 'Atualizado' : 'Cadastrado'}: ${form.nome} (${form.email})` })
      setForm(empty)
      onSuccess?.()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {form.editing ? `Editando ${form.email}` : 'Cadastrar perfil de doador'}
          </h3>
          {form.editing && (
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              <XMarkIcon className="h-4 w-4" /> Cancelar edição
            </button>
          )}
        </div>
        <p className="mt-1 mb-4 text-sm text-gray-600">
          Campos manuais. Valor total e categoria são <strong>computados</strong> a partir dos eventos PIX.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required value={form.email} disabled={form.editing}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doador@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input type="text" required value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              RM <span className="text-gray-400 font-normal">(Responsável pelo Relacionamento)</span>
            </label>
            <input type="text" value={form.rm}
              onChange={(e) => setForm({ ...form, rm: e.target.value })}
              placeholder="Nome ou email do RM dentro do Patronos (opcional)"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de contribuição</label>
            <select value={form.tipoContribuicao}
              onChange={(e) => setForm({ ...form, tipoContribuicao: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
              <option>Pontual</option><option>Recorrente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado da assinatura</label>
            <select value={form.estadoAssinatura}
              onChange={(e) => setForm({ ...form, estadoAssinatura: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
              <option>N/A</option><option>Ativa</option><option>Pausada</option><option>Cancelada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor da assinatura (R$/mês)</label>
            <input type="number" step="0.01" min="0" value={form.valorAssinatura}
              onChange={(e) => setForm({ ...form, valorAssinatura: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Feedback feedback={feedback} />
          <button type="submit" disabled={loading}
            className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 sm:w-auto sm:px-6"
            style={{ background: BRAND_GRADIENT }}>
            {loading ? 'Salvando...' : form.editing ? 'Salvar alterações' : 'Cadastrar perfil'}
          </button>
        </div>
      </form>

      {/* Tabela de perfis */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Perfis cadastrados</h3>
        {donorsLoading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : !donors?.length ? (
          <p className="text-gray-600">Nenhum perfil ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">RM</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Assinatura</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {donors.map((d) => (
                  <tr key={d.email} className={form.email === d.email ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{d.email}</td>
                    <td className="px-4 py-3 text-gray-900">{d.nome}</td>
                    <td className="px-4 py-3 text-gray-700">{d.rm || <span className="text-gray-400 italic">—</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{d.tipoContribuicao}</td>
                    <td className="px-4 py-3 text-gray-700">{d.estadoAssinatura}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(d.valorAssinatura)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(d)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-orange-600" title="Editar">
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(d)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600" title="Excluir">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-gray-500">{donors.length} perfis</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ====================== TAB: Regras de Categoria ======================
function RulesTab({ getToken, onChanged }) {
  const [rules, setRules] = useState(null)
  const [minPatrono, setMinPatrono] = useState('')
  const [minAssociado, setMinAssociado] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/category-rules', { headers: { Authorization: `Bearer ${token}` } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setRules(data)
      setMinPatrono(String(data.minPatrono))
      setMinAssociado(String(data.minAssociado))
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/category-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ minPatrono: parseFloat(minPatrono), minAssociado: parseFloat(minAssociado) }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({ type: 'success', msg: 'Regras atualizadas. Categorias recalculam automaticamente.' })
      setRules(data)
      onChanged?.()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Thresholds de categoria</h3>
        <p className="text-sm text-gray-600">A categoria de cada doador é <strong>computada</strong> a partir do valor total:</p>
        <ul className="ml-5 list-disc text-sm text-gray-600">
          <li><strong>Patrono</strong> se valor_total ≥ <code className="bg-gray-100 px-1">min_patrono</code></li>
          <li><strong>Associado</strong> se ≥ <code className="bg-gray-100 px-1">min_associado</code> e &lt; <code className="bg-gray-100 px-1">min_patrono</code></li>
          <li><strong>Amigo</strong> caso contrário</li>
        </ul>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">min_patrono (R$)</label>
            <input type="number" step="0.01" min="0.01" required value={minPatrono}
              onChange={(e) => setMinPatrono(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">min_associado (R$)</label>
            <input type="number" step="0.01" min="0.01" required value={minAssociado}
              onChange={(e) => setMinAssociado(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
          </div>
        </div>

        {rules && (
          <p className="text-xs text-gray-500">
            Atual: Patrono ≥ {formatCurrency(rules.minPatrono)} | Associado ≥ {formatCurrency(rules.minAssociado)}
          </p>
        )}

        <Feedback feedback={feedback} />

        <button type="submit" disabled={loading}
          className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
          style={{ background: BRAND_GRADIENT }}>
          {loading ? 'Salvando...' : 'Salvar regras'}
        </button>
      </form>
    </div>
  )
}

// ====================== PÁGINA ======================
export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('donors')
  const [donors, setDonors] = useState(null)
  const [donorsLoading, setDonorsLoading] = useState(true)
  const [events, setEvents] = useState(null)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  const getToken = useCallback(async () => {
    if (!user) throw new Error('Não autenticado')
    return user.getIdToken()
  }, [user])

  const fetchDonors = useCallback(async () => {
    if (!user) return
    setDonorsLoading(true)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/donors', { headers: { Authorization: `Bearer ${token}` } })
      if (r.status === 403) { setAuthError('forbidden'); return }
      if (r.status === 401) { setAuthError('unauthorized'); return }
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setDonors(data.donors)
      setAuthError(null)
    } catch (err) {
      console.error('Erro ao carregar doadores:', err)
    } finally {
      setDonorsLoading(false)
    }
  }, [user, getToken])

  const fetchEvents = useCallback(async () => {
    if (!user) return
    setEventsLoading(true)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/donations?limit=500', { headers: { Authorization: `Bearer ${token}` } })
      if (r.status === 403 || r.status === 401) return
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setEvents(data.events)
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
    } finally {
      setEventsLoading(false)
    }
  }, [user, getToken])

  // Reload both whenever something changes — mantém tudo consistente.
  const reloadAll = useCallback(() => {
    fetchDonors()
    fetchEvents()
  }, [fetchDonors, fetchEvents])

  useEffect(() => { reloadAll() }, [reloadAll])

  if (authLoading) return <CenteredLoader text="Verificando autenticação..." />
  if (!user) return <Navigate to="/doador/login" replace />

  if (authError === 'forbidden') {
    return (
      <Shell signOut={signOut}>
        <div className="mx-auto max-w-md py-16 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Acesso negado</h2>
          <p className="mt-2 text-gray-600">
            O email <strong>{user.email}</strong> não está na lista de administradores.
          </p>
          <Link to="/doador" className="mt-6 inline-block text-sm text-orange-600 hover:text-orange-500">
            Voltar para área do doador →
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell signOut={signOut}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium ${
                  activeTab === t.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'donors' && (
          <DonorsTab donors={donors} loading={donorsLoading} />
        )}
        {activeTab === 'add-pix' && (
          <AddPixTab getToken={getToken} events={events} eventsLoading={eventsLoading} onSuccess={reloadAll} />
        )}
        {activeTab === 'add-profile' && (
          <AddProfileTab getToken={getToken} donors={donors} donorsLoading={donorsLoading} onSuccess={reloadAll} />
        )}
        {activeTab === 'rules' && (
          <RulesTab getToken={getToken} onChanged={reloadAll} />
        )}
      </div>
    </Shell>
  )
}

function Shell({ children, signOut }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <Link to="/" className="-m-1.5 p-1.5">
            <img alt="Patronos" src="/Logo-Patronos-Completo.svg" className="h-14 w-auto" />
          </Link>
          <div className="flex items-center gap-x-6">
            <span className="text-sm font-semibold text-gray-900">Admin</span>
            <button onClick={signOut}
              className="flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:text-red-700">
              <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Sair
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}

function CenteredLoader({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"
          style={{ borderColor: '#ff9700 transparent #ff9700 #ff9700' }}></div>
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  )
}
