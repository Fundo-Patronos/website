# Brand Color Changes Documentation

## Current Brand Colors (New Diagonal Gradient)
**Applied on**: August 30, 2025
**New Primary Gradient**: `linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)`

## Previous Brand Colors (Red Theme)
**Original Primary Color**: `#C00000` (solid red)
**Original Hover State**: `#A00000` (darker red)
**Original Gradient**: `from-red-200 to-yellow-200` (background gradients)

## Components Modified

### 1. Hero.jsx
**Changes**:
- Primary button: Changed from red to new 4-stop gradient
- Background gradient: Updated to use new color stops with opacity
**Reversion**: Replace gradient with `backgroundColor: '#C00000'` and background with `from-red-200 to-yellow-200`

### 2. Navbar.jsx  
**Changes**:
- "Doar Agora" button: Changed from red to new 4-stop gradient
**Reversion**: Replace with `backgroundColor: '#C00000', '&:hover': {backgroundColor: '#A00000'}`

### 3. Features.jsx
**Changes**:
- Icon backgrounds: Changed from red to new 4-stop gradient
- Link colors: Changed to `#ff9700` (first gradient color)
**Reversion**: Replace gradient with `backgroundColor: '#C00000'` and links with `color: '#C00000'`

### 4. FeatureScreenshot.jsx
**Changes**:
- Section header color: Changed to `#ff9700`
- Icon colors: Changed to `#ff9700`
- Panel background: Changed to new 4-stop gradient
**Reversion**: Replace all with `color: '#C00000'` and `backgroundColor: '#C00000'`

### 5. CTASection.jsx
**Changes**:
- CheckCircle icons: Changed to `#ff9700`
- CTA link: Changed to `#ff9700`
**Reversion**: Replace all with `color: '#C00000'`

### 6. Footer.jsx
**Changes**:
- Newsletter button: Changed to new 4-stop gradient
- Form focus states: Changed to `#ff9700`
**Reversion**: Replace with `backgroundColor: '#C00000', '&:hover': {backgroundColor: '#A00000'}` and `outlineColor: '#C00000'`

### 7. SobreNosFlyout.jsx
**Changes**:
- Hover states: Changed to `#ff9700`
**Reversion**: Replace with `color: '#C00000'`

### 8. ImpactoFlyout.jsx
**Changes**:
- Hover states: Changed to `#ff9700`
**Reversion**: Replace with `color: '#C00000'`

## Fundo Page Components Modified

### 9. FundoHero.jsx
**Changes**:
- Primary button: Changed to diagonal gradient
**Reversion**: Replace with `backgroundColor: '#C00000', '&:hover': {backgroundColor: '#A00000'}`

### 10. FundoPrincipios.jsx
**Changes**:
- Icon backgrounds: Changed to diagonal gradient
**Reversion**: Replace with `backgroundColor: '#C00000'`

### 11. FundoTimeline.jsx
**Changes**:
- Timeline dates: Changed to `#ff9700`
**Reversion**: Replace with `color: '#C00000'`

### 12. FundoGovernanca.jsx
**Changes**:
- Section header: Changed to `#ff9700`
- Icon colors: Changed to `#ff9700`
**Reversion**: Replace with `color: '#C00000'`

## Quick Reversion Commands

To revert to red theme, replace the following in each file:

```
New Gradient: linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)
Revert to: backgroundColor: '#C00000'

New Color: #ff9700
Revert to: #C00000

New Hover: #ff9700  
Revert to: #C00000
```

## File Locations

### Homepage Components
- `/src/components/Hero.jsx`
- `/src/components/Navbar.jsx`
- `/src/components/Features.jsx`
- `/src/components/FeatureScreenshot.jsx`
- `/src/components/CTASection.jsx`
- `/src/components/Footer.jsx`
- `/src/components/SobreNosFlyout.jsx`
- `/src/components/ImpactoFlyout.jsx`

### Fundo Page Components
- `/src/components/FundoHero.jsx`
- `/src/components/FundoPrincipios.jsx`
- `/src/components/FundoTimeline.jsx`
- `/src/components/FundoGovernanca.jsx`

## Notes
- All gradient implementations use diagonal orientation (135deg)
- Focus outline colors maintained as `#ff9700` (first gradient color)
- Background gradients in Hero use opacity versions of the same colors
- No changes made to Stats section (uses text colors only)
- CTASection icons and links remain `#ff9700` (no gradient needed for small elements)