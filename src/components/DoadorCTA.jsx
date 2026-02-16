export default function DoadorCTA() {
  return (
    <div className="mt-10 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Fazer nova doacao</h3>
        <div className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          <p>
            Continue apoiando o Fundo Patronos e contribuindo para o futuro da educacao na Unicamp.
            Sua generosidade transforma vidas e impulsiona a inovacao.
          </p>
        </div>
        <div className="mt-5">
          <a
            href="https://doa.re/patronos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
          >
            Doar Agora
          </a>
        </div>
        <div className="mt-4 rounded-md bg-gray-50 p-4">
          <p className="text-sm leading-6 text-gray-600">
            <span className="font-semibold text-gray-900">Doacao via PIX:</span>{' '}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-sm text-gray-800">operacoes@patronos.org</code>
          </p>
        </div>
      </div>
    </div>
  )
}
