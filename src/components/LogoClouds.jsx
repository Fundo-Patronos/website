import { cn } from "../lib/utils";

function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      data-slot="marquee"
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            data-slot="marquee-item"
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

function Logo({
  className,
  name,
  width = 158,
  height = 48,
  showName = false,
  src,
  ...props
}) {
  return (
    <div
      data-slot="logo"
      className={cn("flex items-center gap-2 text-sm font-medium", className)}
      {...props}
    >
      <img
        src={src}
        alt={name}
        width={width}
        height={height}
        className="max-h-12 w-full object-contain opacity-70"
      />
      <span className={cn(!showName && "sr-only")}>{name}</span>
    </div>
  );
}

export default function LogoClouds({
  title = "Líderes das melhores empresas confiam em nós",
  logos = [
    <Logo
      key="logo1"
      name="Parceiro 1"
      src="/Company Logos/1.svg"
    />,
    <Logo
      key="logo2"
      name="Parceiro 2"
      src="/Company Logos/2.svg"
    />,
    <Logo
      key="logo3"
      name="Parceiro 3"
      src="/Company Logos/3.svg"
    />,
    <Logo
      key="logo4"
      name="Parceiro 4"
      src="/Company Logos/4.svg"
    />,
    <Logo
      key="logo4b"
      name="Parceiro 4b"
      src="/Company Logos/4 2.svg"
    />,
    <Logo
      key="logo6"
      name="Parceiro 6"
      src="/Company Logos/6.svg"
    />,
    <Logo
      key="logo7"
      name="Parceiro 7"
      src="/Company Logos/7.svg"
    />,
    <Logo
      key="logo7b"
      name="Parceiro 7b"
      src="/Company Logos/7 2.svg"
    />,
    <Logo
      key="logo9"
      name="Parceiro 9"
      src="/Company Logos/9.svg"
    />,
    <Logo
      key="logo10"
      name="Parceiro 10"
      src="/Company Logos/10.svg"
    />,
    <Logo
      key="logo11"
      name="Parceiro 11"
      src="/Company Logos/11.svg"
    />,
    <Logo
      key="logo12"
      name="Parceiro 12"
      src="/Company Logos/12.svg"
    />,
  ],
  duration = "20s",
  gap = "3rem",
  pauseOnHover = true,
  showGradients = true,
  className,
}) {
  return (
    <section className={cn("bg-white py-12 sm:py-16", className)}>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee
            pauseOnHover={pauseOnHover}
            className={`[--duration:${duration}] [--gap:${gap}]`}
          >
            {logos}
          </Marquee>
          {showGradients && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white hidden sm:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white hidden sm:block" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}