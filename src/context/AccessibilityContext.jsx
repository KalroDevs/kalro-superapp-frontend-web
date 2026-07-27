import React, { createContext, useState, useContext, useEffect } from 'react'

const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

export const AccessibilityProvider = ({ children }) => {
  // Font size state
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility-fontSize')
    return saved ? parseFloat(saved) : 16
  })

  // Contrast state
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('accessibility-highContrast')
    return saved === 'true'
  })

  // Grayscale state
  const [grayscale, setGrayscale] = useState(() => {
    const saved = localStorage.getItem('accessibility-grayscale')
    return saved === 'true'
  })

  // Reduced motion state
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('accessibility-reducedMotion')
    return saved === 'true'
  })

  // Readable fonts state
  const [readableFonts, setReadableFonts] = useState(() => {
    const saved = localStorage.getItem('accessibility-readableFonts')
    return saved === 'true'
  })

  // Line height state
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('accessibility-lineHeight')
    return saved ? parseFloat(saved) : 1.5
  })

  // Letter spacing state
  const [letterSpacing, setLetterSpacing] = useState(() => {
    const saved = localStorage.getItem('accessibility-letterSpacing')
    return saved ? parseFloat(saved) : 0
  })

  // Focus indicator state
  const [focusIndicator, setFocusIndicator] = useState(() => {
    const saved = localStorage.getItem('accessibility-focusIndicator')
    return saved !== 'false'
  })

  // Screen reader announcements
  const [announcement, setAnnouncement] = useState('')

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.style.fontSize = fontSize + 'px'
    localStorage.setItem('accessibility-fontSize', fontSize.toString())
    
    // High contrast
    if (highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
    localStorage.setItem('accessibility-highContrast', highContrast.toString())
    
    // Grayscale
    if (grayscale) {
      document.body.classList.add('grayscale')
    } else {
      document.body.classList.remove('grayscale')
    }
    localStorage.setItem('accessibility-grayscale', grayscale.toString())
    
    // Reduced motion
    if (reducedMotion) {
      document.body.classList.add('reduced-motion')
    } else {
      document.body.classList.remove('reduced-motion')
    }
    localStorage.setItem('accessibility-reducedMotion', reducedMotion.toString())
    
    // Readable fonts
    if (readableFonts) {
      document.body.classList.add('readable-fonts')
    } else {
      document.body.classList.remove('readable-fonts')
    }
    localStorage.setItem('accessibility-readableFonts', readableFonts.toString())
    
    // Line height
    document.body.style.lineHeight = lineHeight
    localStorage.setItem('accessibility-lineHeight', lineHeight.toString())
    
    // Letter spacing
    document.body.style.letterSpacing = letterSpacing + 'px'
    localStorage.setItem('accessibility-letterSpacing', letterSpacing.toString())
    
    // Focus indicator
    if (focusIndicator) {
      document.body.classList.add('focus-visible')
    } else {
      document.body.classList.remove('focus-visible')
    }
    localStorage.setItem('accessibility-focusIndicator', focusIndicator.toString())
    
  }, [fontSize, highContrast, grayscale, reducedMotion, readableFonts, lineHeight, letterSpacing, focusIndicator])

  // Annouce to screen readers
  const announce = (message) => {
    setAnnouncement(message)
    setTimeout(() => setAnnouncement(''), 3000)
  }

  // Reset all settings
  const resetAll = () => {
    setFontSize(16)
    setHighContrast(false)
    setGrayscale(false)
    setReducedMotion(false)
    setReadableFonts(false)
    setLineHeight(1.5)
    setLetterSpacing(0)
    setFocusIndicator(true)
    announce('All accessibility settings have been reset')
  }

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    grayscale,
    setGrayscale,
    reducedMotion,
    setReducedMotion,
    readableFonts,
    setReadableFonts,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    focusIndicator,
    setFocusIndicator,
    announcement,
    announce,
    resetAll,
    increaseFont: () => setFontSize(Math.min(fontSize + 2, 32)),
    decreaseFont: () => setFontSize(Math.max(fontSize - 2, 10)),
    toggleHighContrast: () => setHighContrast(!highContrast),
    toggleGrayscale: () => setGrayscale(!grayscale),
    toggleReducedMotion: () => setReducedMotion(!reducedMotion),
    toggleReadableFonts: () => setReadableFonts(!readableFonts),
    toggleFocusIndicator: () => setFocusIndicator(!focusIndicator),
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader announcer */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0'
        }}
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  )
}