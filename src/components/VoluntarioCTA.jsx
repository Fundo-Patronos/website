export default function VoluntarioCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Faça a diferença na comunidade da Unicamp. Seja um voluntário.
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
          <a
            href="https://tally.so/r/QKD6B8"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-5 py-3 text-sm font-semibold text-white shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)' }}
          >
            Quero ser voluntário
          </a>
        </div>
      </div>
    </div>
  )
}
