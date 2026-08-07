import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, faBook, faStar, faDownload, faGlobe, faShieldAlt,
  faHeart, faPlay, faRocket, faInfoCircle, faCheckCircle,
  faExclamationCircle, faSpinner, faTimes, faArrowRight,
  faThumbsUp, faReply, faPaperPlane, faComments, faUserCircle,
  faChevronLeft, faChevronRight, faHeadset, faStar as faStarSolid,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { faAndroid, faApple, faWindows } from '@fortawesome/free-brands-svg-icons'

import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import './ProductDetail.css'

// Fallback image when no screenshots are available
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23009640"/%3E%3Ctext x="300" y="190" font-family="Arial" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle"%3EKALRO%3C/text%3E%3Ctext x="300" y="225" font-family="Arial" font-size="16" fill="%23dff6dd" text-anchor="middle" dominant-baseline="middle"%3EApp Screenshot%3C/text%3E%3C/svg%3E'

// Fallback image for thumbnails
const FALLBACK_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80"%3E%3Crect width="100" height="80" fill="%23cccccc"/%3E%3Ctext x="50" y="45" font-family="Arial" font-size="12" fill="%23666666" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E'

const DEMO_VIDEO_FALLBACK = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

const ProductDetail = () => {
  const { slug } = useParams()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { store, fetchWithErrorHandling } = useApi()

  // Primary Component State
  const [product, setProduct] = useState(null)
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

  // Track active timers for cleanup
  const activeTimers = useRef(new Set())

  const safeSetTimeout = (callback, delay) => {
    const timerId = setTimeout(() => {
      activeTimers.current.delete(timerId)
      callback()
    }, delay)
    activeTimers.current.add(timerId)
    return timerId
  }

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      activeTimers.current.forEach((id) => clearTimeout(id))
      activeTimers.current.clear()
    }
  }, [])

  // Lock body scroll when video modal is active
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

  // Toast Notification Handler
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

  // Handle image error
  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }))
  }

  // Get image URL with fallback
  const getImageUrl = (image, isThumbnail = false) => {
    if (!image) return isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE
    if (imageErrors[image.id]) {
      return isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE
    }
    // Use image_url if available, otherwise use the image field
    return image.image_url || image.image || (isThumbnail ? FALLBACK_THUMBNAIL : FALLBACK_IMAGE)
  }

  // Get screenshots from product
  const getScreenshots = (product) => {
    if (!product) return []
    if (product.screenshots && product.screenshots.length > 0) {
      return product.screenshots
    }
    // If no screenshots, return empty array (will show placeholder)
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
          setCurrentImageIndex(0) // Reset image index when new product loads

          const saved = localStorage.getItem(`kalro_saved_${result.data.id}`)
          setIsSaved(saved === 'true')

          const reviewsResult = await fetchWithErrorHandling(
            () => store.getProductReviews(slug),
            'Failed to load reviews'
          )

          if (isMounted && reviewsResult?.success && reviewsResult?.data) {
            const reviewsData = Array.isArray(reviewsResult.data)
              ? reviewsResult.data
              : reviewsResult.data.results || []
            setComments(reviewsData)
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
    const numRating = parseFloat(rating) || 0
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

  // Navigation functions
  const screenshots = getScreenshots(product)
  const totalImages = screenshots.length || 1 // At least 1 for placeholder

  const nextImage = () => {
    if (screenshots.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    if (screenshots.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
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
                <FontAwesomeIcon icon={faStore} /> {product.category_name || product.category || 'Product'}
              </span>
              <h1>{product.title}</h1>

              <div className="rating">
                <span className="stars">{renderStars(product.rating || 0)}</span>
                <span>{product.rating || 0}</span>
                <span className="count">({product.reviews_count || 0} reviews)</span>
              </div>

              {product.badges && product.badges.length > 0 && (
                <div className="badge-group">
                  {product.badges.slice(0, 3).map((badge, index) => (
                    <span key={index} className={`badge ${index % 2 === 0 ? '' : 'secondary'}`}>
                      <FontAwesomeIcon icon={index === 0 ? faStarSolid : index === 1 ? faRocket : faShieldAlt} /> {badge}
                    </span>
                  ))}
                </div>
              )}

              <p className="description">{product.short_description}</p>

              <div className="meta-grid">
                <div className="meta-item">
                  <FontAwesomeIcon icon={faDownload} /> <span><strong>Downloads:</strong> {product.downloads_count || '0'}</span>
                </div>
                {product.is_featured && (
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faStarSolid} /> <span><strong>Status:</strong> Featured</span>
                  </div>
                )}
                <div className="meta-item">
                  <FontAwesomeIcon icon={faGlobe} /> <span><strong>Languages:</strong> English, Kiswahili</span>
                </div>
              </div>

              {product.links && Object.keys(product.links).length > 0 && (
                <div className="app-links">
                  <h4>Available on</h4>
                  <div className="app-links-grid">
                    {product.links.web_app && (
                      <a href={product.links.web_app} target="_blank" rel="noopener noreferrer" className="app-link web">
                        <FontAwesomeIcon icon={faGlobe} /> Web App
                      </a>
                    )}
                    {product.links.google_play && (
                      <a href={product.links.google_play} target="_blank" rel="noopener noreferrer" className="app-link play">
                        <FontAwesomeIcon icon={faAndroid} /> Google Play
                      </a>
                    )}
                    {product.links.apple_app_store && (
                      <a href={product.links.apple_app_store} target="_blank" rel="noopener noreferrer" className="app-link apple">
                        <FontAwesomeIcon icon={faApple} /> App Store
                      </a>
                    )}
                    {product.links.demo_video && (
                      <button onClick={() => setIsVideoModalOpen(true)} className="app-link demo">
                        <FontAwesomeIcon icon={faPlay} /> Watch Demo
                      </button>
                    )}
                    {product.links.documentation && (
                      <a href={product.links.documentation} target="_blank" rel="noopener noreferrer" className="app-link docs">
                        <FontAwesomeIcon icon={faBook} /> Documentation
                      </a>
                    )}
                    {product.links.support && (
                      <a href={product.links.support} target="_blank" rel="noopener noreferrer" className="app-link support">
                        <FontAwesomeIcon icon={faHeadset} /> Support
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="actions-row">
                <button
                  className="btn primary btn-large"
                  onClick={handleLaunch}
                  disabled={isLaunching}
                >
                  <FontAwesomeIcon icon={isLaunching ? faSpinner : faRocket} spin={isLaunching} />
                  {isLaunching ? 'Launching...' : 'Launch app'}
                </button>
                {product.links?.demo_video && (
                  <button className="btn outline btn-large" onClick={() => setIsVideoModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlay} /> Watch demo
                  </button>
                )}
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

          {/* Comments Section */}
          <section className="comments-section" id="comments">
            <h2>
              <FontAwesomeIcon icon={faComments} style={{ color: 'var(--primary)', marginRight: '12px' }} /> User reviews
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
                  src={product.links?.demo_video || DEMO_VIDEO_FALLBACK}
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