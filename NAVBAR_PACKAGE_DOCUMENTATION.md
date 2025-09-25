# Advanced Navbar with Flyout Menus - Reusable Component Package

## Overview

A professional, fully-featured navbar component with hover-activated flyout menus, smooth transitions, and responsive design. This package extracts the navigation system from the Fundo Patronos website into a reusable component that can be used in any React project.

## Features

✅ **Responsive Design**: Mobile-first with hamburger menu
✅ **Hover Flyout Menus**: 150ms delay with smooth transitions
✅ **Customizable Styling**: Support for gradients and solid colors
✅ **Router Agnostic**: Works with React Router, Next.js, or standard links
✅ **Accessible**: ARIA labels and keyboard navigation
✅ **TypeScript Ready**: Props are clearly defined
✅ **Mobile Optimized**: Collapsible menu with proper touch interactions

## Dependencies

```bash
npm install @headlessui/react @heroicons/react tailwindcss
```

## Basic Usage

```jsx
import AdvancedNavbar from './NavbarPackage'

function App() {
  return (
    <AdvancedNavbar
      logoSrc="/your-logo.svg"
      logoAlt="Your Company"
      ctaText="Get Started"
      ctaHref="/signup"
      menuItems={[
        {
          key: 'about',
          label: 'About Us',
          leftColumn: {
            title: 'Company',
            items: [
              { name: 'Our Story', href: '/about', icon: SomeIcon },
              { name: 'Team', href: '/team', icon: SomeIcon }
            ]
          },
          featuredPosts: [
            {
              title: 'Latest News',
              href: '/news',
              date: 'Oct 2024',
              imageUrl: '/news-image.jpg',
              description: 'Check out our latest updates...'
            }
          ]
        }
      ]}
    />
  )
}
```

## Configuration Options

### Logo Configuration
```jsx
<AdvancedNavbar
  logoSrc="/path-to-logo.svg"           // Logo image path
  logoAlt="Company Name"                // Alt text for logo
  logoHref="/"                          // Logo click destination
  logoClassName="h-16 w-auto"           // Logo CSS classes
/>
```

### Colors & Branding
```jsx
<AdvancedNavbar
  // Gradient background (recommended)
  primaryColor="linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)"

  // Or solid color
  primaryColor="#ff6253"

  // Hover color for interactive elements
  hoverColor="#ff9700"
/>
```

### Navigation Items
```jsx
const menuItems = [
  {
    key: 'services',                     // Unique identifier
    label: 'Services',                   // Button text
    leftColumn: {
      title: 'Our Services',             // Column header
      items: [
        {
          name: 'Web Design',             // Link text
          href: '/services/web',          // Destination
          icon: GlobeIcon,                // Heroicon component
          isRouter: true,                 // Use router navigation
          onClick: () => console.log('clicked')
        }
      ]
    },
    rightColumn: {                       // Optional second column
      title: 'Resources',
      items: [
        {
          name: 'Documentation',
          href: '/docs',
          icon: BookIcon,
          target: '_blank',               // Open in new tab
          rel: 'noopener noreferrer'
        }
      ]
    },
    featuredPosts: [                     // Optional featured content
      {
        id: 1,
        title: 'New Feature Launch',
        href: '/blog/new-feature',
        date: 'October 2024',
        datetime: '2024-10',
        imageUrl: '/feature-image.jpg',
        description: 'Discover our latest feature...',
        category: {
          title: 'Product',
          href: '/blog/product'
        }
      }
    ]
  }
]
```

### Simple Links (no dropdowns)
```jsx
const additionalLinks = [
  {
    key: 'pricing',
    label: 'Pricing',
    href: '/pricing'
  },
  {
    key: 'contact',
    label: 'Contact',
    href: '/contact',
    target: '_blank'
  }
]
```

### CTA Button
```jsx
<AdvancedNavbar
  ctaText="Start Free Trial"           // Button text
  ctaHref="/signup"                    // Destination
  ctaTarget="_self"                    // Link target
  onCtaClick={() => trackEvent('cta_clicked')}
/>
```

## React Router Integration

```jsx
import { Link } from 'react-router-dom'
import AdvancedNavbar from './NavbarPackage'

function App() {
  return (
    <AdvancedNavbar
      LinkComponent={Link}              // Use React Router Link
      homeHref="/"
      logoHref="/"
      menuItems={[
        {
          key: 'about',
          label: 'About',
          leftColumn: {
            title: 'Company',
            items: [
              {
                name: 'Our Story',
                href: '/about',
                isRouter: true      // Use router navigation
              }
            ]
          }
        }
      ]}
    />
  )
}
```

## Next.js Integration

```jsx
import Link from 'next/link'
import AdvancedNavbar from './NavbarPackage'

function Navigation() {
  return (
    <AdvancedNavbar
      LinkComponent={Link}
      // ... other props
    />
  )
}
```

## Advanced Examples

