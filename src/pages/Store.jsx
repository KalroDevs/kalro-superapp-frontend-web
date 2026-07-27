import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'  // Add this import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStar, faDownload, faArrowRight, faThLarge, faSlidersH,
  faRobot, faCloudSun, faTrowel, faBug, faBook, faStore,
  faIdCard, faMicroscope, faLightbulb, faSatelliteDish, faCoins,
  faQrcode, faChartPie, faCloud, faSeedling, faMap, faChartLine,
  faHorseHead, faLeaf, faCalendarAlt, faExclamationTriangle,
  faDisease, faChalkboardTeacher, faLink as faLinkIcon, faPlug, faVial,
  faDatabase, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAccessibility } from '../context/AccessibilityContext'
import './Store.css'

const Store = () => {
  const { t, currentLanguage } = useLanguage()
  const { highContrast } = useAccessibility()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredApps, setFilteredApps] = useState([])

  // Categories with translations
  const categories = [
    { id: 'all', icon: faThLarge, label: t('categoryAll') },
    { id: 'advisory', icon: faRobot, label: t('categoryAdvisory') },
    { id: 'climate', icon: faCloudSun, label: t('categoryClimate') },
    { id: 'soil', icon: faTrowel, label: t('categorySoil') },
    { id: 'health', icon: faBug, label: t('categoryHealth') },
    { id: 'knowledge', icon: faBook, label: t('categoryKnowledge') },
    { id: 'markets', icon: faStore, label: t('categoryMarkets') },
    { id: 'identity', icon: faIdCard, label: t('categoryIdentity') },
    { id: 'lab', icon: faMicroscope, label: t('categoryLab') },
    { id: 'research', icon: faLightbulb, label: t('categoryResearch') },
    { id: 'precision', icon: faSatelliteDish, label: t('categoryPrecision') },
    { id: 'finance', icon: faCoins, label: t('categoryFinance') },
    { id: 'traceability', icon: faQrcode, label: t('categoryTraceability') },
    { id: 'enterprise', icon: faChartPie, label: t('categoryEnterprise') },
    { id: 'data', icon: faCloud, label: t('categoryData') }
  ]

  // All apps data with translations (simplified for testing)
  const apps = [
    { id: 1, title: 'KALRO Selector', category: 'advisory', icon: faSeedling, iconBg: 'green', description: 'AI-powered crop and variety recommendation engine.', rating: 4.8, downloads: '8.5K+', badge: 'Popular' },
    { id: 2, title: 'Digital Climate Advisory Service(DCAS)', category: 'advisory', icon: faRobot, iconBg: 'blue', description: 'Personalized recommendations for crops, livestock, and soil.', rating: 4.9, downloads: '12K+', badge: 'Featured' },
    { id: 3, title: 'Soil Health Recommender', category: 'advisory', icon: faTrowel, iconBg: 'brown', description: 'Nutrient, liming, and organic matter recommendations.', rating: 4.6, downloads: '7.1K+', badge: '' },
    { id: 4, title: 'Crop Health Recommender', category: 'advisory', icon: faChartLine, iconBg: 'purple', description: 'Location-based crop suitability and variety selection.', rating: 4.7, downloads: '6.3K+', badge: '' },
    { id: 5, title: 'Livestock Recommendation', category: 'advisory', icon: faHorseHead, iconBg: 'teal', description: 'Breed, feeding, and health recommendations for livestock.', rating: 4.5, downloads: '4.2K+', badge: '' },
    { id: 6, title: 'Pasture Recommendation', category: 'advisory', icon: faLeaf, iconBg: 'orange', description: 'Optimal pasture and forage species for your region.', rating: 4.3, downloads: '2.8K+', badge: '' },
    { id: 7, title: 'Weather Advisory', category: 'climate', icon: faCloudSun, iconBg: 'cyan', description: 'Localized forecasts, seasonal outlooks, and alerts.', rating: 4.9, downloads: '22K+', badge: 'Top' },
    { id: 8, title: 'Kenya Agricultural Observatory Platform (KAOP)', category: 'climate', icon: faSatelliteDish, iconBg: 'blue', description: 'Real-time climate, drought, and environmental monitoring.', rating: 4.7, downloads: '15K+', badge: 'Featured' },
    { id: 9, title: 'Maize TELA', category: 'climate', icon: faCalendarAlt, iconBg: 'orange', description: 'Seasonal rainfall and temperature outlooks.', rating: 4.6, downloads: '9.8K+', badge: '' },
    { id: 10, title: 'KALRO Mkulima', category: 'climate', icon: faExclamationTriangle, iconBg: 'red', description: 'Early warning and drought severity tracking.', rating: 4.5, downloads: '6.7K+', badge: '' },
  ]

  const featuredApps = [
    { id: 'f1', productId: 2, title: '-or', icon: faRobot, gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))', description: 'Personalized recommendations for crops, livestock, and soil.', badge: 'AI-Powered' },
    { id: 'f2', productId: 7, title: 'Weather Advisory', icon: faCloudSun, gradient: 'linear-gradient(135deg, #0067b8, #50e6ff)', description: 'Localized forecasts, seasonal outlooks, and alerts.', badge: 'Real-time' },
    { id: 'f3', productId: 1, title: 'KALRO Selector', icon: faSeedling, gradient: 'linear-gradient(135deg, #d83b01, #f4b942)', description: 'AI-powered crop and variety recommendation engine.', badge: 'Popular' }
  ]

  useEffect(() => {
    filterApps()
  }, [activeFilter, searchQuery, currentLanguage])

  const filterApps = () => {
    let filtered = apps
    if (activeFilter !== 'all') {
      filtered = filtered.filter(app => app.category === activeFilter)
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      )
    }
    setFilteredApps(filtered)
  }

  const handleFilterChange = (categoryId) => {
    setActiveFilter(categoryId)
    setSearchQuery('')
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setActiveFilter('all')
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
    const fullStars = Math.floor(rating)
    const stars = []
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="stars" />)
    }
    if (rating % 1 >= 0.5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStar} className="stars" style={{ opacity: 0.5 }} />)
    }
    return stars
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
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faStar} /> {t('featuredProducts')}</h3>
          <a href="#">{t('seeAll')} <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <div className="featured-scroll">
          {featuredApps.map(app => (
            <Link to={`/product/${app.productId}`} className="featured-card-link" key={app.id}>
              <div className="featured-card">
                <div className="featured-img" style={{ background: app.gradient }}>
                  <FontAwesomeIcon icon={app.icon} />
                  <span className="overlay">{app.badge}</span>
                </div>
                <div className="featured-body">
                  <h4>{app.title}</h4>
                  <p>{app.description}</p>
                  <span className="btn-link">
                    {t('learnMore')} <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat.id)}
              >
                <FontAwesomeIcon icon={cat.icon} /> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faThLarge} /> {t('allDigitalProducts')}</h3>
          <span className="result-count">{filteredApps.length} {t('products')}</span>
        </div>
        <div className="app-grid">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => {
              const categoryLabel = categories.find(c => c.id === app.category)?.label || app.category
              return (
                <Link to={`/product/${app.id}`} className="app-card-link" key={app.id}>
                  <div className="app-card" data-category={app.category}>
                    <div className={`app-icon ${getIconBgClass(app.iconBg)}`}>
                      <FontAwesomeIcon icon={app.icon} />
                    </div>
                    <h4>{app.title}</h4>
                    <span className="app-category">{categoryLabel}</span>
                    <div className="app-desc">{app.description}</div>
                    <div className="app-meta">
                      <span>
                        {renderStars(app.rating)} {app.rating}
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faDownload} /> {app.downloads}
                      </span>
                      {app.badge && <span className="badge">{app.badge}</span>}
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="no-results">
              <p>{t('noProductsFound')}</p>
              <button className="btn primary" onClick={() => { setActiveFilter('all'); setSearchQuery('') }}>
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>

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