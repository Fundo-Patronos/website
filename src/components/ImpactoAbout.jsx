export default function ImpactoAbout({ 
  categoryText,
  title,
  paragraphs,
  stats,
  learnMoreText,
  learnMoreLink,
  imageUrl 
}) {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-4">
            <div className="relative overflow-hidden rounded-3xl bg-gray-100 px-6 pt-64 pb-9 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
              <img
                alt=""
                src={imageUrl || "https://picsum.photos/800/600?random=10"}
                className="absolute inset-0 size-full rounded-3xl object-cover"
              />
            </div>
          </div>
          <div>
            <div className="text-base/7 text-gray-700 lg:max-w-lg">
              <p className="text-base/7 font-semibold" style={{color: '#ff9700'}}>{categoryText}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                {title}
              </h1>
              <div className="max-w-xl">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="mt-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            {stats && stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4">
                {stats.map((stat, statIdx) => (
                  <div key={statIdx}>
                    <dt className="text-sm/6 font-semibold text-gray-600">{stat.label}</dt>
                    <dd className="mt-2 text-3xl/10 font-bold tracking-tight text-gray-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {learnMoreText && (
              <div className="mt-10 flex">
                <a href={learnMoreLink} className="text-base/7 font-semibold hover:opacity-80" style={{color: '#ff9700'}}>
                  {learnMoreText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}