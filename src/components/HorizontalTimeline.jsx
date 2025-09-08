function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function HorizontalTimeline({ 
  title, 
  description, 
  steps,
  className = ""
}) {
  return (
    <div className={`bg-white py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{title}</h2>
          <p className="mt-2 text-lg text-gray-600">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-6xl">
          <nav aria-label="Progress" className="overflow-x-auto">
            <ol role="list" className="flex items-center justify-center gap-8 min-w-full px-4">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative flex-1 flex flex-col items-center">
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div 
                        aria-hidden="true" 
                        className="absolute top-4 h-0.5 bg-gray-300"
                        style={{left: 'calc(50% + 16px)', width: 'calc(100% + 16px)'}}
                      />
                    ) : null}
                    <div className="relative flex flex-col items-center text-center max-w-32">
                      <span className="flex items-center justify-center mb-3">
                        <span 
                          className="relative z-10 flex size-8 items-center justify-center rounded-full p-0.5"
                          style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}
                        >
                          <span className="flex size-full items-center justify-center rounded-full bg-white">
                            <span 
                              className="size-2.5 rounded-full"
                              style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)'}}
                            />
                          </span>
                        </span>
                      </span>
                      <span className="flex flex-col">
                        <span 
                          className="text-sm font-medium mb-1"
                          style={{background: 'linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}
                        >
                          {step.name}
                        </span>
                        <span className="text-xs text-gray-500 leading-tight h-12 flex items-start">{step.description}</span>
                      </span>
                    </div>
                  </>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}