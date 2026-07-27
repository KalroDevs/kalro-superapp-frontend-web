import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()
  const words = ['Customer orientation', 'Professionalism', 'Innovativeness', 'Collaboration', 'Environmental consciousness', 'Integrity']
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const currentWord = words[index % words.length]
    let timeout

    if (!isDeleting && text !== currentWord) {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1))
      }, 100)
    } else if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    } else if (isDeleting && text !== '') {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1))
      }, 50)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
      setIndex(index + 1)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, words])

  useEffect(() => {
    const img = new Image()
    img.src = '/images/background.png'
    img.onload = () => {
      console.log('Image loaded successfully')
      setImageLoaded(true)
    }
    img.onerror = () => {
      console.warn('Image failed to load')
      setImageError(true)
    }
  }, [])

  const heroStyle = {
    backgroundImage: imageLoaded ? 'url(/images/background.png)' : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#faf9f8',
    minHeight: '540px',
    display: 'flex',
    alignItems: 'center',
    padding: '40px 0 60px',
    position: 'relative',
    overflow: 'hidden'
  }

  return (
    <section className="hero" style={heroStyle}>
      {/* Overlay without blur - keeps image sharp */}
      <div className="hero-overlay" style={{ 
        background: 'rgba(255, 255, 255, 0.75)',
        // Remove backdrop-filter to prevent blur
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}></div>
      
      <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content">
          <span className="tag">
            <FontAwesomeIcon icon={faLeaf} style={{ marginRight: '6px' }} /> 
            {t('tagLine')}
          </span>
          <div className="slide-text">
            <h3>
              {t('coreValues')}{' '}
              <a href="#" className="typewrite">
                <span className="wrap">{text}</span>
              </a>
            </h3>
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroDescription')}</p>
          </div>
          <div className="hero-actions">
            <a className="btn primary" href="#start">
              <FontAwesomeIcon icon={faArrowRight} /> {t('getRecommendation')}
            </a>
            <a className="btn link" href="#services">
              {t('exploreSuperapp')} <FontAwesomeIcon icon={faChevronRight} />
            </a>
          </div>
        </div>
    
      </div>
    </section>
  )
}

export default Hero