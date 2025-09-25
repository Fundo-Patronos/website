import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

/**
 * Advanced Navbar with Hover Flyout Menus
 *
 * A professional navbar component with:
 * - Responsive design (mobile hamburger menu)
 * - Hover-activated flyout menus with 150ms delay
 * - Smooth transitions and animations
 * - Customizable content and styling
 *
 * Dependencies required:
 * - @headlessui/react
 * - @heroicons/react
 * - tailwindcss
 */

// Default social media icons (can be overridden via props)
const DefaultLinkedInIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const DefaultInstagramIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
  </svg>
)

const DefaultYouTubeIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// Flyout Menu Component
function FlyoutMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  leftColumn,
  rightColumn,
  featuredPosts = [],
  className = ""
}) {
  if (!isOpen) return null

  return (
    <div
      className={`absolute inset-x-0 top-full bg-white shadow-lg ring-1 ring-gray-900/5 z-50 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 sm:gap-x-8">
            {leftColumn && (
              <div>
                <h3 className="text-sm leading-6 font-medium text-gray-500">{leftColumn.title}</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {leftColumn.items.map((item, index) => {
                      const ItemComponent = item.isRouter ? 'div' : 'a'
                      return (
                        <ItemComponent
                          key={item.name || index}
                          href={!item.isRouter ? item.href : undefined}
                          onClick={() => {
                            if (item.onClick) item.onClick()
                            onClose()
                          }}
                          target={item.target}
                          rel={item.rel}
                          className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          {item.icon && <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />}
                          {item.name}
                        </ItemComponent>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {rightColumn && (
              <div>
                <h3 className="text-sm leading-6 font-medium text-gray-500">{rightColumn.title}</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {rightColumn.items.map((item, index) => (
                      <a
                        key={item.name || index}
                        href={item.href}
                        onClick={() => {
                          if (item.onClick) item.onClick()
                          onClose()
                        }}
                        target={item.target}
                        rel={item.rel}
                        className="flex gap-x-4 py-2 text-sm leading-6 font-semibold text-gray-900 hover:text-red-700 transition-colors"
                      >
                        {item.icon && <item.icon aria-hidden="true" className="size-6 flex-none text-gray-400" />}
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
              <h3 className="sr-only">Featured Posts</h3>
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id || index}
                  className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
                >
                  <div className="relative flex-none">
                    <img
                      alt=""
                      src={post.imageUrl}
                      className="aspect-[2/1] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto"
                    />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-gray-900/10 ring-inset" />
                  </div>
                  <div>
                    <div className="flex items-center gap-x-4">
                      <time dateTime={post.datetime} className="text-sm leading-6 text-gray-600">
                        {post.date}
                      </time>
                      <a
                        href={post.category?.href}
                        onClick={onClose}
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                      >
                        {post.category?.title}
                      </a>
                    </div>
                    <h4 className="mt-2 text-sm leading-6 font-semibold text-gray-900">
                      <a href={post.href} onClick={onClose}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{post.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Navbar Component
export default function AdvancedNavbar({
  // Logo configuration
  logoSrc = "/logo.svg",
  logoAlt = "Company Logo",
  logoHref = "/",
  logoClassName = "h-16 w-auto",

  // Brand colors (supports gradient or solid colors)
  primaryColor = "linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)",
  hoverColor = "#ff9700",

  // Navigation items
  homeHref = "/",
  homeLabel = "Home",
  menuItems = [], // Array of menu items with dropdowns
  additionalLinks = [], // Simple links without dropdowns

  // CTA button
  ctaText = "Get Started",
  ctaHref = "#",
  ctaTarget = "_self",

  // Mobile menu config
  mobileMenuClassName = "",

  // Custom class names
  className = "",

  // Navigation type (if using React Router, pass Link component)
  LinkComponent = 'a',

  // Callbacks
  onMenuItemClick,
  onCtaClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState({})
  const [menuTimeouts, setMenuTimeouts] = useState({})

  // Handle mouse enter/leave for flyout menus with proper cleanup
  const handleMenuEnter = (menuKey) => {
    if (menuTimeouts[menuKey]) {
      clearTimeout(menuTimeouts[menuKey])
      setMenuTimeouts(prev => ({ ...prev, [menuKey]: null }))
    }
    setOpenMenus(prev => ({ ...prev, [menuKey]: true }))
  }

  const handleMenuLeave = (menuKey) => {
    const timeout = setTimeout(() => {
      setOpenMenus(prev => ({ ...prev, [menuKey]: false }))
      setMenuTimeouts(prev => ({ ...prev, [menuKey]: null }))
    }, 150)
    setMenuTimeouts(prev => ({ ...prev, [menuKey]: timeout }))
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(menuTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [menuTimeouts])

  const isPrimaryColorGradient = primaryColor.includes('gradient')

  return (
    <header className={`bg-white relative z-50 ${className}`}>
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <LinkComponent to={logoHref} href={logoHref} className="-m-1.5 p-1.5">
            <span className="sr-only">{logoAlt}</span>
            <img
              alt={logoAlt}
              src={logoSrc}
              className={logoClassName}
            />
          </LinkComponent>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {/* Home link */}
          <LinkComponent
            to={homeHref}
            href={homeHref}
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-red-700 transition-colors px-2 py-1"
          >
            {homeLabel}
          </LinkComponent>

          {/* Menu items with dropdowns */}
          {menuItems.map((menu, index) => (
            <div
              key={menu.key || index}
              onMouseEnter={() => handleMenuEnter(menu.key || index)}
              onMouseLeave={() => handleMenuLeave(menu.key || index)}
              className="relative"
            >
              <button
                className={`flex items-center gap-x-1 text-sm font-semibold leading-6 transition-all duration-200 px-2 py-1 rounded-lg border ${
                  openMenus[menu.key || index]
                    ? 'text-gray-900 border-gray-300 hover:text-red-700'
                    : 'text-gray-900 border-transparent hover:text-red-700'
                }`}
              >
                {menu.label}
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`size-5 flex-none transition-transform duration-200 ${
                    openMenus[menu.key || index] ? 'text-gray-600 rotate-180' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          ))}

          {/* Additional simple links */}
          {additionalLinks.map((link, index) => (
            <LinkComponent
              key={link.key || index}
              to={link.href}
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-red-700 transition-colors px-2 py-1"
              onClick={link.onClick}
            >
              {link.label}
            </LinkComponent>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <LinkComponent
            to={ctaHref}
            href={ctaHref}
            target={ctaTarget}
            rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: isPrimaryColorGradient ? primaryColor : primaryColor,
              focusVisibleOutlineColor: hoverColor
            }}
            onClick={onCtaClick}
          >
            {ctaText} <span aria-hidden="true">&rarr;</span>
          </LinkComponent>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 ${mobileMenuClassName}`}>
          <div className="flex items-center justify-between">
            <LinkComponent to={logoHref} href={logoHref} className="-m-1.5 p-1.5">
              <span className="sr-only">{logoAlt}</span>
              <img
                alt={logoAlt}
                src={logoSrc}
                className="h-12 w-auto"
              />
            </LinkComponent>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <LinkComponent
                  to={homeHref}
                  href={homeHref}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {homeLabel}
                </LinkComponent>

                {/* Mobile dropdowns */}
                {menuItems.map((menu, index) => (
                  <Disclosure key={menu.key || index} as="div" className="-mx-3">
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {menu.label}
                      <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-2">
                      {/* Combine left and right column items for mobile */}
                      {[
                        ...(menu.leftColumn?.items || []),
                        ...(menu.rightColumn?.items || [])
                      ].map((item, itemIndex) => (
                        <DisclosureButton
                          key={item.name || itemIndex}
                          as={item.isRouter ? LinkComponent : 'a'}
                          to={item.isRouter ? item.href : undefined}
                          href={!item.isRouter ? item.href : item.href}
                          target={item.target}
                          rel={item.rel}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => {
                            if (item.onClick) item.onClick()
                            setMobileMenuOpen(false)
                          }}
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {/* Mobile additional links */}
                {additionalLinks.map((link, index) => (
                  <LinkComponent
                    key={link.key || index}
                    to={link.href}
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                      if (link.onClick) link.onClick()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {link.label}
                  </LinkComponent>
                ))}
              </div>
              <div className="py-6">
                <LinkComponent
                  to={ctaHref}
                  href={ctaHref}
                  target={ctaTarget}
                  rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    if (onCtaClick) onCtaClick()
                    setMobileMenuOpen(false)
                  }}
                >
                  {ctaText}
                </LinkComponent>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Flyout menus */}
      {menuItems.map((menu, index) => (
        <FlyoutMenu
          key={menu.key || index}
          isOpen={openMenus[menu.key || index]}
          onClose={() => setOpenMenus(prev => ({ ...prev, [menu.key || index]: false }))}
          onMouseEnter={() => handleMenuEnter(menu.key || index)}
          onMouseLeave={() => handleMenuLeave(menu.key || index)}
          leftColumn={menu.leftColumn}
          rightColumn={menu.rightColumn}
          featuredPosts={menu.featuredPosts}
          className={menu.className}
        />
      ))}
    </header>
  )
}

// Export additional components for advanced usage
export { FlyoutMenu, DefaultLinkedInIcon, DefaultInstagramIcon, DefaultYouTubeIcon }