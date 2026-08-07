import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faMicrophone, 
  faArrowRight,
  faCloudSun,
  faSeedling,
  faChartLine,
  faTrowel,
  faRobot
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import SearchModal from './SearchModal'
import './HeroSearch.css' 

const HeroSearch = () => {
  const { t } = useLanguage()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const openSearch = () => {
    setIsSearchOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    document.body.style.overflow = ''
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      openSearch()
    }
  }

  return (
    <>
      <section className="hero-search-section">
        <div className="container">
          <div className="hero-search-wrapper">
            <div className="hero-search-content">
              <h1 className="hero-search-title">
                Discover KALRO Digital Products
              </h1>
              <p className="hero-search-subtitle">
                Search through our collection of agricultural digital tools and services
              </p>
              
              {/* Google-style Search Bar */}
              <div className="hero-search-bar-wrapper">
                <form onSubmit={handleSearchSubmit} className="hero-search-form">
                  <div className="hero-search-bar" onClick={openSearch}>
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search for digital products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation()
                        openSearch()
                      }}
                      className="hero-search-input"
                      readOnly
                    />
                    <button 
                      type="button" 
                      className="search-voice-btn"
                      aria-label="Voice search"
                    >
                      <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                    <button 
                      type="submit" 
                      className="search-submit-btn"
                      onClick={openSearch}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </form>

                {/* Quick Action Buttons */}
                <div className="hero-search-quick-actions">
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      setSearchQuery('Weather Advisory')
                      openSearch()
                    }}
                  >
                    <FontAwesomeIcon icon={faCloudSun} /> Weather
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      setSearchQuery('Crop Selector')
                      openSearch()
                    }}
                  >
                    <FontAwesomeIcon icon={faSeedling} /> Crops
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      setSearchQuery('Market Prices')
                      openSearch()
                    }}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Markets
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      setSearchQuery('Soil Health')
                      openSearch()
                    }}
                  >
                    <FontAwesomeIcon icon={faTrowel} /> Soil
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      setSearchQuery('AI Farm Advisor')
                      openSearch()
                    }}
                  >
                    <FontAwesomeIcon icon={faRobot} /> AI Advisor
                  </button>
                </div>

                {/* Popular Categories */}
                <div className="hero-search-categories">
                  <span className="categories-label">Popular:</span>
                  <div className="categories-tags">
                    <button 
                      className="category-tag"
                      onClick={() => {
                        setSearchQuery('Advisory & AI')
                        openSearch()
                      }}
                    >
                      Advisory & AI
                    </button>
                    <button 
                      className="category-tag"
                      onClick={() => {
                        setSearchQuery('Climate & Weather')
                        openSearch()
                      }}
                    >
                      Climate & Weather
                    </button>
                    <button 
                      className="category-tag"
                      onClick={() => {
                        setSearchQuery('Markets & Agribusiness')
                        openSearch()
                      }}
                    >
                      Markets & Agribusiness
                    </button>
                    <button 
                      className="category-tag"
                      onClick={() => {
                        setSearchQuery('Data & AI Platform')
                        openSearch()
                      }}
                    >
                      Data & AI Platform
                    </button>
                    <button 
                      className="category-tag view-all"
                      onClick={() => {
                        setSearchQuery('')
                        openSearch()
                      }}
                    >
                      View all <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} initialQuery={searchQuery} />
    </>
  )
}

export default HeroSearch