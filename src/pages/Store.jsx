import React, { useState, useEffect } from 'react'
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
  faShieldAlt, faGlobe, faImage
} from '@fortawesome/free-solid-svg-icons'
// Brand icons - imported separately
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
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredApps, setFilteredApps] = useState([])
  const [allApps, setAllApps] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredApps, setFeaturedApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    next: null,
    previous: null
  })

  // Fallback image when no screenshot is available
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

  // Get thumbnail URL
  const getThumbnailUrl = (app) => {
    if (imageErrors[app.id]) {
      return FALLBACK_IMAGE
    }
    if (app.screenshots && app.screenshots.length > 0) {
      // Use image_url or fallback to image field
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
        // 1. Fetch categories first
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
        
        const productsResult = await fetchWithErrorHandling(
          () => store.getProducts({ ...params, page: pagination.currentPage, page_size: 20 }),
          'Failed to load products'
        )
        
        if (productsResult.success && productsResult.data) {
          const productData = productsResult.data
          const items = productData.results || productData || []
          setAllApps(items)
          setFilteredApps(items)
          
          if (productData.results) {
            setPagination({
              currentPage: pagination.currentPage,
              totalPages: Math.ceil(productData.count / 20) || 1,
              totalItems: productData.count || items.length,
              next: productData.next,
              previous: productData.previous
            })
          }
        } else {
          setError('Failed to load products')
          // Use fallback data
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
  }, [activeFilter, searchQuery, pagination.currentPage])

  // Filter apps when category or search changes
  useEffect(() => {
    const filterApps = () => {
      let filtered = allApps
      
      if (activeFilter !== 'all') {
        filtered = filtered.filter(app => {
          const appCategory = app.category_slug || app.category?.slug || app.category
          return appCategory === activeFilter
        })
      }
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(app => 
          (app.title || '').toLowerCase().includes(query) ||
          (app.short_description || '').toLowerCase().includes(query) ||
          (app.category_name || '').toLowerCase().includes(query)
        )
      }
      
      setFilteredApps(filtered)
    }
    
    filterApps()
  }, [activeFilter, searchQuery, allApps])

  // Handle filter change
  const handleFilterChange = (categoryId) => {
    setActiveFilter(categoryId)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const getIconBgClass = (bg) => {
    const classes = {
      'green': 'green', 'blue': 'blue', 'orange': 'orange', 'purple': 'purple',
      'brown': 'brown', 'teal': 'teal', 'indigo': 'indigo', 'cyan': 'cyan',
      'amber': 'amber', 'deep-purple': 'deep-purple', 'red': 'red'
    }
    return classes[bg] || 'green'
  }

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

  // Get badge color based on badge text
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
      rating: '0.0',
      downloads_count: '45,000',
      badges: ['Verified Official', 'KALRO Certified', 'Free Access'],
      is_featured: true,
      screenshots: [],
      links: {
        web_app: 'https://selector.kalro.org',
        google_play: 'https://play.google.com/store/apps/details?id=com.kalro.selector'
      }
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
      rating: '0.0',
      downloads_count: '60,000',
      badges: ['Verified Official', 'Ministry of Agriculture and Livestock Development', 'Free Access'],
      is_featured: true,
      screenshots: [],
      links: {
        web_app: 'https://kamis.kilimo.go.ke/'
      }
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
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading products...</p>
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
          <div>
            <h2>{t('storeWelcome')}</h2>
            <p>{t('storeDescription')}</p>
          </div>
          <a href="#" className="btn-hero">
            <FontAwesomeIcon icon={faArrowRight} /> {t('exploreAll')}
          </a>
        </section>

        {/* Featured Products */}
        {/* <div className="section-header">
          <h3><FontAwesomeIcon icon={faStar} /> {t('featuredProducts')}</h3>
          <a href="#">{t('seeAll')} <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <div className="featured-scroll">
          {featuredApps.length > 0 ? (
            featuredApps.map(app => {
              const imageUrl = app.screenshots && app.screenshots.length > 0 
                ? (app.screenshots[0].image_url || app.screenshots[0].image) 
                : null
              
              return (
                <Link to={`/product/${app.slug || app.productId}`} className="featured-card-link" key={app.id}>
                  <div className="featured-card">
                    <div className="featured-img" style={{ 
                      background: imageUrl ? `url(${imageUrl})` : (app.gradient || 'linear-gradient(135deg, var(--primary), var(--secondary))')
                    }}>
                      {!imageUrl && <FontAwesomeIcon icon={app.icon || faStore} />}
                      <span className="overlay">{app.badge || 'Featured'}</span>
                    </div>
                    <div className="featured-body">
                      <h4>{app.title}</h4>
                      <p>{app.short_description}</p>
                      <span className="btn-link">
                        {t('learnMore')} <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <p>No featured products available</p>
          )}
        </div> */}

        {/* Category Filter */}
        <div className="filter-section">
          <div className="filter-header">
            <div className="filter-label">
              <FontAwesomeIcon icon={faSlidersH} /> {t('filterByCategory')}
            </div>
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={searchQuery}
                onChange={handleSearch}
                aria-label={t('searchProducts')}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="filter-grid">
            <button
              key="all"
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <FontAwesomeIcon icon={faThLarge} /> All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id || cat.slug}
                className={`filter-btn ${activeFilter === (cat.slug || cat.id) ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat.slug || cat.id)}
              >
                <FontAwesomeIcon icon={cat.icon || faThLarge} /> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faThLarge} /> {t('allDigitalProducts')}</h3>
          <span className="result-count">
            {filteredApps.length} {t('products')}
            {pagination.totalItems > 0 && ` of ${pagination.totalItems}`}
          </span>
        </div>
        
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button className="btn outline" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        <div className="app-grid">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => {
              const categoryLabel = getCategoryLabel(app)
              const productSlug = app.slug || app.id
              const screenshotUrl = getScreenshotUrl(app)
              const hasImage = hasScreenshots(app) && !imageErrors[app.id]
              
              return (
                <Link to={`/product/${productSlug}`} className="app-card-link" key={app.id}>
                  <div className="app-card" data-category={app.category_slug || app.category}>
                    {/* Product Image or Icon */}
                    {hasImage ? (
                      <div className="app-image">
                        <img 
                          src={screenshotUrl} 
                          alt={app.screenshots[0]?.alt_text || app.title}
                          onError={() => handleImageError(app.id)}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className={`app-icon ${getIconBgClass(app.icon_bg || 'green')}`}>
                        <FontAwesomeIcon icon={app.icon || faSeedling} />
                      </div>
                    )}
                    
                    <h4>{app.title}</h4>
                    <span className="app-category">{categoryLabel}</span>
                    <div className="app-desc">{app.short_description}</div>
                    
                    <div className="app-meta">
                      <span>
                        {renderStars(app.rating)} {app.rating || '0.0'}
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faDownload} /> {app.downloads_count || '0'}
                      </span>
                      {app.is_featured && (
                        <span className="badge badge-featured">Featured</span>
                      )}
                    </div>
                    
                    {app.badges && app.badges.length > 0 && (
                      <div className="app-badges">
                        {app.badges.slice(0, 2).map((badge, index) => (
                          <span key={index} className={`badge ${getBadgeColor(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="no-results">
              <p>{t('noProductsFound')}</p>
              <button className="btn primary" onClick={() => { handleFilterChange('all'); setSearchQuery('') }}>
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>

        {/* Pagination - Enhanced */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {((pagination.currentPage - 1) * 20) + 1} - {Math.min(pagination.currentPage * 20, pagination.totalItems)} of {pagination.totalItems} products
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

        {/* Bottom Section */}
        <div className="store-bottom">
          <span>{t('copyright')}</span>
          <div className="bottom-links">
            <a href="#">{t('privacy')}</a>
            <a href="#">{t('terms')}</a>
            <a href="#">{t('about')}</a>
            <a href="#">{t('support')}</a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Store