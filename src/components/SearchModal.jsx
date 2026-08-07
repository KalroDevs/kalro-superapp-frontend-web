import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  faDownload,
  faClock,
  faFire,
  faTag,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { useApi } from '../context/ApiContext'
import './SearchModal.css'

const SearchModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const { t } = useLanguage()
  const { store, fetchWithErrorHandling } = useApi()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  // Popular searches
  const popularSearches = [
    'Weather Advisory',
    'Crop Selector',
    'Market Prices',
    'AI Farm Advisor',
    'Soil Health'
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('kalroRecentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch {
          setRecentSearches([])
        }
      }
      
      // Set initial query if provided
      if (initialQuery) {
        setSearchQuery(initialQuery)
        setHasSearched(true)
        // Trigger search after a small delay
        setTimeout(() => {
          if (initialQuery.trim()) {
            performSearch(initialQuery)
          }
        }, 200)
      } else {
        setSearchQuery('')
        setSearchResults([])
        setHasSearched(false)
      }
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 150)
      setSelectedIndex(-1)
    }
  }, [isOpen, initialQuery])

  // Perform search function
  const performSearch = async (query) => {
    if (query.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    try {
      const result = await fetchWithErrorHandling(
        () => store.searchProducts({ q: query.trim() }),
        'Failed to search products'
      )
      
      if (result.success && result.data) {
        const products = result.data.results || result.data || []
        setSearchResults(products)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    
    searchTimeoutRef.current = setTimeout(async () => {
      await performSearch(searchQuery)
    }, 400)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
        return
      }
      
      if (searchResults.length === 0) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % searchResults.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length)
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        const product = searchResults[selectedIndex]
        if (product) {
          handleResultClick(product)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, searchResults, selectedIndex, onClose])

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('.result-item')
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleSearch = (query) => {
    if (query.trim() === '') return
    
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
    setRecentSearches(updatedRecent)
    localStorage.setItem('kalroRecentSearches', JSON.stringify(updatedRecent))
    
    onClose()
    setTimeout(() => {
      window.location.href = `/?page=store&search=${encodeURIComponent(query)}`
    }, 200)
  }

  const handleResultClick = (product) => {
    onClose()
    setTimeout(() => {
      window.location.href = `/product/${product.slug || product.id}`
    }, 200)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedIndex(-1)
    setHasSearched(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const removeRecentSearch = (search, e) => {
    e.stopPropagation()
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('kalroRecentSearches', JSON.stringify(updated))
  }

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
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={clearSearch}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
            {isSearching && (
              <div className="search-loading">
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
            )}
            <button 
              className="search-submit-btn" 
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim() || isSearching}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Search Results */}
        <div className="search-modal-body" ref={resultsRef}>
          {hasSearched && searchQuery.trim() !== '' ? (
            <div className="search-results">
              {isSearching ? (
                <div className="search-loading-results">
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                  <p>Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    <span>{searchResults.length} results found</span>
                  </div>
                  <div className="results-grid">
                    {searchResults.map((product, index) => (
                      <div 
                        key={product.id} 
                        className={`result-item ${selectedIndex === index ? 'selected' : ''}`}
                        onClick={() => handleResultClick(product)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className={`result-icon ${getIconBgClass(product.icon_bg || 'green')}`}>
                          <FontAwesomeIcon icon={product.icon || faSeedling} />
                        </div>
                        <div className="result-info">
                          <h4>{product.title}</h4>
                          <span className="result-category">
                            {product.category_name || product.category || 'Product'}
                          </span>
                          <p>{product.short_description || product.description}</p>
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
                  <p>Try adjusting your search terms</p>
                </div>
              )}
            </div>
          ) : (
            <div className="search-suggestions">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-header">
                    <span><FontAwesomeIcon icon={faClock} /> Recent Searches</span>
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
                        onClick={() => {
                          setSearchQuery(search)
                          handleSearch(search)
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} className="recent-icon" />
                        <span>{search}</span>
                        <button 
                          className="remove-search"
                          onClick={(e) => removeRecentSearch(search, e)}
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
                  <span><FontAwesomeIcon icon={faFire} /> Popular Searches</span>
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
                  <span><FontAwesomeIcon icon={faTag} /> Browse Categories</span>
                </div>
                <div className="quick-categories">
                  <button 
                    className="category-chip" 
                    onClick={() => {
                      setSearchQuery('Advisory & AI')
                      handleSearch('Advisory & AI')
                    }}
                  >
                    <FontAwesomeIcon icon={faRobot} /> Advisory & AI
                  </button>
                  <button 
                    className="category-chip"
                    onClick={() => {
                      setSearchQuery('Climate & Weather')
                      handleSearch('Climate & Weather')
                    }}
                  >
                    <FontAwesomeIcon icon={faCloudSun} /> Climate & Weather
                  </button>
                  <button 
                    className="category-chip"
                    onClick={() => {
                      setSearchQuery('Markets & Agribusiness')
                      handleSearch('Markets & Agribusiness')
                    }}
                  >
                    <FontAwesomeIcon icon={faStore} /> Markets
                  </button>
                  <button 
                    className="category-chip"
                    onClick={() => {
                      setSearchQuery('Data & AI Platform')
                      handleSearch('Data & AI Platform')
                    }}
                  >
                    <FontAwesomeIcon icon={faCloud} /> Data & AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer">
          <span className="search-hint">
            <kbd>↑</kbd> <kbd>↓</kbd> navigate &nbsp;·&nbsp; <kbd>Enter</kbd> select &nbsp;·&nbsp; <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchModal