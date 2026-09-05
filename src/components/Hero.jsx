// Hero.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBolt,
  faChartLine,
  faCloudSun,
  faDatabase,
  faLeaf,
  faMicrophone,
  faRobot,
  faSearch,
  faSeedling,
  faShieldHalved,
  faStar,
  faTrowel,
} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import FeaturedProducts from './FeaturedProducts'
import SearchModal from './SearchModal'
import './Hero.css'

const Hero = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const words = useMemo(
    () => [
      'Digital Agriculture',
      'Digital Products/Services',
      'Smart Advisory',
      'Agricultural Data',
      'AI Innovation',
    ],
    []
  )

  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Typing animation
  useEffect(() => {
    const currentWord = words[index % words.length]
    const delay = isDeleting ? 45 : 85
    let timeout

    if (!isDeleting && text !== currentWord) {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1))
      }, delay)
    } else if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1600)
    } else if (isDeleting && text !== '') {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1))
      }, delay)
    } else {
      setIsDeleting(false)
      setIndex((value) => value + 1)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, words])

  // Load background image
  useEffect(() => {
    const img = new Image()
    img.src = '/images/background.png'
    img.onload = () => setImageLoaded(true)
  }, [])

  // Search Modal handlers
  const openSearch = () => {
    setIsSearchOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    document.body.style.overflow = ''
  }

  // Handle search submission - opens modal instead of navigating
  const handleSearchSubmit = (event) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      openSearch()
    }
  }

  // Handle quick action clicks - opens modal with query
  const handleQuickAction = (query) => {
    setSearchQuery(query)
    openSearch()
  }

  // Handle category tag clicks - opens modal with query
  const handleCategoryClick = (item) => {
    setSearchQuery(item)
    openSearch()
  }

  const quickActions = [
    // { label: 'Weather', query: 'Weather Advisory', icon: faCloudSun },
    // { label: 'Crops', query: 'Crop Selector', icon: faSeedling },
    // { label: 'Markets', query: 'Market Prices', icon: faChartLine },
    // { label: 'Soil', query: 'Soil Health', icon: faTrowel },
    // { label: 'AI Advisor', query: 'AI Farm Advisor', icon: faRobot },
  ]

  const popular = [
    'Advisory & AI',
    'Climate & Weather',
    'Markets & Agribusiness',
    'Data & AI Platform',
  ]

  const heroStyle = imageLoaded
    ? { '--hero-background-image': "url('/images/background.png')" }
    : {}

  return (
    <>
      <section className="hero-future" style={heroStyle}>
        <div className="hero-future-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />

        <div className="container hero-future-container">
          <div className="hero-future-layout">
            <div className="hero-future-copy">
              <div className="hero-kicker">
                {/* <span>{t('tagLine') || 'Kenya Agriculture Digital Catalogue'}</span>
                <span className="hero-live-dot" aria-hidden="true" /> */}
              </div>

              &nbsp;

              <div className="hero-intelligence-pill">
                <FontAwesomeIcon icon={faStar} />
                <span>{t('heroIntelligencePill')}</span>
                <strong>{text || 'Digital Agriculture'}</strong>
              </div>

              <h1>
                {t('heroMainTitle')}
                <span className="hero-gradient-text"> {t('heroGradientText')}</span>
              </h1>

              <p className="hero-lead">
                {t('heroLead')}
              </p>

              <div className="hero-trust-row" aria-label="Catalogue characteristics">
                <span><FontAwesomeIcon icon={faShieldHalved} /> {t('heroTrustTrusted')}</span>
                <span><FontAwesomeIcon icon={faDatabase} /> {t('heroTrustData')}</span>
                <span><FontAwesomeIcon icon={faBolt} /> {t('heroTrustAction')}</span>
              </div>

              <div className="hero-search-shell">
                <form onSubmit={handleSearchSubmit} className="hero-search-form">
                  <div className="hero-search-bar">
                    <div className="hero-search-icon-wrap">
                      <FontAwesomeIcon icon={faSearch} />
                    </div>

                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t('heroSearchPlaceholder')}
                      className="hero-search-input"
                      aria-label="Search digital agriculture catalogue"
                      onClick={openSearch}
                      readOnly
                    />

                    <button
                      type="button"
                      className="search-voice-btn"
                      aria-label="Voice search"
                      onClick={openSearch}
                    >
                      <FontAwesomeIcon icon={faMicrophone} />
                    </button>

                    <button type="submit" className="search-submit-btn" onClick={openSearch}>
                      <span>{t('heroSearchButton')}</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </div>
                </form>

                <div className="hero-search-quick-actions">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="quick-action-btn"
                      onClick={() => handleQuickAction(action.query)}
                    >
                      <FontAwesomeIcon icon={action.icon} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hero-bottom-row">
                <div className="hero-search-categories">
                  {/* <span className="categories-label">Popular searches</span>
                  <div className="categories-tags">
                    {popular.map((item) => (
                      <button
                        type="button"
                        className="category-tag"
                        key={item}
                        onClick={() => handleCategoryClick(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div> */}
                </div>

                <Link to="/?page=store" className="hero-explore-link">
                  {t('heroExploreLink')}
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-visual-halo" />

             
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Search Modal - Same as Header */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={closeSearch} 
        initialQuery={searchQuery}
      />
    </>
  )
}

export default Hero