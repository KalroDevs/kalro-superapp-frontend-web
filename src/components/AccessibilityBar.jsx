import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUniversalAccess, 
  faPlus, 
  faMinus, 
  faCircleHalfStroke, 
  faTimes,
  faFont,
  faArrowsUpDown,
  faArrowsLeftRight,
  faEye,
  faEyeSlash,
  faTextHeight,
  faStop,
  faRedo,
  faChevronDown,
  faChevronUp,
  faExpand,
  faCompress,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons'
import { useAccessibility } from '../context/AccessibilityContext'
import { useLanguage } from '../context/LanguageContext'

const AccessibilityBar = () => {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const { t } = useLanguage()
  const {
    fontSize,
    highContrast,
    grayscale,
    reducedMotion,
    readableFonts,
    lineHeight,
    letterSpacing,
    focusIndicator,
    increaseFont,
    decreaseFont,
    toggleHighContrast,
    toggleGrayscale,
    toggleReducedMotion,
    toggleReadableFonts,
    toggleFocusIndicator,
    resetAll,
    setLineHeight,
    setLetterSpacing,
    announce
  } = useAccessibility()

  const handleReset = () => {
    resetAll()
    announce('All accessibility settings have been reset to default')
  }

  const handleFontSizeChange = (value) => {
    if (value === 'increase') {
      increaseFont()
      announce(`Font size increased to ${fontSize + 2}px`)
    } else {
      decreaseFont()
      announce(`Font size decreased to ${fontSize - 2}px`)
    }
  }

  const handleLineHeightChange = () => {
    const newLineHeight = lineHeight === 1.5 ? 2 : lineHeight === 2 ? 2.5 : 1.5
    setLineHeight(newLineHeight)
    announce(`Line height set to ${newLineHeight}`)
  }

  const handleLetterSpacingChange = () => {
    const newSpacing = letterSpacing === 0 ? 1 : letterSpacing === 1 ? 2 : 0
    setLetterSpacing(newSpacing)
    announce(`Letter spacing set to ${newSpacing}px`)
  }

  if (!visible) {
    return (
      <button 
        className="accessibility-toggle"
        onClick={() => setVisible(true)}
        aria-label="Show accessibility toolbar"
      >
        <FontAwesomeIcon icon={faUniversalAccess} />
      </button>
    )
  }

  return (
    <div className="accessibility-bar" role="toolbar" aria-label="Accessibility tools">
      <div className="container">
        <div className="accessibility-bar-header">
          <span className="label">
            <FontAwesomeIcon icon={faUniversalAccess} /> {t('accessibility')}
          </span>
          <button 
            className="accessibility-toggle-expand"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse accessibility tools' : 'Expand accessibility tools'}
          >
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </button>
        </div>

        <div className={`accessibility-controls ${expanded ? 'expanded' : ''}`}>
          {/* Font Size Controls */}
          <div className="control-group">
            <span className="control-label">
              <FontAwesomeIcon icon={faTextHeight} /> {t('fontSize')}
            </span>
            <div className="control-buttons">
              <button 
                onClick={() => handleFontSizeChange('decrease')}
                aria-label={t('decreaseFont')}
                disabled={fontSize <= 10}
              >
                <FontAwesomeIcon icon={faMinus} /> A
              </button>
              <span className="control-value">{fontSize}px</span>
              <button 
                onClick={() => handleFontSizeChange('increase')}
                aria-label={t('increaseFont')}
                disabled={fontSize >= 32}
              >
                <FontAwesomeIcon icon={faPlus} /> A
              </button>
              <button 
                onClick={() => {
                  const root = document.documentElement
                  root.style.fontSize = '16px'
                  announce('Font size reset to default')
                }}
                aria-label={t('resetFont')}
                className="reset-font"
              >
                <FontAwesomeIcon icon={faRedo} />
              </button>
            </div>
          </div>

          {/* Contrast Controls */}
          <div className="control-group">
            <button 
              className={`control-toggle ${highContrast ? 'active' : ''}`}
              onClick={() => {
                toggleHighContrast()
                announce(highContrast ? 'High contrast disabled' : 'High contrast enabled')
              }}
              aria-label="Toggle high contrast"
            >
              <FontAwesomeIcon icon={faCircleHalfStroke} /> {t('contrast')}
            </button>
          </div>

          {/* Grayscale */}
          <div className="control-group">
            <button 
              className={`control-toggle ${grayscale ? 'active' : ''}`}
              onClick={() => {
                toggleGrayscale()
                announce(grayscale ? 'Grayscale disabled' : 'Grayscale enabled')
              }}
              aria-label="Toggle grayscale mode"
            >
              <FontAwesomeIcon icon={grayscale ? faEyeSlash : faEye} /> Grayscale
            </button>
          </div>

          {/* Line Height */}
          <div className="control-group">
            <button 
              className={`control-toggle ${lineHeight !== 1.5 ? 'active' : ''}`}
              onClick={handleLineHeightChange}
              aria-label="Toggle line height"
            >
              <FontAwesomeIcon icon={faArrowsUpDown} /> Line Height
            </button>
          </div>

          {/* Letter Spacing */}
          <div className="control-group">
            <button 
              className={`control-toggle ${letterSpacing !== 0 ? 'active' : ''}`}
              onClick={handleLetterSpacingChange}
              aria-label="Toggle letter spacing"
            >
              <FontAwesomeIcon icon={faArrowsLeftRight} /> Spacing
            </button>
          </div>

          {/* Readable Fonts */}
          <div className="control-group">
            <button 
              className={`control-toggle ${readableFonts ? 'active' : ''}`}
              onClick={() => {
                toggleReadableFonts()
                announce(readableFonts ? 'Readable fonts disabled' : 'Readable fonts enabled')
              }}
              aria-label="Toggle readable fonts"
            >
              <FontAwesomeIcon icon={faFont} /> Readable
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="control-group">
            <button 
              className={`control-toggle ${reducedMotion ? 'active' : ''}`}
              onClick={() => {
                toggleReducedMotion()
                announce(reducedMotion ? 'Reduced motion disabled' : 'Reduced motion enabled')
              }}
              aria-label="Toggle reduced motion"
            >
              <FontAwesomeIcon icon={faStop} /> Motion
            </button>
          </div>

          {/* Focus Indicator */}
          <div className="control-group">
            <button 
              className={`control-toggle ${focusIndicator ? 'active' : ''}`}
              onClick={() => {
                toggleFocusIndicator()
                announce(focusIndicator ? 'Focus indicator disabled' : 'Focus indicator enabled')
              }}
              aria-label="Toggle focus indicator"
            >
              <FontAwesomeIcon icon={faExpand} /> Focus
            </button>
          </div>

          {/* Reset All */}
          <div className="control-group">
            <button 
              className="control-toggle reset-all"
              onClick={handleReset}
              aria-label="Reset all accessibility settings"
            >
              <FontAwesomeIcon icon={faRedo} /> Reset
            </button>
          </div>
        </div>

        <button 
          className="accessibility-close"
          onClick={() => setVisible(false)}
          aria-label={t('close')}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  )
}

export default AccessibilityBar