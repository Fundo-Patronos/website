// Patronos Brand Colors
export const colors = {
  primary: '#C00000',      // Red
  accent: '#ff9700',       // Yellow
  primaryHover: '#A00000', // Darker red for hover states
  accentHover: '#e6870d',  // Darker yellow for hover states
};

// Brand color utilities
export const brandStyles = {
  primaryButton: {
    backgroundColor: colors.primary,
    color: 'white',
    '&:hover': {
      backgroundColor: colors.primaryHover,
    }
  },
  accentButton: {
    backgroundColor: colors.accent,
    color: 'white',
    '&:hover': {
      backgroundColor: colors.accentHover,
    }
  },
  primaryText: {
    color: colors.primary,
  },
  accentText: {
    color: colors.accent,
  },
  primaryBorder: {
    borderColor: colors.primary,
  },
  accentBorder: {
    borderColor: colors.accent,
  },
  gradientBg: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  }
};

// CSS custom properties for Tailwind
export const cssVariables = `
  :root {
    --color-primary: ${colors.primary};
    --color-accent: ${colors.accent};
    --color-primary-hover: ${colors.primaryHover};
    --color-accent-hover: ${colors.accentHover};
  }
`;