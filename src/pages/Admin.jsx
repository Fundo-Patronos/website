import { useState, useEffect, useCallback, useRef } from 'react'
import { Navigate, Link } from 'react-router-dom'
import Papa from 'papaparse'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline'

const TABS = [
  { id: 'dashboard',   label: 'Dashboard'          },
  { id: 'donors',      label: 'Doadores'           },
  { id: 'add-pix',     label: 'Adicionar PIX'      },
  { id: 'add-profile', label: 'Cadastrar Perfil'   },
  { id: 'doare',       label: 'Doa.re (Import CSV)'},
  { id: 'rules',       label: 'Regras de Categoria'},
  { id: 'admins',      label: 'Admins'             },
]

// Formata número compacto (R$ 215.964,93 → "R$ 216k")
function formatCompact(n) {
  if (n == null || !Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000)     return `R$ ${Math.round(n / 1000)}k`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
}

const MONTH_LABELS_PT = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}
function monthLabel(yyyymm) {
  const [y, m] = yyyymm.split('-')
  return `${MONTH_LABELS_PT[m]}/${y.slice(2)}`
}

// Parser de número Brasileiro: "1.062,05" → 1062.05
function parseBRNumber(s) {
  if (s == null || s === '') return null
  if (typeof s === 'number') return s
  const cleaned = String(s).replace(/\./g, '').replace(',', '.').trim()
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

// ISO "2026-05-09T00:00:00.000Z" → "2026-05-09"
function isoToDate(s) {
  if (!s) return null
  try {
    return new Date(s).toISOString().split('T')[0]
  } catch {
    return null
  }
}

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

// ====================== TAB: Dashboard ======================
function DashboardTab({ getToken }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const token = await getToken()
        const r = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Erro')
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [getToken])

  if (loading) return <p className="text-gray-600">Carregando dashboard...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>
  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard label="Total captado" value={formatCompact(stats.totals.lifetimeRaised)} sub={`${stats.totals.eventCount} doações`} highlight />
        <DashCard label="Este ano" value={formatCompact(stats.totals.yearRaised)} />
        <DashCard label="Este mês" value={formatCompact(stats.totals.monthRaised)} />
        <DashCard label="Ticket médio" value={formatCurrency(stats.totals.avgDonation)} />
        <DashCard label="Doadores cadastrados" value={stats.totals.donorCount} />
        <DashCard label="Assinantes ativos" value={stats.totals.subscriberCount} sub={`de ${stats.totals.donorCount}`} />
        <DashCard label="Doadores com doação" value={stats.totals.withDonationsCount} sub={`${Math.round(stats.totals.withDonationsCount / Math.max(stats.totals.donorCount, 1) * 100)}% do total`} />
        <DashCard label="Emails órfãos" value={stats.totals.orphanDonorCount} sub="eventos sem perfil" tone={stats.totals.orphanDonorCount > 0 ? 'warning' : 'neutral'} />
      </div>

      {/* Monthly timeline */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Captação mensal — últimos 12 meses</h3>
        <MonthlyTimeline timeline={stats.monthlyTimeline} />
      </section>

      {/* Two-column: distributions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Distribuição por categoria</h3>
          <DistributionBars
            items={stats.byCategory}
            getLabel={(r) => r.categoria}
            getCount={(r) => r.count}
            getTotal={(r) => r.total}
            colorOf={(r) =>
              r.categoria === 'Patrono'   ? BRAND_GRADIENT :
              r.categoria === 'Associado' ? 'linear-gradient(90deg, #ff9700, #ff6253)' :
                                            'linear-gradient(90deg, #d1d5db, #9ca3af)'
            }
          />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Distribuição por fonte</h3>
          <DistributionBars
            items={stats.bySource}
            getLabel={(r) => r.source}
            getCount={(r) => r.count}
            getTotal={(r) => r.total}
            colorOf={(r) =>
              r.source === 'doare' ? 'linear-gradient(90deg, #c964e2, #fc4696)' :
              r.source === 'pix'   ? 'linear-gradient(90deg, #ff9700, #ff6253)' :
                                     'linear-gradient(90deg, #9ca3af, #6b7280)'
            }
          />
        </section>
      </div>

      {/* Two-column: top donors + recent events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Top 10 doadores</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {stats.topDonors.map((d, i) => (
                  <tr key={d.email}>
                    <td className="py-2 pr-2 text-right text-xs text-gray-400 w-6">{i + 1}</td>
                    <td className="py-2 pr-3">
                      <div className="font-medium text-gray-900">{d.nome}</div>
                      <div className="font-mono text-xs text-gray-500">{d.email}</div>
                    </td>
                    <td className="py-2 px-2"><CategoriaBadge value={d.categoria} /></td>
                    <td className="py-2 pl-2 text-right font-semibold text-gray-900">{formatCurrency(d.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Eventos recentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {stats.recentEvents.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{e.occurredAt}</td>
                    <td className="py-2 pr-2 font-mono text-xs text-gray-700 truncate max-w-[180px]" title={e.email}>{e.email}</td>
                    <td className="py-2 pr-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.source === 'doare' ? 'bg-purple-50 text-purple-700' :
                        e.source === 'pix' ? 'bg-orange-50 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{e.source}</span>
                    </td>
                    <td className="py-2 pl-2 text-right font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function DashCard({ label, value, sub, tone = 'neutral', highlight = false }) {
  const toneClasses = {
    neutral: 'border-gray-200 bg-white',
    warning: 'border-amber-200 bg-amber-50',
  }[tone]
  return (
    <div className={`rounded-lg border p-4 ${toneClasses}`}
      style={highlight ? { background: BRAND_GRADIENT, borderColor: 'transparent' } : undefined}>
      <p className={`text-xs uppercase tracking-wide ${highlight ? 'text-white/80' : 'text-gray-500'}`}>{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{sub}</p>}
    </div>
  )
}

function MonthlyTimeline({ timeline }) {
  if (!timeline?.length) return <p className="text-gray-500 text-sm">Sem dados.</p>
  const maxTotal = Math.max(...timeline.map((m) => m.total), 1)
  const grandTotal = timeline.reduce((s, m) => s + m.total, 0)
  return (
    <div>
      <div className="flex items-end gap-1 h-48 border-b border-gray-200">
        {timeline.map((m) => {
          const heightPct = (m.total / maxTotal) * 100
          return (
            <div key={m.month} className="flex flex-1 flex-col items-center justify-end h-full group relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {formatCurrency(m.total)} · {m.count} doação{m.count === 1 ? '' : 'ões'}
              </div>
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${heightPct}%`,
                  minHeight: m.total > 0 ? '2px' : '0',
                  background: BRAND_GRADIENT,
                  opacity: m.total > 0 ? 1 : 0.15,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 mt-2">
        {timeline.map((m) => (
          <div key={m.month} className="flex-1 text-center text-xs text-gray-500">
            {monthLabel(m.month)}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Total no período: <strong>{formatCurrency(grandTotal)}</strong>
        {' · '}
        {timeline.reduce((s, m) => s + m.count, 0)} doações
      </p>
    </div>
  )
}

function DistributionBars({ items, getLabel, getCount, getTotal, colorOf }) {
  if (!items?.length) return <p className="text-gray-500 text-sm">Sem dados.</p>
  const maxTotal = Math.max(...items.map(getTotal), 1)
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const total = getTotal(item)
        const widthPct = (total / maxTotal) * 100
        return (
          <div key={getLabel(item)}>
            <div className="flex items-baseline justify-between text-sm mb-1">
              <span className="font-medium text-gray-900 capitalize">{getLabel(item)}</span>
              <span className="text-gray-600">
                <strong>{formatCurrency(total)}</strong>
                <span className="ml-2 text-xs text-gray-500">{getCount(item)} {getCount(item) === 1 ? 'item' : 'itens'}</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${Math.max(widthPct, 3)}%`, background: colorOf(item) }} />
            </div>
          </div>
        )
      })}
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

// ====================== TAB: Doa.re (Import CSV) ======================
function DoareTab({ getToken, onSuccess }) {
  const [step, setStep] = useState('idle') // idle | parsing | preview | importing | done
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [profilesResult, setProfilesResult] = useState(null)
  const [eventsResult, setEventsResult] = useState(null)
  const fileInputRef = useRef(null)

  const reset = () => {
    setStep('idle')
    setPreview(null)
    setError(null)
    setProfilesResult(null)
    setEventsResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFile = async (file) => {
    if (!file) return
    setError(null)
    setStep('parsing')
    setPreview(null)
    setProfilesResult(null)
    setEventsResult(null)

    try {
      const text = await file.text()
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      })

      // PapaParse não dá fatal error pra warnings; só logamos
      if (parsed.errors.length > 0) {
        console.warn('CSV parse warnings:', parsed.errors.slice(0, 5))
      }

      // Mapeia as colunas do CSV pra shape esperado pelo backend
      const rows = parsed.data.map((row) => ({
        id: row['ID'],
        email: row['Email'],
        nome: row['Nome'],
        tipo: row['Tipo'],
        status: row['Status'],
        valorBruto: parseBRNumber(row['Valor Bruto']),
        valorLiquido: parseBRNumber(row['Valor Líquido']),
        dataPagamento: isoToDate(row['Data de pagamento']),
        periodicidade: row['Periodicidade (Assinatura)'] || null,
        idAssinatura: row['ID Assinatura'] || null,
      }))

      const token = await getToken()
      const r = await fetch('/api/admin/doare-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rows }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro ao analisar')
      setPreview(data)
      setStep('preview')
    } catch (err) {
      console.error(err)
      setError(err.message)
      setStep('idle')
    }
  }

  const handleCommit = async (mode) => {
    setError(null)
    setStep('importing')
    try {
      const token = await getToken()
      const body = mode === 'profiles'
        ? { mode: 'profiles', profiles: preview.newProfiles }
        : { mode: 'events',   events: preview.newEvents   }
      const r = await fetch('/api/admin/doare-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro ao salvar')
      if (mode === 'profiles') setProfilesResult(data)
      else setEventsResult(data)
      setStep('preview')
      onSuccess?.()
    } catch (err) {
      setError(err.message)
      setStep('preview')
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-6">
      {/* DROP ZONE */}
      {step === 'idle' || step === 'parsing' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
            dragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm font-medium text-gray-700">
            {step === 'parsing' ? 'Analisando CSV...' : 'Arraste o CSV doa.re aqui ou clique para selecionar'}
          </p>
          <p className="mt-1 text-xs text-gray-500">Apenas linhas com Status "Paga" são consideradas</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <DocumentArrowUpIcon className="h-6 w-6 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">CSV analisado — confira preview abaixo</span>
          </div>
          <button
            onClick={reset}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Recomeçar
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PREVIEW STATS */}
      {preview && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Linhas totais" value={preview.stats.totalRows} />
            <StatCard label="Não pagas (ignoradas)" value={preview.stats.skippedNotPaid} tone={preview.stats.skippedNotPaid > 0 ? 'warning' : 'neutral'} />
            <StatCard label="Emails únicos" value={preview.stats.uniqueEmails} />
            <StatCard label="Linhas válidas" value={preview.stats.validRows} tone="success" />
          </div>

          {/* PERFIS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Perfis novos a inserir: <span className="text-orange-600">{preview.stats.newProfileCount}</span>
              </h3>
              <span className="text-sm text-gray-500">{preview.stats.existingProfileCount} já cadastrados (não tocados)</span>
            </div>

            {profilesResult ? (
              <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>✓ {profilesResult.inserted} perfis inseridos | {profilesResult.skipped} pulados (já existiam) | {profilesResult.failed} falhas</span>
              </div>
            ) : preview.newProfiles.length > 0 ? (
              <>
                <DoareProfilesTable profiles={preview.newProfiles} />
                <button
                  onClick={() => handleCommit('profiles')}
                  disabled={step === 'importing'}
                  className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 sm:w-auto sm:px-6"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {step === 'importing' ? 'Inserindo...' : `Inserir ${preview.newProfiles.length} perfis novos`}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-600">Nenhum perfil novo — todos os emails já estão cadastrados.</p>
            )}
          </section>

          {/* EVENTOS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Transações novas a inserir: <span className="text-orange-600">{preview.stats.newEventCount}</span>
              </h3>
              <span className="text-sm text-gray-500">{preview.stats.existingEventCount} já registradas (dedup por ID)</span>
            </div>

            {eventsResult ? (
              <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>✓ {eventsResult.inserted} eventos inseridos | {eventsResult.skipped} pulados | {eventsResult.failed} falhas</span>
              </div>
            ) : preview.newEvents.length > 0 ? (
              <>
                <DoareEventsTable events={preview.newEvents} />
                {!profilesResult && preview.newProfiles.length > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    ⚠️ Tem perfis novos não inseridos acima. Eventos podem ser inseridos mesmo assim, mas ficam órfãos até o perfil ser cadastrado.
                  </p>
                )}
                <button
                  onClick={() => handleCommit('events')}
                  disabled={step === 'importing'}
                  className="w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 sm:w-auto sm:px-6"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {step === 'importing' ? 'Inserindo...' : `Inserir ${preview.newEvents.length} transações novas`}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-600">Nenhuma transação nova — todas já estão registradas.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, tone = 'neutral' }) {
  const colors = {
    neutral: 'border-gray-200 bg-white text-gray-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
  }[tone]
  return (
    <div className={`rounded-lg border p-4 ${colors}`}>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

function DoareProfilesTable({ profiles }) {
  const PREVIEW_LIMIT = 50
  const shown = profiles.slice(0, PREVIEW_LIMIT)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Assinatura</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700"># Tx</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {shown.map((p) => (
            <tr key={p.email} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-700">{p.email}</td>
              <td className="px-4 py-3 text-gray-900">{p.nome}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.tipoContribuicao === 'Recorrente' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}>{p.tipoContribuicao}</span>
              </td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(p.valorAssinatura)}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(p.totalAmount)}</td>
              <td className="px-4 py-3 text-right text-gray-500">{p.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {profiles.length > PREVIEW_LIMIT && (
        <p className="px-4 py-2 text-xs text-gray-500">
          Mostrando primeiros {PREVIEW_LIMIT} de {profiles.length}. Todos serão inseridos.
        </p>
      )}
    </div>
  )
}

function DoareEventsTable({ events }) {
  const PREVIEW_LIMIT = 50
  const shown = events.slice(0, PREVIEW_LIMIT)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Data</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">ID doa.re</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {shown.map((e) => (
            <tr key={e.sourceId} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700">{e.occurredAt}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-700">{e.email}</td>
              <td className="px-4 py-3 text-gray-700">{e.tipo}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(e.amount)}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{e.sourceId.slice(0, 8)}…</td>
            </tr>
          ))}
        </tbody>
      </table>
      {events.length > PREVIEW_LIMIT && (
        <p className="px-4 py-2 text-xs text-gray-500">
          Mostrando primeiros {PREVIEW_LIMIT} de {events.length}. Todos serão inseridos.
        </p>
      )}
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

// ====================== TAB: Admins ======================
function AdminsTab({ getToken }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/admins', { headers: { Authorization: `Bearer ${token}` } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setAdmins(data.admins)
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)
    try {
      const token = await getToken()
      const r = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({ type: 'success', msg: `${data.email} agora é admin.` })
      setEmail('')
      load()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (a) => {
    if (a.isCurrentUser) return
    if (!window.confirm(`Remover ${a.email} da lista de admins?`)) return
    try {
      const token = await getToken()
      const r = await fetch(`/api/admin/admins?email=${encodeURIComponent(a.email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro')
      setFeedback({
        type: data.warning ? 'warning' : 'success',
        msg: data.warning || `${a.email} removido da lista de admins.`,
      })
      load()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Adicionar admin</h3>
        <p className="mt-1 mb-4 text-sm text-gray-600">
          O novo admin precisa fazer login uma vez em <code className="bg-gray-100 px-1">/doador/login</code> com esse email
          (qualquer método: Google, email/senha ou magic link) — depois ele já consegue acessar <code className="bg-gray-100 px-1">/admin</code>.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="novo-admin@exemplo.com"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button type="submit" disabled={submitting}
            className="rounded-md py-2.5 px-6 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            style={{ background: BRAND_GRADIENT }}>
            {submitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
        {feedback && (
          <div className={`mt-3 flex items-start gap-2 rounded-md p-3 text-sm ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800' :
            feedback.type === 'warning' ? 'bg-amber-50 text-amber-800' :
            'bg-red-50 text-red-800'
          }`}>
            {feedback.type === 'success'
              ? <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              : <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />}
            <span>{feedback.msg}</span>
          </div>
        )}
      </form>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Admins atuais</h3>
        {loading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : !admins.length ? (
          <p className="text-gray-600">Nenhum admin na tabela (mas <code className="bg-gray-100 px-1">ADMIN_EMAILS</code> env var continua valendo).</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Adicionado por</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Quando</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {admins.map((a) => (
                  <tr key={a.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-gray-700">{a.email}</div>
                      <div className="mt-1 flex gap-1">
                        {a.isCurrentUser && (
                          <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">você</span>
                        )}
                        {a.isBootstrap && (
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700" title="Também em ADMIN_EMAILS env var">
                            env
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{a.addedBy || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{new Date(a.addedAt).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleRemove(a)}
                          disabled={a.isCurrentUser}
                          title={a.isCurrentUser ? 'Não pode remover você mesmo' : 'Remover admin'}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-gray-500">
              {admins.length} admin{admins.length === 1 ? '' : 's'} ·
              Etiqueta <span className="rounded bg-blue-50 px-1 text-blue-700">env</span> = também no <code>ADMIN_EMAILS</code> (mesmo se removido aqui, mantém acesso).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ====================== PÁGINA ======================
export default function Admin() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
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

        {activeTab === 'dashboard' && (
          <DashboardTab getToken={getToken} />
        )}
        {activeTab === 'donors' && (
          <DonorsTab donors={donors} loading={donorsLoading} />
        )}
        {activeTab === 'add-pix' && (
          <AddPixTab getToken={getToken} events={events} eventsLoading={eventsLoading} onSuccess={reloadAll} />
        )}
        {activeTab === 'add-profile' && (
          <AddProfileTab getToken={getToken} donors={donors} donorsLoading={donorsLoading} onSuccess={reloadAll} />
        )}
        {activeTab === 'doare' && (
          <DoareTab getToken={getToken} onSuccess={reloadAll} />
        )}
        {activeTab === 'rules' && (
          <RulesTab getToken={getToken} onChanged={reloadAll} />
        )}
        {activeTab === 'admins' && (
          <AdminsTab getToken={getToken} />
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
