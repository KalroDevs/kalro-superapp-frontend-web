import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faTimes, 
  faArrowRight,
  faSeedling,
  faRobot,
  faCloudSun,
  faTrowel,
  faBug,
  faBook,
  faStore,
  faIdCard,
  faMicroscope,
  faLightbulb,
  faSatelliteDish,
  faCoins,
  faQrcode,
  faChartPie,
  faCloud,
  faMap,
  faChartLine,
  faHorseHead,
  faLeaf,
  faCalendarAlt,
  faExclamationTriangle,
  faDisease,
  faChalkboardTeacher,
  faLink,
  faPlug,
  faVial,
  faDatabase,
  faStar,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const SearchModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [popularSearches, setPopularSearches] = useState([
    'Weather Advisory',
    'Crop Selector',
    'Market Prices',
    'AI Farm Advisor',
    'Soil Health'
  ])
  const inputRef = useRef(null)

  // All products data for search
  const allProducts = [
    { id: 1, title: 'KALRO Selector', category: 'Advisory & AI', icon: faSeedling, iconBg: 'green', description: 'AI-powered crop and variety recommendation engine.' },
    { id: 2, title: 'AI Farm Advisor', category: 'Advisory & AI', icon: faRobot, iconBg: 'blue', description: 'Personalized recommendations for crops, livestock, and soil.' },
    { id: 3, title: 'Soil Health Recommender', category: 'Advisory & AI', icon: faTrowel, iconBg: 'brown', description: 'Nutrient, liming, and organic matter recommendations.' },
    { id: 4, title: 'Crop Recommendation Engine', category: 'Advisory & AI', icon: faChartLine, iconBg: 'purple', description: 'Location-based crop suitability and variety selection.' },
    { id: 5, title: 'Livestock Recommendation', category: 'Advisory & AI', icon: faHorseHead, iconBg: 'teal', description: 'Breed, feeding, and health recommendations for livestock.' },
    { id: 6, title: 'Pasture Recommendation', category: 'Advisory & AI', icon: faLeaf, iconBg: 'orange', description: 'Optimal pasture and forage species for your region.' },
    { id: 7, title: 'Weather Advisory', category: 'Climate & Weather', icon: faCloudSun, iconBg: 'cyan', description: 'Localized forecasts, seasonal outlooks, and alerts.' },
    { id: 8, title: 'Kenya Agricultural Observatory', category: 'Climate & Weather', icon: faSatelliteDish, iconBg: 'blue', description: 'Real-time climate, drought, and environmental monitoring.' },
    { id: 9, title: 'Seasonal Forecasts', category: 'Climate & Weather', icon: faCalendarAlt, iconBg: 'orange', description: 'Seasonal rainfall and temperature outlooks.' },
    { id: 10, title: 'Drought Monitoring', category: 'Climate & Weather', icon: faExclamationTriangle, iconBg: 'red', description: 'Early warning and drought severity tracking.' },
    { id: 11, title: 'Digital Soil Maps', category: 'Soil & Land', icon: faMap, iconBg: 'brown', description: 'High-resolution soil property and fertility maps.' },
    { id: 12, title: 'Land Soil Crop Hub', category: 'Soil & Land', icon: faSeedling, iconBg: 'green', description: 'Integrated land, soil, and crop information platform.' },
    { id: 13, title: 'Pest Identification AI', category: 'Crop, Livestock & Fish', icon: faBug, iconBg: 'orange', description: 'AI-powered pest identification and management.' },
    { id: 14, title: 'Disease Identification AI', category: 'Crop, Livestock & Fish', icon: faDisease, iconBg: 'purple', description: 'Crop and livestock disease diagnosis using AI.' },
    { id: 15, title: 'GAP Knowledge Hub', category: 'Knowledge & Extension', icon: faBook, iconBg: 'indigo', description: 'Good Agricultural Practices and extension content.' },
    { id: 16, title: 'Kenya e-Extension Portal', category: 'Knowledge & Extension', icon: faChalkboardTeacher, iconBg: 'green', description: 'Digital extension services for farmers and officers.' },
    { id: 17, title: 'Market Prices', category: 'Markets & Agribusiness', icon: faChartLine, iconBg: 'amber', description: 'Real-time commodity and input price information.' },
    { id: 18, title: 'Ujuzi Link', category: 'Markets & Agribusiness', icon: faLink, iconBg: 'blue', description: 'Buyer-seller linkage and value chain platform.' },
    { id: 19, title: 'Know Your Farmer (KYF)', category: 'Farmer Identity & DPI', icon: faIdCard, iconBg: 'cyan', description: 'Digital farmer identity and registration system.' },
    { id: 20, title: 'API Gateway', category: 'Farmer Identity & DPI', icon: faPlug, iconBg: 'green', description: 'Open API infrastructure for interoperability.' },
    { id: 21, title: 'Soil Laboratory Services', category: 'Lab & Diagnostics', icon: faMicroscope, iconBg: 'deep-purple', description: 'Online booking and sample tracking for soil testing.' },
    { id: 22, title: 'LIMS', category: 'Lab & Diagnostics', icon: faVial, iconBg: 'blue', description: 'Laboratory Information Management System.' },
    { id: 23, title: 'Research Data Repository', category: 'Research & Innovation', icon: faDatabase, iconBg: 'purple', description: 'Open access to agricultural research data.' },
    { id: 24, title: 'IoT Sensor Hub', category: 'Precision & IoT', icon: faSatelliteDish, iconBg: 'green', description: 'Real-time sensor data for smart farming.' },
    { id: 25, title: 'Credit Scoring', category: 'Financial Services', icon: faCoins, iconBg: 'amber', description: 'Farmer credit scoring and loan eligibility assessment.' },
    { id: 26, title: 'Farm-to-Fork Traceability', category: 'Traceability & Supply', icon: faQrcode, iconBg: 'indigo', description: 'End-to-end supply chain traceability using QR.' },
    { id: 27, title: 'Business Intelligence', category: 'Enterprise Services', icon: faChartPie, iconBg: 'deep-purple', description: 'Executive dashboards and analytics for KALRO.' },
    { id: 28, title: 'KilimoSTAT', category: 'Data & AI Platform', icon: faCloud, iconBg: 'purple', description: 'National agricultural statistics and analytics.' },
    { id: 29, title: 'GIS Platform', category: 'Data & AI Platform', icon: faMap, iconBg: 'teal', description: 'Geospatial data and mapping infrastructure.' }
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('kalroRecentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
      // Focus input when modal opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [isOpen])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const results = allProducts.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
    setSearchResults(results)
  }, [searchQuery])

  // Handle search submission
  const handleSearch = (query) => {
    if (query.trim() === '') return
    
    // Save to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
    setRecentSearches(updatedRecent)
    localStorage.setItem('kalroRecentSearches', JSON.stringify(updatedRecent))
    
    // Close modal and navigate to store with search
    onClose()
    // Navigate to store page with search query
    window.location.href = `/?page=store&search=${encodeURIComponent(query)}`
  }

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Remove recent search
  const removeRecentSearch = (search) => {
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('kalroRecentSearches', JSON.stringify(updated))
  }

  // Get icon background color class
  const getIconBgClass = (bg) => {
    const classes = {
      'green': 'green',
      'blue': 'blue',
      'orange': 'orange',
      'purple': 'purple',
      'brown': 'brown',
      'teal': 'teal',
      'indigo': 'indigo',
      'cyan': 'cyan',
      'amber': 'amber',
      'deep-purple': 'deep-purple',
      'red': 'red'
    }
    return classes[bg] || 'green'
  }

  if (!isOpen) return null

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search KALRO digital products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={clearSearch}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
            <button className="search-submit-btn" onClick={() => handleSearch(searchQuery)}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Search Results */}
        <div className="search-modal-body">
          {searchQuery.trim() !== '' ? (
            // Show results
            <div className="search-results">
              {searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    <span>{searchResults.length} results found</span>
                  </div>
                  <div className="results-grid">
                    {searchResults.map(product => (
                      <div 
                        key={product.id} 
                        className="result-item"
                        onClick={() => handleSearch(product.title)}
                      >
                        <div className={`result-icon ${getIconBgClass(product.iconBg)}`}>
                          <FontAwesomeIcon icon={product.icon} />
                        </div>
                        <div className="result-info">
                          <h4>{product.title}</h4>
                          <span className="result-category">{product.category}</span>
                          <p>{product.description}</p>
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} className="result-arrow" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                  <h3>No results found</h3>
                  <p>Try adjusting your search terms or browse our categories</p>
                </div>
              )}
            </div>
          ) : (
            // Show suggestions
            <div className="search-suggestions">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-header">
                    <span>Recent Searches</span>
                    <button 
                      className="clear-all-btn"
                      onClick={() => {
                        setRecentSearches([])
                        localStorage.removeItem('kalroRecentSearches')
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="recent-searches">
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index} 
                        className="recent-search-item"
                        onClick={() => handleSearch(search)}
                      >
                        <FontAwesomeIcon icon={faSearch} className="recent-icon" />
                        <span>{search}</span>
                        <button 
                          className="remove-search"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeRecentSearch(search)
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="suggestion-section">
                <div className="suggestion-header">
                  <span>Popular Searches</span>
                </div>
                <div className="popular-searches">
                  {popularSearches.map((search, index) => (
                    <div 
                      key={index} 
                      className="popular-search-item"
                      onClick={() => {
                        setSearchQuery(search)
                        handleSearch(search)
                      }}
                    >
                      <span className="popular-rank">{index + 1}</span>
                      <span className="popular-text">{search}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="popular-arrow" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div className="suggestion-section">
                <div className="suggestion-header">
                  <span>Browse Categories</span>
                </div>
                <div className="quick-categories">
                  <button className="category-chip" onClick={() => handleSearch('Advisory & AI')}>
                    <FontAwesomeIcon icon={faRobot} /> Advisory & AI
                  </button>
                  <button className="category-chip" onClick={() => handleSearch('Climate & Weather')}>
                    <FontAwesomeIcon icon={faCloudSun} /> Climate & Weather
                  </button>
                  <button className="category-chip" onClick={() => handleSearch('Soil & Land')}>
                    <FontAwesomeIcon icon={faTrowel} /> Soil & Land
                  </button>
                  <button className="category-chip" onClick={() => handleSearch('Markets & Agribusiness')}>
                    <FontAwesomeIcon icon={faStore} /> Markets
                  </button>
                  <button className="category-chip" onClick={() => handleSearch('Data & AI Platform')}>
                    <FontAwesomeIcon icon={faCloud} /> Data & AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal