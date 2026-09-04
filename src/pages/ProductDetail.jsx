// ProductDetail.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, faBook, faStar, faDownload, faGlobe, faShieldAlt,
  faHeart, faPlay, faRocket, faInfoCircle, faCheckCircle,
  faExclamationCircle, faSpinner, faTimes, faArrowRight,
  faThumbsUp, faReply, faPaperPlane, faComments, faUserCircle,
  faChevronLeft, faChevronRight, faHeadset, faStar as faStarSolid,
  faImage, faMobile, faDesktop, faTablet, faUsers, faClock,
  faTag, faCalendarAlt, faBuilding, faLanguage, faLock,
  faCloud, faDatabase, faLink, faFileAlt, faLayerGroup,
  faMapMarkerAlt, faChartLine, faTools, faShieldVirus,
  faSeedling, faCow, faTree, faTractor, faHandHoldingHeart,
  faCertificate, faAward, faUserCheck, faBuildingColumns,
  faBullseye
} from '@fortawesome/free-solid-svg-icons'
import { faAndroid, faApple, faWindows } from '@fortawesome/free-brands-svg-icons'

import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import './ProductDetail.css'

// Fallback images
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23009640"/%3E%3Ctext x="300" y="190" font-family="Arial" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle"%3EKALRO%3C/text%3E%3Ctext x="300" y="225" font-family="Arial" font-size="16" fill="%23dff6dd" text-anchor="middle" dominant-baseline="middle"%3EApp Screenshot%3C/text%3E%3C/svg%3E'
const FALLBACK_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80"%3E%3Crect width="100" height="80" fill="%23cccccc"/%3E%3Ctext x="50" y="45" font-family="Arial" font-size="12" fill="%23666666" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E'

// Icon mapping for categories and types
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || ''
  if (name.includes('farm') || name.includes('production')) return faTractor
  if (name.includes('advisory') || name.includes('extension')) return faHandHoldingHeart
  if (name.includes('market')) return faChartLine
  if (name.includes('research')) return faBuildingColumns
  if (name.includes('livestock')) return faCow
  if (name.includes('crop')) return faSeedling
  if (name.includes('forestry')) return faTree
  return faStore
}

const ProductDetail = () => {
  const { slug } = useParams()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { store, fetchWithErrorHandling } = useApi()

  // State
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' })
  const [isSaved, setIsSaved] = useState(false)
  const [launchStatus, setLaunchStatus] = useState({ type: '', message: '', show: false })
  const [toasts, setToasts] = useState([])
  const [isLaunching, setIsLaunching] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

  const activeTimers = useRef(new Set())

  const safeSetTimeout = (callback, delay) => {
    const timerId = setTimeout(() => {
      activeTimers.current.delete(timerId)
      callback()
    }, delay)
    activeTimers.current.add(timerId)
    return timerId
  }

  useEffect(() => {
    return () => {
      activeTimers.current.forEach((id) => clearTimeout(id))
      activeTimers.current.clear()
    }
  }, [])

  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVideoModalOpen])

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newToast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])
    safeSetTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }))
  }

  const getImageUrl = (image, isThumbnail = false) => {
    if (!image) return isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE
    if (imageErrors[image.id]) {
      return isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE
    }
    return image.image_url || image.image || (isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE)
  }

  const getScreenshots = (product) => {
    if (!product) return []
    if (product.screenshots && product.screenshots.length > 0) {
      return product.screenshots
    }
    return []
  }

  // Fetch Product Data
  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      if (!slug) {
        if (isMounted) {
          setError('No product slug provided')
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await fetchWithErrorHandling(
          () => store.getProductBySlug(slug),
          'Failed to load product details'
        )

        if (!isMounted) return

        if (result?.success && result?.data) {
          setProduct(result.data)
          setCurrentImageIndex(0)

          const saved = localStorage.getItem(`kalro_saved_${result.data.id}`)
          setIsSaved(saved === 'true')

          const reviewsResult = await fetchWithErrorHandling(
            () => store.getProductReviews(slug),
            'Failed to load reviews'
          )

          if (isMounted && reviewsResult?.success) {
            const reviewsData = Array.isArray(reviewsResult.data)
              ? reviewsResult.data
              : reviewsResult.data?.results || []
            setComments(reviewsData)
          }

          const relatedResult = await fetchWithErrorHandling(
            () => store.getRelatedProducts(slug),
            'Failed to load related products'
          )

          if (isMounted && relatedResult?.success) {
            const relatedData = Array.isArray(relatedResult.data)
              ? relatedResult.data
              : relatedResult.data?.results || []
            setRelatedProducts(relatedData)
          }
        } else {
          setError(result?.error || 'Product not found')
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load product details. Please refresh the page.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [slug, fetchWithErrorHandling, store])

  // Handlers
  const handleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save favorites', 'error')
      return
    }

    const newState = !isSaved
    setIsSaved(newState)

    try {
      await store.toggleFavorite(slug)
      localStorage.setItem(`kalro_saved_${product.id}`, newState.toString())
      showToast(
        newState ? 'Product saved to favorites' : 'Removed from favorites',
        newState ? 'success' : 'info'
      )
    } catch (error) {
      showToast('Failed to update favorites', 'error')
      setIsSaved(!newState)
    }
  }

  const handleLaunch = async () => {
    setIsLaunching(true)
    setLaunchStatus({ type: 'loading', message: 'Preparing to launch...', show: true })

    try {
      await store.trackDownload(slug)

      await new Promise((res) => safeSetTimeout(res, 1500))
      setLaunchStatus({ type: 'loading', message: 'Verifying access...', show: true })
      
      await new Promise((res) => safeSetTimeout(res, 1000))
      setLaunchStatus({ type: 'loading', message: 'Launching application...', show: true })
      
      await new Promise((res) => safeSetTimeout(res, 1000))
      setLaunchStatus({ type: 'success', message: 'App launched successfully!', show: true })
      showToast('🚀 Application launched successfully!', 'success')

      if (product?.launch_url) {
        window.open(product.launch_url, '_blank')
      }

      safeSetTimeout(() => {
        setLaunchStatus({ type: '', message: '', show: false })
        setIsLaunching(false)
      }, 3000)
    } catch (error) {
      setLaunchStatus({ type: 'error', message: 'Unable to launch the app. Please try again.', show: true })
      showToast('Failed to launch app. Please try again.', 'error')
      setIsLaunching(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      showToast('Please login to submit a review', 'error')
      return
    }

    if (!newComment.name.trim() || !newComment.email.trim() || !newComment.text.trim()) {
      showToast('Please fill in all fields', 'error')
      return
    }

    if (selectedRating === 0) {
      showToast('Please select a rating', 'error')
      return
    }

    try {
      const reviewData = {
        rating: selectedRating,
        comment: newComment.text,
        comment_sw: newComment.text
      }

      await store.addReview(slug, reviewData)

      const comment = {
        id: `${Date.now()}-${Math.random()}`,
        author: newComment.name,
        created_at: new Date().toISOString(),
        rating: selectedRating,
        text: newComment.text,
        likes: 0
      }

      setComments((prev) => [comment, ...prev])
      setNewComment({ name: '', email: '', text: '' })
      setSelectedRating(0)
      setHoverRating(0)
      showToast('✅ Your review has been submitted!', 'success')
    } catch (error) {
      showToast('Failed to submit review. Please try again.', 'error')
    }
  }

  const renderStars = (rating, interactive = false) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 0)
    const fullStars = Math.floor(numRating)

    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isActive = interactive
        ? starValue <= (hoverRating || selectedRating)
        : starValue <= fullStars

      return (
        <span
          key={i}
          className={`star ${isActive ? 'active' : ''}`}
          onClick={() => interactive && setSelectedRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{
            color: isActive ? '#f4b942' : '#d0d0d0',
            cursor: interactive ? 'pointer' : 'default'
          }}
        >
          <FontAwesomeIcon icon={faStarSolid} />
        </span>
      )
    })
  }

  const screenshots = getScreenshots(product)
  const totalImages = screenshots.length || 1

  const nextImage = () => {
    if (screenshots.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    if (screenshots.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const getPlatformIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || ''
    if (platformLower.includes('android')) return faAndroid
    if (platformLower.includes('ios') || platformLower.includes('apple')) return faApple
    if (platformLower.includes('web')) return faGlobe
    if (platformLower.includes('windows')) return faWindows
    if (platformLower.includes('mobile')) return faMobile
    return faCloud
  }

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <p>{error || "The product you're looking for doesn't exist."}</p>
            <Link to="/?page=store" className="btn primary" style={{ marginTop: '24px' }}>
              <FontAwesomeIcon icon={faArrowRight} /> Browse All Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/?page=store">App Store</Link>
            <span>/</span>
            <Link to={`/store/category/${product.category_slug || product.category}`}>
              {product.category_name || 'Category'}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.title}</span>
          </nav>

          {/* Product Overview */}
          <section className="product-details" id="overview">
            <div className="product-media">
              <div className="gallery-container">
                <div className="gallery-main">
                  {screenshots.length > 0 ? (
                    <img
                      src={getImageUrl(screenshots[currentImageIndex])}
                      alt={screenshots[currentImageIndex]?.alt_text || product.title}
                      onError={() => handleImageError(screenshots[currentImageIndex]?.id)}
                    />
                  ) : (
                    <div className="gallery-placeholder">
                      <FontAwesomeIcon icon={faImage} size="4x" />
                      <p>No screenshots available</p>
                    </div>
                  )}
                  {screenshots.length > 1 && (
                    <>
                      <button className="gallery-nav gallery-nav-left" onClick={prevImage} aria-label="Previous image">
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button className="gallery-nav gallery-nav-right" onClick={nextImage} aria-label="Next image">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </>
                  )}
                </div>

                {screenshots.length > 1 && (
                  <>
                    <div className="gallery-thumbnails">
                      {screenshots.map((screenshot, index) => (
                        <div
                          key={screenshot.id}
                          className={`gallery-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={getImageUrl(screenshot, true)}
                            alt={screenshot.alt_text || `Screenshot ${index + 1}`}
                            onError={() => handleImageError(screenshot.id)}
                          />
                          {screenshot.is_video && (
                            <div className="thumbnail-video-badge">
                              <FontAwesomeIcon icon={faPlay} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="gallery-counter">
                      {currentImageIndex + 1} / {screenshots.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="product-info">
              <span className="category-tag">
                <FontAwesomeIcon icon={getCategoryIcon(product.category_name)} /> {product.category_name || 'Product'}
              </span>
              <h1>{product.title}</h1>

              <div className="rating">
                <span className="stars">{renderStars(product.rating || 0)}</span>
                <span>{product.rating || 0}</span>
                <span className="count">({product.reviews_count || 0} reviews)</span>
              </div>

              {product.badges && product.badges.length > 0 && (
                <div className="badge-group">
                  {product.badges.map((badge, index) => (
                    <span key={index} className={`badge ${index % 2 === 0 ? '' : 'secondary'}`}>
                      <FontAwesomeIcon icon={index === 0 ? faCertificate : index === 1 ? faAward : faShieldAlt} /> {badge}
                    </span>
                  ))}
                </div>
              )}

              <p className="description">{product.short_description}</p>

              {/* Long Description */}
              {product.long_description && (
                <div className="long-description">
                  <div dangerouslySetInnerHTML={{ __html: product.long_description }} />
                </div>
              )}

              {/* Meta Grid */}
              <div className="meta-grid">
                <div className="meta-item">
                  <FontAwesomeIcon icon={faDownload} />
                  <span><strong>Downloads:</strong> {product.downloads_count || product.downloads || '0'}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <span><strong>Users:</strong> {product.users_count || '0'}</span>
                </div>
                {product.version && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faTag} />
                    <span><strong>Version:</strong> {product.version}</span>
                  </div>
                )}
                {product.purpose && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faBullseye} />
                    <span><strong>Purpose:</strong> {product.purpose}</span>
                  </div>
                )}
                {product.is_featured && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faStarSolid} />
                    <span><strong>Status:</strong> Featured</span>
                  </div>
                )}
                {product.is_verified && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span><strong>Status:</strong> Verified</span>
                  </div>
                )}
                {product.access_model && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={product.access_model === 'free' ? faCheckCircle : faLock} />
                    <span><strong>Access:</strong> {product.access_model === 'free' ? 'Free' : 'Paid'}</span>
                  </div>
                )}
                {product.maturity_level && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span><strong>Maturity:</strong> {product.maturity_level}</span>
                  </div>
                )}
                <div className="meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span><strong>Updated:</strong> {new Date(product.last_updated || product.updated_at).toLocaleDateString()}</span>
                </div>
                {product.languages && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faLanguage} />
                    <span><strong>Languages:</strong> {product.languages}</span>
                  </div>
                )}
                {product.security && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faShieldVirus} />
                    <span><strong>Security:</strong> {product.security}</span>
                  </div>
                )}
                {product.data_owner && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faBuilding} />
                    <span><strong>Data Owner:</strong> {product.data_owner}</span>
                  </div>
                )}
              </div>

              {/* Platforms */}
              {product.platforms && product.platforms.length > 0 && (
                <div className="platform-badges">
                  <span className="platform-label"><FontAwesomeIcon icon={faDesktop} /> Platforms:</span>
                  {product.platforms.map((platform, index) => (
                    <span key={index} className="platform-badge available">
                      <FontAwesomeIcon icon={getPlatformIcon(platform)} />
                      {platform}
                    </span>
                  ))}
                </div>
              )}

              {/* Provider Info */}
              {product.provider_detail && (
                <div className="provider-info">
                  {product.provider_detail.logo && (
                    <div className="provider-logo">
                      <img src={product.provider_detail.logo} alt={product.provider_detail.name} />
                    </div>
                  )}
                  <div className="provider-details">
                    <h4>
                      <FontAwesomeIcon icon={faBuilding} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                      {product.provider_detail.name}
                      {product.provider_detail.acronym && ` (${product.provider_detail.acronym})`}
                      {product.provider_detail.is_verified && (
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#27c93f', marginLeft: '8px' }} />
                      )}
                    </h4>
                    {product.provider_detail.description && (
                      <p>{product.provider_detail.description}</p>
                    )}
                    {product.provider_detail.website && (
                      <a href={product.provider_detail.website} target="_blank" rel="noopener noreferrer" className="provider-link">
                        <FontAwesomeIcon icon={faGlobe} /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* App Links */}
              {(product.website_url || product.launch_url || product.documentation_url || product.support_email) && (
                <div className="app-links">
                  <h4>Available on</h4>
                  <div className="app-links-grid">
                    {product.website_url && (
                      <a href={product.website_url} target="_blank" rel="noopener noreferrer" className="app-link web">
                        <FontAwesomeIcon icon={faGlobe} /> Website
                      </a>
                    )}
                    {product.launch_url && (
                      <a href={product.launch_url} target="_blank" rel="noopener noreferrer" className="app-link play">
                        <FontAwesomeIcon icon={faRocket} /> Launch App
                      </a>
                    )}
                    {product.documentation_url && (
                      <a href={product.documentation_url} target="_blank" rel="noopener noreferrer" className="app-link docs">
                        <FontAwesomeIcon icon={faBook} /> Documentation
                      </a>
                    )}
                    {product.api_documentation_url && (
                      <a href={product.api_documentation_url} target="_blank" rel="noopener noreferrer" className="app-link docs">
                        <FontAwesomeIcon icon={faLink} /> API Docs
                      </a>
                    )}
                    {product.support_email && (
                      <a href={`mailto:${product.support_email}`} className="app-link support">
                        <FontAwesomeIcon icon={faHeadset} /> Support
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="actions-row">
                <button
                  className="btn primary btn-large"
                  onClick={handleLaunch}
                  disabled={isLaunching}
                >
                  <FontAwesomeIcon icon={isLaunching ? faSpinner : faRocket} spin={isLaunching} />
                  {isLaunching ? 'Launching...' : 'Launch app'}
                </button>
                <button className={`btn outline btn-large ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                  <FontAwesomeIcon icon={faHeart} style={{ color: isSaved ? '#c62828' : 'inherit' }} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              {launchStatus.show && (
                <div className={`launch-status show ${launchStatus.type}`}>
                  <span className="status-icon">
                    {launchStatus.type === 'loading' && <FontAwesomeIcon icon={faSpinner} spin />}
                    {launchStatus.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
                    {launchStatus.type === 'error' && <FontAwesomeIcon icon={faExclamationCircle} />}
                  </span>
                  <span className="status-text">{launchStatus.message}</span>
                </div>
              )}
            </div>
          </section>

          {/* Tabs for additional information */}
          <div className="detail-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <FontAwesomeIcon icon={faLayerGroup} /> Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <FontAwesomeIcon icon={faTools} /> Technical
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <FontAwesomeIcon icon={faComments} /> Reviews ({comments.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <section className="features-section">
                    <h2>
                      <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary)', marginRight: '12px' }} />
                      Key Features
                    </h2>
                    <div className="features-grid">
                      {product.features.map((feature, index) => (
                        <div className="feature-item" key={index}>
                          <div className="icon">
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </div>
                          <h4>Feature {index + 1}</h4>
                          <p>{feature}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Value Chains */}
                {product.value_chains_detail && product.value_chains_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faSeedling} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Value Chains
                    </h3>
                    <div className="info-grid">
                      {product.value_chains_detail.map((vc) => (
                        <div className="info-item" key={vc.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={vc.subsector_name === 'Livestock' ? faCow : faSeedling} />
                          </span>
                          <div>
                            <strong>{vc.name}</strong>
                            {vc.name_sw && <span className="info-item-sw">{vc.name_sw}</span>}
                            <span className="info-item-sub">{vc.subsector_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Target Users */}
                {product.target_users_detail && product.target_users_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faUserCheck} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Target Users
                    </h3>
                    <div className="info-grid">
                      {product.target_users_detail.map((user) => (
                        <div className="info-item" key={user.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faUserCircle} />
                          </span>
                          <div>
                            <strong>{user.name}</strong>
                            {user.name_sw && <span className="info-item-sw">{user.name_sw}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <>
                {/* Subsectors */}
                {product.subsectors_detail && product.subsectors_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faLayerGroup} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Subsectors
                    </h3>
                    <div className="info-grid">
                      {product.subsectors_detail.map((sub) => (
                        <div className="info-item" key={sub.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={
                              sub.name === 'Crops' ? faSeedling : 
                              sub.name === 'Livestock' ? faCow : 
                              sub.name.includes('Forestry') ? faTree : faStore
                            } />
                          </span>
                          <div>
                            <strong>{sub.name}</strong>
                            {sub.name_sw && <span className="info-item-sw">{sub.name_sw}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Geographic Coverage */}
                {product.geographic_coverage_detail && product.geographic_coverage_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Geographic Coverage
                    </h3>
                    <div className="info-grid">
                      {product.geographic_coverage_detail.map((geo) => (
                        <div className="info-item" key={geo.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                          </span>
                          <div>
                            <strong>{geo.name}</strong>
                            {geo.name_sw && <span className="info-item-sw">{geo.name_sw}</span>}
                            <span className="info-item-sub">{geo.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Secondary Categories */}
                {product.secondary_categories_detail && product.secondary_categories_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faStore} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Secondary Categories
                    </h3>
                    <div className="info-grid">
                      {product.secondary_categories_detail.map((cat) => (
                        <div className="info-item" key={cat.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faStore} />
                          </span>
                          <div>
                            <strong>{cat.name}</strong>
                            {cat.name_sw && <span className="info-item-sw">{cat.name_sw}</span>}
                            {cat.description && <span className="info-item-sub">{cat.description}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Technical Tab */}
            {activeTab === 'technical' && (
              <>
                {/* Technologies */}
                {product.technologies_detail && product.technologies_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faTools} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Technologies Used
                    </h3>
                    <div className="info-grid">
                      {product.technologies_detail.map((tech) => (
                        <div className="info-item" key={tech.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faCloud} />
                          </span>
                          <div>
                            <strong>{tech.name}</strong>
                            {tech.name_sw && <span className="info-item-sw">{tech.name_sw}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Delivery Channels */}
                {product.delivery_channels_detail && product.delivery_channels_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faMobile} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Delivery Channels
                    </h3>
                    <div className="info-grid">
                      {product.delivery_channels_detail.map((channel) => (
                        <div className="info-item" key={channel.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={
                              channel.name.includes('Android') ? faAndroid :
                              channel.name.includes('Web') ? faGlobe :
                              channel.name.includes('API') ? faLink :
                              faMobile
                            } />
                          </span>
                          <div>
                            <strong>{channel.name}</strong>
                            {channel.name_sw && <span className="info-item-sw">{channel.name_sw}</span>}
                            {channel.description && <span className="info-item-sub">{channel.description}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Value Chain Stages */}
                {product.value_chain_stages_detail && product.value_chain_stages_detail.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faChartLine} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Value Chain Stages
                    </h3>
                    <div className="info-grid">
                      {product.value_chain_stages_detail.map((stage) => (
                        <div className="info-item" key={stage.id}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faChartLine} />
                          </span>
                          <div>
                            <strong>{stage.name}</strong>
                            {stage.name_sw && <span className="info-item-sw">{stage.name_sw}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Specs */}
                {product.specs && product.specs.length > 0 && (
                  <section className="specs-section">
                    <h2>
                      <FontAwesomeIcon icon={faTools} style={{ color: 'var(--primary)', marginRight: '12px' }} />
                      Technical Specifications
                    </h2>
                    <div className="specs-grid">
                      {product.specs.map((spec, index) => {
                        const [label, value] = spec.includes(':') 
                          ? spec.split(':').map(s => s.trim()) 
                          : ['Info', spec]
                        return (
                          <div className="spec-item" key={index}>
                            <span className="label">{label}</span>
                            <span className="value">{value || spec}</span>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )}

                {/* Data Formats */}
                {product.data_formats && product.data_formats.length > 0 && (
                  <section className="info-section">
                    <h3>
                      <FontAwesomeIcon icon={faDatabase} style={{ color: 'var(--primary)', marginRight: '10px' }} />
                      Data Formats
                    </h3>
                    <div className="info-grid">
                      {product.data_formats.map((format, index) => (
                        <div className="info-item" key={index}>
                          <span className="info-item-icon">
                            <FontAwesomeIcon icon={faFileAlt} />
                          </span>
                          <div>
                            <strong>{format}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <section className="comments-section" id="comments">
                <h2>
                  <FontAwesomeIcon icon={faComments} style={{ color: 'var(--primary)', marginRight: '12px' }} /> User Reviews
                </h2>
                <p className="comment-subtitle">Share your experience with {product.title}</p>

                <form className="comment-form" onSubmit={handleSubmitComment}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="commentName">Full name</label>
                      <input
                        type="text"
                        id="commentName"
                        placeholder="e.g. John Kamau"
                        value={newComment.name}
                        onChange={(e) => setNewComment((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="commentEmail">Email address</label>
                      <input
                        type="email"
                        id="commentEmail"
                        placeholder="e.g. john@example.com"
                        value={newComment.email}
                        onChange={(e) => setNewComment((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Your rating</label>
                    <div className="rating-input">{renderStars(5, true)}</div>
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      {selectedRating > 0 ? `Rating: ${selectedRating} / 5` : 'Select a rating'}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="commentText">Your review</label>
                    <textarea
                      id="commentText"
                      placeholder="What did you think of the app? What features did you find most useful?"
                      value={newComment.text}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, text: e.target.value }))}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn primary">
                      <FontAwesomeIcon icon={faPaperPlane} /> Submit review
                    </button>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => {
                        setNewComment({ name: '', email: '', text: '' })
                        setSelectedRating(0)
                        setHoverRating(0)
                        showToast('Review cleared', 'info')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const dateStr = comment.created_at
                        ? new Date(comment.created_at).toLocaleDateString()
                        : 'Recently'

                      return (
                        <div className="comment-item" key={comment.id || `${comment.author}-${Math.random()}`}>
                          <div className="comment-header">
                            <span className="comment-author">
                              <FontAwesomeIcon icon={faUserCircle} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                              {comment.user?.first_name || comment.author || 'Anonymous'}
                            </span>
                            <span className="comment-date">{dateStr}</span>
                          </div>
                          <div className="comment-stars">{renderStars(comment.rating || 0)}</div>
                          <p className="comment-text">{comment.text || comment.comment}</p>
                          <div className="comment-actions">
                            <button type="button"><FontAwesomeIcon icon={faThumbsUp} /> {comment.likes || 0}</button>
                            <button type="button"><FontAwesomeIcon icon={faReply} /> Reply</button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="no-comments">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span className="toast-icon">
                {toast.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
                {toast.type === 'error' && <FontAwesomeIcon icon={faExclamationCircle} />}
                {toast.type === 'info' && <FontAwesomeIcon icon={faInfoCircle} />}
              </span>
              <span>{toast.message}</span>
              <span className="toast-close" onClick={() => removeToast(toast.id)}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="video-modal-content">
              <div className="video-wrapper">
                <iframe
                  src={product.screenshots?.find(s => s.is_video)?.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                  title="App Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-modal-info">
                <h3>{product.title} - Demo</h3>
                <p>Watch this video to see how {product.title} works in action.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetail