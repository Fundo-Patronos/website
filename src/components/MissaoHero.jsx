export default function MissaoHero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-orange-100/20 pt-14">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-orange-600/10 ring-orange-50 sm:-mr-80 lg:-mr-96"
      />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-semibold leading-7 text-gray-600">Nossa Missão</p>
          <h1
            className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{
              background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Desenvolver os líderes que farão a diferença no mundo
          </h1>
          <p className="mt-8 text-lg leading-8 text-gray-600 text-pretty">
            Desenvolvemos pessoas. E pessoas transformam o mundo.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
    </div>
  )
}
