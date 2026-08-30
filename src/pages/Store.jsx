import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, faDownload, faArrowRight, faThLarge, faSlidersH,
  faRobot, faCloudSun, faTrowel, faBug, faBook, faStore,
  faIdCard, faMicroscope, faLightbulb, faSatelliteDish, faCoins,
  faQrcode, faChartPie, faCloud, faSeedling, faMap, faChartLine,
  faHorseHead, faLeaf, faCalendarAlt, faExclamationTriangle,
  faDisease, faChalkboardTeacher, faLink as faLinkIcon, faPlug, faVial,
  faDatabase, faSearch, faFilter, faSpinner, faCheckCircle,
  faShieldAlt, faGlobe, faImage, faThList, faChevronLeft, faChevronRight,
  faTimes, faSort, faSortUp, faSortDown, faEye, faClock, faTag,
  faMobile, faDesktop, faExternalLinkAlt, faBars
} from '@fortawesome/free-solid-svg-icons'
import { 
  faAndroid, faApple
} from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAccessibility } from '../context/AccessibilityContext'
import { useApi } from '../context/ApiContext'
import './Store.css'

const Store = () => {
  const { t, currentLanguage } = useLanguage()
  const { highContrast } = useAccessibility()
  const { store, fetchWithErrorHandling } = useApi()
  
  // View state
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredApps, setFilteredApps] = useState([])
  const [allApps, setAllApps] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredApps, setFeaturedApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [sortBy, setSortBy] = useState('popular') // 'popular' | 'rating' | 'newest' | 'az' | 'za'
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    next: null,
    previous: null,
    pageSize: 12
  })

  // Refs
  const filterPanelRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fallback image
  const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23009640"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="18" fill="white" text-anchor="middle"%3EKALRO%3C/text%3E%3Ctext x="150" y="125" font-family="Arial" font-size="12" fill="%23dff6dd" text-anchor="middle"%3EApp%3C/text%3E%3C/svg%3E'

  // Handle image error
  const handleImageError = (appId) => {
    setImageErrors(prev => ({ ...prev, [appId]: true }))
  }

  // Get screenshot URL with fallback
  const getScreenshotUrl = (app) => {
    if (imageErrors[app.id]) {
      return FALLBACK_IMAGE
    }
    if (app.screenshots && app.screenshots.length > 0) {
      return app.screenshots[0].image_url || app.screenshots[0].image || FALLBACK_IMAGE
    }
    return FALLBACK_IMAGE
  }

  // Check if product has screenshots
  const hasScreenshots = (app) => {
    return app.screenshots && app.screenshots.length > 0
  }

  // Fetch data from API
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // 1. Fetch categories
        const categoriesResult = await fetchWithErrorHandling(
          () => store.getCategories(),
          'Failed to load categories'
        )
        
        let categoriesData = []
        if (categoriesResult.success && categoriesResult.data) {
          categoriesData = Array.isArray(categoriesResult.data) 
            ? categoriesResult.data 
            : categoriesResult.data.results || []
          setCategories(categoriesData)
        }
        
        // 2. Fetch products with filters
        const params = {}
        if (activeFilter !== 'all') {
          params.category = activeFilter
        }
        if (searchQuery) {
          params.search = searchQuery
        }
        if (showOnlyFeatured) {
          params.is_featured = true
        }
        
        const productsResult = await fetchWithErrorHandling(
          () => store.getProducts({ 
            ...params, 
            page: pagination.currentPage, 
            page_size: pagination.pageSize 
          }),
          'Failed to load products'
        )
        
        if (productsResult.success && productsResult.data) {
          const productData = productsResult.data
          const items = productData.results || productData || []
          setAllApps(items)
          setFilteredApps(items)
          
          if (productData.results) {
            setPagination(prev => ({
              ...prev,
              totalPages: Math.ceil(productData.count / prev.pageSize) || 1,
              totalItems: productData.count || items.length,
              next: productData.next,
              previous: productData.previous
            }))
          }
        } else {
          setError('Failed to load products')
          setAllApps(fallbackProducts)
          setFilteredApps(fallbackProducts)
          setCategories(fallbackCategories)
        }
        
        // 3. Fetch featured products
        const featuredResult = await fetchWithErrorHandling(
          () => store.getFeaturedProducts({ page_size: 6 }),
          'Failed to load featured products'
        )
        
        if (featuredResult.success && featuredResult.data) {
          const featuredData = featuredResult.data
          if (featuredData.results) {
            setFeaturedApps(featuredData.results)
          } else if (Array.isArray(featuredData)) {
            setFeaturedApps(featuredData)
          } else {
            setFeaturedApps(fallbackFeatured)
          }
        } else {
          setFeaturedApps(fallbackFeatured)
        }
        
      } catch (err) {
        console.error('Error fetching store data:', err)
        setError('Unable to load store data. Please refresh the page.')
        setAllApps(fallbackProducts)
        setFilteredApps(fallbackProducts)
        setCategories(fallbackCategories)
        setFeaturedApps(fallbackFeatured)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStoreData()
  }, [activeFilter, searchQuery, pagination.currentPage, showOnlyFeatured])

  // Filter and sort apps locally
  useEffect(() => {
    let filtered = [...allApps]
    
    // Category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(app => {
        const appCategory = app.category_slug || app.category?.slug || app.category
        return appCategory === activeFilter
      })
    }
    
    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(app => 
        (app.title || '').toLowerCase().includes(query) ||
        (app.short_description || '').toLowerCase().includes(query) ||
        (app.category_name || '').toLowerCase().includes(query)
      )
    }
    
    // Featured filter
    if (showOnlyFeatured) {
      filtered = filtered.filter(app => app.is_featured)
    }
    
    // Platform filter
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(app => {
        const platforms = app.platforms || []
        return selectedPlatforms.some(p => platforms.includes(p))
      })
    }
    
    // Sort
    filtered = sortApps(filtered, sortBy)
    
    setFilteredApps(filtered)
  }, [activeFilter, searchQuery, allApps, sortBy, showOnlyFeatured, selectedPlatforms])

  // Sort apps
  const sortApps = (apps, sortType) => {
    const sorted = [...apps]
    switch (sortType) {
      case 'popular':
        return sorted.sort((a, b) => {
          const aDownloads = parseInt(a.downloads_count?.replace(/,/g, '') || 0)
          const bDownloads = parseInt(b.downloads_count?.replace(/,/g, '') || 0)
          return bDownloads - aDownloads
        })
      case 'rating':
        return sorted.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
      case 'newest':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.created_at || a.created || 0)
          const bDate = new Date(b.created_at || b.created || 0)
          return bDate - aDate
        })
      case 'az':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      case 'za':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      default:
        return sorted
    }
  }

  // Handle filter change
  const handleFilterChange = (categoryId) => {
    setActiveFilter(categoryId)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    if (window.innerWidth < 768) {
      setIsFilterOpen(false)
    }
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle view mode toggle
  const toggleViewMode = (mode) => {
    setViewMode(mode)
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  // Handle platform toggle
  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilter('all')
    setSearchQuery('')
    setSortBy('popular')
    setShowOnlyFeatured(false)
    setSelectedPlatforms([])
    setPriceRange({ min: 0, max: 1000 })
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
  }

  // Get icon background class
  const getIconBgClass = (bg) => {
    const classes = {
      'green': 'green', 'blue': 'blue', 'orange': 'orange', 'purple': 'purple',
      'brown': 'brown', 'teal': 'teal', 'indigo': 'indigo', 'cyan': 'cyan',
      'amber': 'amber', 'deep-purple': 'deep-purple', 'red': 'red'
    }
    return classes[bg] || 'green'
  }

  // Render stars
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0
    const fullStars = Math.floor(numRating)
    const stars = []
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="stars" />)
    }
    if (numRating % 1 >= 0.5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStar} className="stars" style={{ opacity: 0.5 }} />)
    }
    return stars
  }

  // Get category label
  const getCategoryLabel = (app) => {
    if (app.category_name) {
      return app.category_name
    }
    if (app.category?.name) {
      return app.category.name
    }
    const cat = categories.find(c => c.id === app.category || c.slug === app.category)
    return cat?.name || 'Uncategorized'
  }

  // Get badge color
  const getBadgeColor = (badge) => {
    const badgeColors = {
      'Verified Official': 'badge-official',
      'KALRO Certified': 'badge-certified',
      'Free Access': 'badge-free',
      'Popular': 'badge-popular',
      'Featured': 'badge-featured',
      'Top': 'badge-top',
      'New': 'badge-new',
      'AI-Powered': 'badge-ai'
    }
    return badgeColors[badge] || 'badge-default'
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (activeFilter !== 'all') count++
    if (searchQuery) count++
    if (showOnlyFeatured) count++
    if (selectedPlatforms.length > 0) count++
    return count
  }

  // Fallback data
  const fallbackCategories = [
    { id: 1, name: 'All', slug: 'all', icon: faThLarge },
    { id: 2, name: 'Advisory & AI', slug: 'advisory', icon: faRobot },
    { id: 3, name: 'Markets & Agribusiness', slug: 'markets-agribusiness', icon: faStore },
    { id: 4, name: 'Farm Decision Support', slug: 'decision-support-systems', icon: faSeedling },
    { id: 5, name: 'Climate & Weather', slug: 'climate', icon: faCloudSun },
    { id: 6, name: 'Soil & Land', slug: 'soil', icon: faTrowel },
    { id: 7, name: 'Knowledge & Extension', slug: 'knowledge', icon: faBook }
  ]

  const fallbackProducts = [
    {
      id: 1,
      slug: 'kalro-selector',
      title: 'KALRO Selector',
      category_name: 'Farm Decision Support',
      category_slug: 'decision-support-systems',
      icon: faSeedling,
      icon_bg: 'green',
      short_description: 'An agricultural decision support tool helping Kenyan farmers select suitable crop varieties, livestock breeds, and pasture options based on agro-ecological zones.',
      rating: '4.5',
      downloads_count: '45,000',
      badges: ['Verified Official', 'KALRO Certified', 'Free Access'],
      is_featured: true,
      screenshots: [],
      platforms: ['web', 'android'],
      created_at: '2024-01-15'
    },
    {
      id: 2,
      slug: 'kenya-agricultural-management-information-system-k',
      title: 'Kenya Agricultural Management Information System (KAMIS)',
      category_name: 'Markets & Agribusiness',
      category_slug: 'markets-agribusiness',
      icon: faSeedling,
      icon_bg: 'green',
      short_description: 'Real-time market prices, commodity trends, and trade analytics for agricultural produce across major markets in Kenya.',
      rating: '4.8',
      downloads_count: '60,000',
      badges: ['Verified Official', 'Ministry of Agriculture and Livestock Development', 'Free Access'],
      is_featured: true,
      screenshots: [],
      platforms: ['web'],
      created_at: '2023-11-20'
    }
  ]

  const fallbackFeatured = [
    {
      id: 2,
      slug: 'kenya-agricultural-management-information-system-k',
      title: 'Kenya Agricultural Management Information System (KAMIS)',
      icon: faSeedling,
      gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      short_description: 'Real-time market prices, commodity trends, and trade analytics for agricultural produce across major markets in Kenya.',
      badge: 'Featured',
      productId: 2,
      screenshots: []
    },
    {
      id: 1,
      slug: 'kalro-selector',
      title: 'KALRO Selector',
      icon: faSeedling,
      gradient: 'linear-gradient(135deg, #0067b8, #50e6ff)',
      short_description: 'An agricultural decision support tool helping Kenyan farmers select suitable crop varieties, livestock breeds, and pasture options.',
      badge: 'Popular',
      productId: 1,
      screenshots: []
    }
  ]

  if (loading) {
    return (
      <main className="store-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
            <p className="loading-text">Loading products...</p>
            <div className="loading-skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="store-page">
      <div className="container">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-badge">✨ Digital Store</div>
            <h2>{t('storeWelcome') || 'Discover Agricultural Digital Products'}</h2>
            <p>{t('storeDescription') || 'Explore innovative digital solutions for modern agriculture'}</p>
            <div className="hero-stats">
              <span><strong>{pagination.totalItems || 0}</strong> Products</span>
              <span><strong>{categories.length}</strong> Categories</span>
              <span><strong>100%</strong> Free Access</span>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#products" className="btn-hero">
              <FontAwesomeIcon icon={faArrowRight} /> {t('exploreAll') || 'Explore All'}
            </a>
          </div>
        </section>

        {/* Featured Products */}
        {featuredApps.length > 0 && (
          <div className="featured-section">
            <div className="section-header">
              <h3><FontAwesomeIcon icon={faStar} /> {t('featuredProducts') || 'Featured Products'}</h3>
              <a href="#products">{t('seeAll') || 'See All'} <FontAwesomeIcon icon={faArrowRight} /></a>
            </div>
            <div className="featured-scroll">
              {featuredApps.map(app => (
                <Link to={`/product/${app.slug || app.productId}`} className="featured-card-link" key={app.id}>
                  <div className="featured-card">
                    <div className="featured-img" style={{ 
                      background: app.screenshots?.[0]?.image_url 
                        ? `url(${app.screenshots[0].image_url}) center/cover` 
                        : (app.gradient || 'linear-gradient(135deg, var(--primary), var(--secondary))')
                    }}>
                      {!app.screenshots?.[0]?.image_url && <FontAwesomeIcon icon={app.icon || faStore} />}
                      <span className="overlay">{app.badge || 'Featured'}</span>
                    </div>
                    <div className="featured-body">
                      <h4>{app.title}</h4>
                      <p>{app.short_description}</p>
                      <span className="btn-link">
                        {t('learnMore') || 'Learn More'} <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div id="products" className="store-main">
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle">
            <button 
              className="btn-filter-toggle"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-count">{getActiveFiltersCount()}</span>
              )}
            </button>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => toggleViewMode('grid')}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => toggleViewMode('list')}
                aria-label="List view"
              >
                <FontAwesomeIcon icon={faThList} />
              </button>
            </div>
          </div>

          <div className="store-layout">
            {/* Filter Panel */}
            <aside className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
              <div className="filter-panel-header">
                <h4>
                  <FontAwesomeIcon icon={faSlidersH} />
                  Filters
                </h4>
                <button 
                  className="close-filter"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="filter-group">
                <h5>Categories</h5>
                <div className="category-filters">
                  <button
                    className={`filter-option ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                  >
                    <FontAwesomeIcon icon={faThLarge} />
                    <span>All</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id || cat.slug}
                      className={`filter-option ${activeFilter === (cat.slug || cat.id) ? 'active' : ''}`}
                      onClick={() => handleFilterChange(cat.slug || cat.id)}
                    >
                      <FontAwesomeIcon icon={cat.icon || faTag} />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h5>Sort By</h5>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                </select>
              </div>

              <div className="filter-group">
                <h5>Platform</h5>
                <div className="platform-filters">
                  <button
                    className={`platform-option ${selectedPlatforms.includes('web') ? 'active' : ''}`}
                    onClick={() => togglePlatform('web')}
                  >
                    <FontAwesomeIcon icon={faDesktop} />
                    Web
                  </button>
                  <button
                    className={`platform-option ${selectedPlatforms.includes('android') ? 'active' : ''}`}
                    onClick={() => togglePlatform('android')}
                  >
                    <FontAwesomeIcon icon={faAndroid} />
                    Android
                  </button>
                  <button
                    className={`platform-option ${selectedPlatforms.includes('ios') ? 'active' : ''}`}
                    onClick={() => togglePlatform('ios')}
                  >
                    <FontAwesomeIcon icon={faApple} />
                    iOS
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showOnlyFeatured}
                    onChange={() => setShowOnlyFeatured(!showOnlyFeatured)}
                  />
                  <span>Show only featured</span>
                </label>
              </div>

              <button 
                className="btn-clear-filters"
                onClick={clearAllFilters}
              >
                <FontAwesomeIcon icon={faTimes} />
                Clear all filters
              </button>
            </aside>

            {/* Products Area */}
            <section className="products-area">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={t('searchProducts') || 'Search products...'}
                      value={searchQuery}
                      onChange={handleSearch}
                      aria-label={t('searchProducts') || 'Search products'}
                    />
                    {searchQuery && (
                      <button className="clear-search" onClick={() => setSearchQuery('')}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="toolbar-right">
                  <div className="result-count">
                    <span className="count">{filteredApps.length}</span>
                    <span className="label">products</span>
                    {pagination.totalItems > 0 && (
                      <span className="total">of {pagination.totalItems}</span>
                    )}
                  </div>
                  <div className="view-toggle desktop">
                    <button 
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => toggleViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <FontAwesomeIcon icon={faThLarge} />
                    </button>
                    <button 
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => toggleViewMode('list')}
                      aria-label="List view"
                    >
                      <FontAwesomeIcon icon={faThList} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(activeFilter !== 'all' || searchQuery || showOnlyFeatured || selectedPlatforms.length > 0) && (
                <div className="active-filters">
                  <span className="active-filters-label">Active filters:</span>
                  {activeFilter !== 'all' && (
                    <span className="filter-tag" onClick={() => handleFilterChange('all')}>
                      {categories.find(c => c.slug === activeFilter || c.id === activeFilter)?.name || activeFilter}
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="filter-tag" onClick={() => setSearchQuery('')}>
                      "{searchQuery}"
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                  {showOnlyFeatured && (
                    <span className="filter-tag" onClick={() => setShowOnlyFeatured(false)}>
                      Featured
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  )}
                  {selectedPlatforms.map(platform => (
                    <span key={platform} className="filter-tag" onClick={() => togglePlatform(platform)}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  ))}
                  <button className="clear-all-filters" onClick={clearAllFilters}>
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid/List */}
              {filteredApps.length > 0 ? (
                <div className={`products-container ${viewMode}`}>
                  {filteredApps.map((app, index) => {
                    const categoryLabel = getCategoryLabel(app)
                    const productSlug = app.slug || app.id
                    const screenshotUrl = getScreenshotUrl(app)
                    const hasImage = hasScreenshots(app) && !imageErrors[app.id]
                    
                    return (
                      <Link to={`/product/${productSlug}`} className="product-card-link" key={app.id}>
                        <div className={`product-card ${viewMode}`} style={{ animationDelay: `${index * 0.05}s` }}>
                          <div className="product-card-image">
                            {hasImage ? (
                              <img 
                                src={screenshotUrl} 
                                alt={app.screenshots[0]?.alt_text || app.title}
                                onError={() => handleImageError(app.id)}
                                loading="lazy"
                              />
                            ) : (
                              <div className={`product-icon ${getIconBgClass(app.icon_bg || 'green')}`}>
                                <FontAwesomeIcon icon={app.icon || faSeedling} />
                              </div>
                            )}
                            {app.is_featured && (
                              <span className="featured-badge">Featured</span>
                            )}
                            {app.badges && app.badges.length > 0 && (
                              <div className="product-badges">
                                {app.badges.slice(0, 2).map((badge, idx) => (
                                  <span key={idx} className={`badge ${getBadgeColor(badge)}`}>
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="product-card-body">
                            <div className="product-card-header">
                              <h4>{app.title}</h4>
                              <span className="product-category">{categoryLabel}</span>
                            </div>
                            <p className="product-description">{app.short_description}</p>
                            <div className="product-card-footer">
                              <div className="product-meta">
                                <span className="rating">
                                  {renderStars(app.rating)} {app.rating || '0.0'}
                                </span>
                                <span className="downloads">
                                  <FontAwesomeIcon icon={faDownload} /> {app.downloads_count || '0'}
                                </span>
                              </div>
                              <span className="learn-more">
                                Learn More <FontAwesomeIcon icon={faArrowRight} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button className="btn-primary" onClick={clearAllFilters}>
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-info">
                    Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} products
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.previous || loading}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} /> Previous
                    </button>
                    <div className="pagination-pages">
                      {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                        let pageNum
                        if (pagination.totalPages <= 7) {
                          pageNum = i + 1
                        } else if (pagination.currentPage <= 4) {
                          pageNum = i + 1
                        } else if (pagination.currentPage >= pagination.totalPages - 3) {
                          pageNum = pagination.totalPages - 6 + i
                        } else {
                          pageNum = pagination.currentPage - 3 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            className={`pagination-page ${pagination.currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.next || loading}
                    >
                      Next <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="store-bottom">
          <span>{t('copyright') || '© 2026 KALRO. All rights reserved.'}</span>
          <div className="bottom-links">
            <a href="#">{t('privacy') || 'Privacy'}</a>
            <a href="#">{t('terms') || 'Terms'}</a>
            <a href="#">{t('about') || 'About'}</a>
            <a href="#">{t('support') || 'Support'}</a>
          </div>
        </div>
      </div>

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div className="filter-overlay" onClick={() => setIsFilterOpen(false)} />
      )}
    </main>
  )
}

export default Store