### E-commerce Website
```jsx
import {
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

const ecommerceMenus = [
  {
    key: 'shop',
    label: 'Shop',
    leftColumn: {
      title: 'Categories',
      items: [
        { name: 'Electronics', href: '/electronics', icon: ShoppingBagIcon },
        { name: 'Clothing', href: '/clothing', icon: ShoppingBagIcon },
        { name: 'Home & Garden', href: '/home', icon: ShoppingBagIcon }
      ]
    },
    rightColumn: {
      title: 'Services',
      items: [
        { name: 'Free Shipping', href: '/shipping', icon: TruckIcon },
        { name: 'Easy Returns', href: '/returns', icon: CreditCardIcon }
      ]
    },
    featuredPosts: [
      {
        title: 'Black Friday Sale',
        href: '/sale',
        date: 'Limited Time',
        imageUrl: '/sale-banner.jpg',
        description: 'Save up to 70% on selected items',
        category: { title: 'Sale', href: '/sale' }
      }
    ]
  }
]

function EcommerceNav() {
  return (
    <AdvancedNavbar
      logoSrc="/store-logo.svg"
      logoAlt="My Store"
      primaryColor="#2563eb"
      hoverColor="#1d4ed8"
      ctaText="View Cart"
      ctaHref="/cart"
      menuItems={ecommerceMenus}
      additionalLinks={[
        { key: 'deals', label: 'Deals', href: '/deals' },
        { key: 'support', label: 'Support', href: '/support' }
      ]}
    />
  )
}
```

### SaaS Platform
```jsx
const saasMenus = [
  {
    key: 'product',
    label: 'Product',
    leftColumn: {
      title: 'Features',
      items: [
        { name: 'Analytics', href: '/features/analytics' },
        { name: 'Automation', href: '/features/automation' },
        { name: 'Integrations', href: '/features/integrations' }
      ]
    },
    featuredPosts: [
      {
        title: 'Product Demo',
        href: '/demo',
        date: 'Watch Now',
        imageUrl: '/demo-thumbnail.jpg',
        description: 'See our platform in action'
      }
    ]
  },
  {
    key: 'resources',
    label: 'Resources',
    leftColumn: {
      title: 'Learn',
      items: [
        { name: 'Documentation', href: '/docs', target: '_blank' },
        { name: 'API Reference', href: '/api', target: '_blank' },
        { name: 'Tutorials', href: '/tutorials' }
      ]
    }
  }
]
```

## Styling Customization

### Custom CSS Classes
```jsx
<AdvancedNavbar
  className="border-b border-gray-200"        // Header classes
  mobileMenuClassName="bg-gray-50"            // Mobile menu classes
/>
```

### Color Schemes

**Gradient Examples:**
```jsx
// Warm gradient (default Patronos style)
primaryColor="linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)"

// Blue gradient
primaryColor="linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)"

// Green gradient
primaryColor="linear-gradient(135deg, #10b981, #059669, #047857)"

// Purple gradient
primaryColor="linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)"
```

**Solid Colors:**
```jsx
primaryColor="#3b82f6"  // Blue
primaryColor="#ef4444"  // Red
primaryColor="#10b981"  // Green
primaryColor="#f59e0b"  // Amber
```

## Event Handling

```jsx
<AdvancedNavbar
  onCtaClick={() => {
    // Track CTA clicks
    analytics.track('cta_clicked')
    // Custom logic
  }}

  menuItems={[
    {
      key: 'services',
      label: 'Services',
      leftColumn: {
        title: 'Our Services',
        items: [
          {
            name: 'Consulting',
            href: '/consulting',
            onClick: () => {
              // Track menu item clicks
              analytics.track('menu_clicked', { item: 'consulting' })
            }
          }
        ]
      }
    }
  ]}
/>
```

## Accessibility Features

- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Semantic HTML**: Correct HTML structure
- **Color Contrast**: Meets WCAG guidelines

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance Considerations

- **Lightweight**: ~15KB gzipped
- **Tree Shakeable**: Only imports what you use
- **Lazy Loading**: Flyout content loads on demand
- **Optimized Animations**: Hardware-accelerated transitions

## Troubleshooting

### Common Issues

**1. Icons not showing:**
```jsx
// Make sure to import and pass Heroicons properly
import { HomeIcon } from '@heroicons/react/24/outline'

const items = [
  { name: 'Home', href: '/', icon: HomeIcon } // ✅ Correct
  // { name: 'Home', href: '/', icon: 'HomeIcon' } // ❌ Wrong
]
```

**2. Router links not working:**
```jsx
// For React Router
<AdvancedNavbar
  LinkComponent={Link}          // Pass Link component
  menuItems={[{
    leftColumn: {
      items: [
        {
          name: 'About',
          href: '/about',
          isRouter: true          // Mark as router link
        }
      ]
    }
  }]}
/>
```

**3. Flyout menus not positioning correctly:**
```jsx
// Make sure parent container allows absolute positioning
<div className="relative">  {/* ✅ Required for flyout positioning */}
  <AdvancedNavbar />
</div>
```

## Migration from Original Components

If you're migrating from the original Patronos components:

```jsx
// Old way (multiple components)
import Navbar from './components/Navbar'
import SobreNosFlyout from './components/SobreNosFlyout'
import ImpactoFlyout from './components/ImpactoFlyout'

// New way (single component)
import AdvancedNavbar from './NavbarPackage'

// Convert your existing data
const patronosConfig = {
  logoSrc: "/Logo-Patronos-Completo.svg",
  logoAlt: "Fundo Patrimonial Patronos",
  primaryColor: "linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)",
  ctaText: "Doar Agora",
  ctaHref: "https://doa.re/patronos",
  ctaTarget: "_blank",
  menuItems: [
    // Your existing menu structure converted to new format
  ]
}
```

## Support

For questions or issues:
1. Check this documentation
2. Review the example implementations
3. Test with the provided examples
4. File issues with detailed reproduction steps

## License

This component package is extracted from the Fundo Patrimonial Patronos project and can be freely used and modified for other projects.