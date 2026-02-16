export default function DoadorCTA() {
  return (
    <div className="mt-8 bg-white shadow-sm sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">Fazer nova doacao</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Continue apoiando o Fundo Patronos e contribuindo para o futuro da educacao na Unicamp.
            Sua generosidade transforma vidas e impulsiona a inovacao.
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href="https://doa.re/patronos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
            style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
          >
            Doar Agora
          </a>
        </div>
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Doacao via PIX:</span>{' '}
            <span className="font-mono text-gray-700">operacoes@patronos.org</span>
          </p>
        </div>
      </div>
    </div>
  )
}
