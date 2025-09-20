export default function ImpactoHero({ 
  announcementText,
  announcementLink,
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink 
}) {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-20 lg:py-24">
          {announcementText && (
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                {announcementText}{' '}
                {announcementLink && (
                  <a href={announcementLink} className="font-semibold" style={{color: '#ff9700'}}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    Saiba mais <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </div>
          )}
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              {title}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              {description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {primaryButtonText && (
                <a
                  href={primaryButtonLink}
                  target={primaryButtonLink && primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={primaryButtonLink && primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)',
                    focusVisibleOutlineColor: '#ff9700'
                  }}
                >
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href={secondaryButtonLink}
                  target={secondaryButtonLink && secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={secondaryButtonLink && secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  {secondaryButtonText} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}