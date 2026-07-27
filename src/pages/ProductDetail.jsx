import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faRobot, faSeedling, faCloudSun, faTrowel, faBug, faBook, faStore,
  faIdCard, faMicroscope, faLightbulb, faSatelliteDish, faCoins,
  faQrcode, faChartPie, faCloud, faMap, faChartLine, faHorseHead,
  faLeaf, faCalendarAlt, faExclamationTriangle, faDisease,
  faChalkboardTeacher, faLink as faLinkIcon, faPlug, faVial, faDatabase,
  faStar, faDownload, faUser, faGlobe, faTag, faShieldAlt,
  faHeart, faPlay, faRocket, faInfoCircle, faCheckCircle,
  faExclamationCircle, faSpinner, faTimes, faArrowRight,
  faMobileAlt, faDesktop, faThumbsUp, faReply, faPaperPlane,
  faComments, faCode, faThLarge, faUserCircle, faSearch,
  faBriefcase, faThermometerHalf, faTruck, faClipboardList,
  faVideo, faShareAlt, faTree, faUsers, faFileAlt, faClipboard,
  faTractor, faLink, faArrowLeft, faImage, faChevronLeft, faChevronRight,
  faExpand, faCompress, faPlayCircle
} from '@fortawesome/free-solid-svg-icons'
import { 
  faAndroid, faApple, faWindows
} from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const { t, currentLanguage } = useLanguage()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' })
  const [isSaved, setIsSaved] = useState(false)
  const [launchStatus, setLaunchStatus] = useState({ type: '', message: '', show: false })
  const [toasts, setToasts] = useState([])
  const [isLaunching, setIsLaunching] = useState(false)
  
  // Image Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Complete product database
  const productDatabase = {
    1: {
      id: 1,
      title: 'KALRO Selector',
      category: 'Advisory & AI',
      icon: faSeedling,
      iconBg: 'green',
      description: 'AI-powered crop and variety recommendation engine.',
      longDescription: 'The KALRO Selector uses advanced machine learning algorithms to recommend the best crop varieties for your specific location, soil type, and climate conditions. Built on decades of agricultural research from KALRO scientists.',
      rating: 4.8,
      reviews: 3247,
      downloads: '8.5K+',
      users: '5,200+',
      version: '2.3.0',
      lastUpdated: 'June 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Popular', 'AI-Powered'],
      features: [
        { icon: faSeedling, title: 'Crop Selection', description: 'Choose from hundreds of crop varieties based on your location and conditions.' },
        { icon: faCloudSun, title: 'Climate Matching', description: 'Find crops that thrive in your specific climate zone.' },
        { icon: faMap, title: 'Location Intelligence', description: 'Uses precise location data for accurate recommendations.' },
        { icon: faChartLine, title: 'Yield Prediction', description: 'Estimated yield forecasts for recommended varieties.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android, iOS' },
        { label: 'AI Models', value: 'Random Forest, Neural Networks' },
        { label: 'Data Sources', value: 'KALRO, Weather API, Soil Maps' },
        { label: 'Integration', value: 'KAOP, LSC Hub' },
        { label: 'Security', value: 'OAuth 2.0, TLS 1.3' }
      ],
      platforms: ['Web App', 'Android', 'iOS', 'Desktop'],
      availablePlatforms: ['Web App', 'Android', 'iOS'],
      related: [2, 7, 11]
    },
    2: {
      id: 2,
      title: 'AI Farm Advisor',
      category: 'Advisory & AI',
      icon: faRobot,
      iconBg: 'blue',
      description: 'Personalized recommendations for crops, livestock, and soil.',
      longDescription: 'Get personalized, AI-driven recommendations for crops, livestock, and soil management. The AI Farm Advisor combines KALRO research with real-time data to deliver actionable insights for better farming decisions. Trusted by over 12,000 farmers across Kenya.',
      rating: 4.9,
      reviews: 2847,
      downloads: '12K+',
      users: '12,000+',
      version: '2.4.1',
      lastUpdated: 'June 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Featured', 'AI-Powered', 'Secure'],
      features: [
        { icon: faSeedling, title: 'Crop Recommendations', description: 'Get variety and crop suitability recommendations based on your location, soil, and climate.' },
        { icon: faHorseHead, title: 'Livestock Advisory', description: 'Receive breed, feeding, and health recommendations tailored to your livestock system.' },
        { icon: faTrowel, title: 'Soil Health Insights', description: 'Nutrient management, liming, and organic matter recommendations for your fields.' },
        { icon: faCloudSun, title: 'Weather Integration', description: 'Real-time weather data integrated into recommendations for planting and operations.' },
        { icon: faRobot, title: 'AI-Powered Insights', description: 'Machine learning models trained on KALRO research and local agricultural data.' },
        { icon: faMobileAlt, title: 'Mobile & Web Access', description: 'Available on Android, iOS, and web - access your farm data anywhere.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android, iOS' },
        { label: 'API', value: 'RESTful, GraphQL' },
        { label: 'Data sources', value: 'KALRO, Weather API, Soil Maps' },
        { label: 'AI Models', value: 'Random Forest, XGBoost, LSTM' },
        { label: 'Integration', value: 'KAOP, LSC Hub, ONA' },
        { label: 'Language support', value: 'English, Kiswahili' },
        { label: 'Security', value: 'OAuth 2.0, TLS 1.3' },
        { label: 'Support', value: 'Help desk, AI chatbot, Email' }
      ],
      platforms: ['Web App', 'Android', 'iOS'],
      availablePlatforms: ['Web App', 'Android', 'iOS'],
      related: [1, 3, 7]
    },
    3: {
      id: 3,
      title: 'Soil Health Recommender',
      category: 'Advisory & AI',
      icon: faTrowel,
      iconBg: 'brown',
      description: 'Nutrient, liming, and organic matter recommendations.',
      longDescription: 'The Soil Health Recommender provides comprehensive soil management recommendations including nutrient application, liming requirements, and organic matter management for optimal crop production.',
      rating: 4.6,
      reviews: 2156,
      downloads: '7.1K+',
      users: '4,800+',
      version: '1.8.2',
      lastUpdated: 'May 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Popular'],
      features: [
        { icon: faTrowel, title: 'Nutrient Recommendations', description: 'Precise fertilizer recommendations based on soil test results.' },
        { icon: faLeaf, title: 'Organic Matter Management', description: 'Guidance on building and maintaining soil organic matter.' },
        { icon: faMap, title: 'Soil Mapping', description: 'Visualize soil properties across your farm.' },
        { icon: faChartLine, title: 'Yield Optimization', description: 'Maximize yields through optimal soil health.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android' },
        { label: 'Data Sources', value: 'Soil Labs, KALRO Research' },
        { label: 'Integration', value: 'LIMS, KAOP' },
        { label: 'Security', value: 'OAuth 2.0, TLS 1.3' }
      ],
      platforms: ['Web App', 'Android'],
      availablePlatforms: ['Web App', 'Android'],
      related: [2, 11, 21]
    },
    4: {
      id: 4,
      title: 'Crop Recommendation Engine',
      category: 'Advisory & AI',
      icon: faChartLine,
      iconBg: 'purple',
      description: 'Location-based crop suitability and variety selection.',
      longDescription: 'The Crop Recommendation Engine uses location data to recommend the most suitable crops and varieties for your specific area. It considers climate, soil type, and market demand to provide optimal recommendations.',
      rating: 4.7,
      reviews: 1843,
      downloads: '6.3K+',
      users: '4,100+',
      version: '2.1.0',
      lastUpdated: 'May 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Popular'],
      features: [
        { icon: faMap, title: 'Location-Based Selection', description: 'Crop recommendations based on GPS coordinates.' },
        { icon: faSeedling, title: 'Variety Database', description: 'Access to hundreds of crop varieties.' },
        { icon: faCloudSun, title: 'Climate Analysis', description: 'Temperature and rainfall suitability.' },
        { icon: faStore, title: 'Market Demand', description: 'Recommendations based on market trends.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android' },
        { label: 'AI Models', value: 'Decision Trees, Random Forest' },
        { label: 'Data Sources', value: 'KALRO, Meteorological Data' },
        { label: 'Integration', value: 'KAOP' }
      ],
      platforms: ['Web App', 'Android'],
      availablePlatforms: ['Web App', 'Android'],
      related: [1, 2, 7]
    },
    5: {
      id: 5,
      title: 'Livestock Recommendation',
      category: 'Advisory & AI',
      icon: faHorseHead,
      iconBg: 'teal',
      description: 'Breed, feeding, and health recommendations for livestock.',
      longDescription: 'The Livestock Recommendation tool helps farmers select the best breeds, create optimal feeding plans, and manage animal health for improved productivity.',
      rating: 4.5,
      reviews: 1567,
      downloads: '4.2K+',
      users: '2,800+',
      version: '1.5.0',
      lastUpdated: 'April 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: [],
      features: [
        { icon: faHorseHead, title: 'Breed Selection', description: 'Optimal livestock breeds for your region.' },
        { icon: faLeaf, title: 'Feeding Plans', description: 'Customized feeding schedules and nutrition.' },
        { icon: faHeart, title: 'Health Monitoring', description: 'Disease prevention and treatment recommendations.' },
        { icon: faTree, title: 'Pasture Management', description: 'Optimal grazing patterns.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android, iOS' },
        { label: 'Data Sources', value: 'KALRO Research, Veterinary Data' },
        { label: 'Integration', value: 'KAOP' }
      ],
      platforms: ['Web App', 'Android', 'iOS'],
      availablePlatforms: ['Web App', 'Android', 'iOS'],
      related: [2, 6, 25]
    },
    6: {
      id: 6,
      title: 'Pasture Recommendation',
      category: 'Advisory & AI',
      icon: faLeaf,
      iconBg: 'orange',
      description: 'Optimal pasture and forage species for your region.',
      longDescription: 'The Pasture Recommendation tool helps farmers select the best pasture and forage species for their specific region, soil type, and climate conditions.',
      rating: 4.3,
      reviews: 1234,
      downloads: '2.8K+',
      users: '1,900+',
      version: '1.2.0',
      lastUpdated: 'April 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: [],
      features: [
        { icon: faSeedling, title: 'Species Selection', description: 'Best pasture varieties for your soil and climate.' },
        { icon: faCalendarAlt, title: 'Seeding Guide', description: 'Optimal planting times and methods.' },
        { icon: faChartLine, title: 'Management Plans', description: 'Grazing rotation and maintenance.' },
        { icon: faCloudSun, title: 'Yield Optimization', description: 'Maximize forage production.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android' },
        { label: 'Data Sources', value: 'KALRO, Agricultural Research' }
      ],
      platforms: ['Web App', 'Android'],
      availablePlatforms: ['Web App', 'Android'],
      related: [5, 2, 11]
    },
    7: {
      id: 7,
      title: 'Weather Advisory',
      category: 'Climate & Weather',
      icon: faCloudSun,
      iconBg: 'cyan',
      description: 'Localized forecasts, seasonal outlooks, and alerts.',
      longDescription: 'The Weather Advisory provides localized weather forecasts, seasonal outlooks, and severe weather alerts to help farmers make informed decisions about planting, harvesting, and farm operations.',
      rating: 4.9,
      reviews: 3421,
      downloads: '22K+',
      users: '18,000+',
      version: '3.0.1',
      lastUpdated: 'June 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Top', 'Featured'],
      features: [
        { icon: faCloudSun, title: 'Local Forecasts', description: 'Precise weather predictions for your location.' },
        { icon: faCalendarAlt, title: 'Seasonal Outlooks', description: 'Long-term climate patterns.' },
        { icon: faExclamationTriangle, title: 'Alert System', description: 'Severe weather warnings.' },
        { icon: faSeedling, title: 'Crop Planning', description: 'Weather-based planting and harvesting advice.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android, iOS' },
        { label: 'Data Sources', value: 'Meteorological Services, Satellite Data' },
        { label: 'Integration', value: 'KAOP' }
      ],
      platforms: ['Web App', 'Android', 'iOS'],
      availablePlatforms: ['Web App', 'Android', 'iOS'],
      related: [8, 9, 2]
    },
    8: {
      id: 8,
      title: 'Kenya Agricultural Observatory',
      category: 'Climate & Weather',
      icon: faSatelliteDish,
      iconBg: 'blue',
      description: 'Real-time climate, drought, and environmental monitoring.',
      longDescription: 'The Kenya Agricultural Observatory provides real-time monitoring of climate, drought conditions, and environmental factors affecting agriculture across Kenya.',
      rating: 4.7,
      reviews: 2456,
      downloads: '15K+',
      users: '11,000+',
      version: '2.2.0',
      lastUpdated: 'May 2026',
      languages: 'English, Kiswahili',
      security: 'SSL, GDPR compliant',
      badges: ['Featured'],
      features: [
        { icon: faSatelliteDish, title: 'Real-time Monitoring', description: 'Live climate data.' },
        { icon: faExclamationTriangle, title: 'Drought Tracking', description: 'Severity and impact assessment.' },
        { icon: faMap, title: 'Environmental Data', description: 'Land use, vegetation, water resources.' },
        { icon: faChartLine, title: 'Predictive Analytics', description: 'Future climate scenarios.' }
      ],
      specs: [
        { label: 'Platform', value: 'Web, Android' },
        { label: 'Data Sources', value: 'Satellite, Weather Stations' },
        { label: 'AI Models', value: 'Time Series Analysis' }
      ],
      platforms: ['Web App', 'Android'],
      availablePlatforms: ['Web App', 'Android'],
      related: [7, 9, 10]
    }
  }

  // Initial comments
  const initialComments = [
    {
      id: 1,
      author: 'Grace Wanjiru',
      date: '2 days ago',
      rating: 5,
      text: 'This app has transformed how I manage my farm. The recommendations are spot-on and the interface is incredibly useful. Highly recommend to all farmers!',
      likes: 12
    },
    {
      id: 2,
      author: 'Dr. Peter Ochieng',
      date: '1 week ago',
      rating: 4.5,
      text: 'As an extension officer, this tool has been invaluable. The AI recommendations are based on solid research and the interface is very intuitive. My farmers love it!',
      likes: 8
    },
    {
      id: 3,
      author: 'Sarah Muthoni',
      date: '2 weeks ago',
      rating: 5,
      text: 'The soil health recommendations have been a game-changer for my farm. I\'ve seen a noticeable improvement in crop yields since I started following the advice. Thank you KALRO!',
      likes: 15
    }
  ]

  // Sample gallery images
  const galleryImages = [
    { id: 1, type: 'image', url: 'https://via.placeholder.com/600x400/009640/ffffff?text=KALRO+App+Screenshot+1', alt: 'App Screenshot 1' },
    { id: 2, type: 'image', url: 'https://via.placeholder.com/600x400/0067b8/ffffff?text=KALRO+App+Screenshot+2', alt: 'App Screenshot 2' },
    { id: 3, type: 'image', url: 'https://via.placeholder.com/600x400/8B5A2B/ffffff?text=KALRO+App+Screenshot+3', alt: 'App Screenshot 3' },
    { id: 4, type: 'image', url: 'https://via.placeholder.com/600x400/5c2d91/ffffff?text=KALRO+App+Screenshot+4', alt: 'App Screenshot 4' },
    { id: 5, type: 'video', url: 'https://via.placeholder.com/600x400/333333/ffffff?text=KALRO+Video+Preview', alt: 'Video Preview' },
  ]

  // Demo video URL (sample - replace with actual video)
  const demoVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

  useEffect(() => {
    const productData = productDatabase[id]
    if (productData) {
      setProduct(productData)
      setComments(initialComments)
    }
    setLoading(false)

    const saved = localStorage.getItem(`kalro_saved_${id}`)
    if (saved === 'true') {
      setIsSaved(true)
    }
  }, [id])

  const handleSave = () => {
    const newState = !isSaved
    setIsSaved(newState)
    localStorage.setItem(`kalro_saved_${id}`, newState.toString())
    showToast(
      newState ? 'Product saved to favorites' : 'Removed from favorites',
      newState ? 'success' : 'info'
    )
  }

  const showToast = (message, type = 'info', duration = 4000) => {
    const newToast = { id: Date.now(), message, type, duration }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleLaunch = async () => {
    setIsLaunching(true)
    setLaunchStatus({ type: 'loading', message: 'Preparing to launch...', show: true })

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setLaunchStatus({ type: 'loading', message: 'Verifying access...', show: true })
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLaunchStatus({ type: 'loading', message: 'Launching application...', show: true })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLaunchStatus({ type: 'success', message: 'App launched successfully!', show: true })
      showToast('🚀 Application launched successfully!', 'success')
      
      setTimeout(() => {
        setLaunchStatus({ type: '', message: '', show: false })
        setIsLaunching(false)
      }, 3000)
    } catch (error) {
      setLaunchStatus({ type: 'error', message: 'Unable to launch the app. Please try again.', show: true })
      showToast('Failed to launch app. Please try again.', 'error')
      setIsLaunching(false)
    }
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.name || !newComment.email || !newComment.text) {
      showToast('Please fill in all fields', 'error')
      return
    }
    if (selectedRating === 0) {
      showToast('Please select a rating', 'error')
      return
    }

    const comment = {
      id: Date.now(),
      author: newComment.name,
      date: 'Just now',
      rating: selectedRating,
      text: newComment.text,
      likes: 0
    }

    setComments(prev => [comment, ...prev])
    setNewComment({ name: '', email: '', text: '' })
    setSelectedRating(0)
    setHoverRating(0)
    showToast('✅ Your review has been submitted!', 'success')
  }

  const getRelatedProducts = (productIds) => {
    if (!productIds) return []
    return productIds.map(id => productDatabase[id]).filter(Boolean)
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      'Web App': faGlobe,
      'Android': faAndroid,
      'iOS': faApple,
      'Desktop': faDesktop,
      'Windows': faWindows
    }
    return icons[platform] || faDesktop
  }

  const getIconBgClass = (bg) => {
    const classes = {
      'green': 'green', 'blue': 'blue', 'orange': 'orange', 'purple': 'purple',
      'brown': 'brown', 'teal': 'teal', 'indigo': 'indigo', 'cyan': 'cyan',
      'amber': 'amber', 'deep-purple': 'deep-purple', 'red': 'red'
    }
    return classes[bg] || 'green'
  }

  const renderStars = (rating, interactive = false) => {
    const fullStars = Math.floor(rating)
    const stars = []
    
    for (let i = 0; i < 5; i++) {
      const starValue = i + 1
      let isActive = false
      
      if (interactive) {
        isActive = starValue <= (hoverRating || selectedRating)
      } else {
        isActive = starValue <= fullStars
      }
      
      stars.push(
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
          <FontAwesomeIcon icon={faStar} />
        </span>
      )
    }
    
    return stars
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  const openVideoModal = () => {
    setIsVideoModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    document.body.style.overflow = ''
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
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/?page=store" className="btn primary">
              <FontAwesomeIcon icon={faArrowRight} /> Back to Store
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const relatedProducts = getRelatedProducts(product.related)

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

          {/* Product Details */}
          <section className="product-details" id="overview">
            {/* Image Gallery */}
            <div className="product-media">
              <div className="gallery-container">
                {/* Main Display Area */}
                <div className="gallery-main">
                  <img 
                    src={galleryImages[currentImageIndex].url} 
                    alt={galleryImages[currentImageIndex].alt}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400/009640/ffffff?text=KALRO+App+Screenshot';
                    }}
                  />
                  {galleryImages[currentImageIndex].type === 'video' && (
                    <div className="gallery-video-play" onClick={openVideoModal}>
                      <FontAwesomeIcon icon={faPlayCircle} />
                    </div>
                  )}
                  <button className="gallery-nav gallery-nav-left" onClick={prevImage} aria-label="Previous image">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="gallery-nav gallery-nav-right" onClick={nextImage} aria-label="Next image">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>

                {/* Thumbnail Strip */}
                <div className="gallery-thumbnails">
                  {galleryImages.map((image, index) => (
                    <div 
                      key={image.id}
                      className={`gallery-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => goToImage(index)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x80/cccccc/666666?text=Image';
                        }}
                      />
                      {image.type === 'video' && (
                        <div className="thumbnail-video-badge">
                          <FontAwesomeIcon icon={faPlay} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <span className="category-tag">
                <FontAwesomeIcon icon={product.icon} /> {product.category}
              </span>
              <h1>{product.title}</h1>

              <div className="rating">
                <span className="stars">{renderStars(product.rating)}</span>
                <span>{product.rating}</span>
                <span className="count">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              <div className="badge-group">
                {product.badges && product.badges.map((badge, index) => (
                  <span key={index} className={`badge ${index % 2 === 0 ? '' : 'secondary'}`}>
                    <FontAwesomeIcon icon={index === 0 ? faStar : index === 1 ? faRocket : faShieldAlt} /> {badge}
                  </span>
                ))}
              </div>

              <p className="description">{product.longDescription || product.description}</p>

              {/* Platform Availability Badges */}
              <div className="platform-badges">
                {product.platforms && product.platforms.map((platform, index) => (
                  <span 
                    key={index} 
                    className={`platform-badge ${product.availablePlatforms && product.availablePlatforms.includes(platform) ? 'available' : ''}`}
                  >
                    <FontAwesomeIcon icon={getPlatformIcon(platform)} /> {platform}
                  </span>
                ))}
              </div>

              <div className="meta-grid">
                <div className="meta-item">
                  <FontAwesomeIcon icon={faUser} /> <span><strong>Users:</strong> {product.users}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faDownload} /> <span><strong>Downloads:</strong> {product.downloads}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> <span><strong>Last updated:</strong> {product.lastUpdated}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faTag} /> <span><strong>Version:</strong> {product.version}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faGlobe} /> <span><strong>Languages:</strong> {product.languages}</span>
                </div>
                <div className="meta-item">
                  <FontAwesomeIcon icon={faShieldAlt} /> <span><strong>Security:</strong> {product.security}</span>
                </div>
              </div>

              <div className="actions-row">
                <button 
                  className="btn primary btn-large" 
                  onClick={handleLaunch}
                  disabled={isLaunching}
                >
                  <FontAwesomeIcon icon={isLaunching ? faSpinner : faRocket} spin={isLaunching} /> 
                  {isLaunching ? 'Launching...' : 'Launch app'}
                </button>
                <button className="btn outline btn-large" onClick={openVideoModal}>
                  <FontAwesomeIcon icon={faPlay} /> Watch demo
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

          {/* Features Section */}
          <section className="features-section" id="features">
            <h2><FontAwesomeIcon icon={faStar} style={{ color: 'var(--primary)', marginRight: '12px' }} /> Key features</h2>
            <div className="features-grid">
              {product.features && product.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="icon"><FontAwesomeIcon icon={feature.icon} /></div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Specs */}
          <section className="specs-section" id="specs">
            <h2><FontAwesomeIcon icon={faCode} style={{ color: 'var(--primary)', marginRight: '12px' }} /> Technical specifications</h2>
            <div className="specs-grid">
              {product.specs && product.specs.map((spec, index) => (
                <div className="spec-item" key={index}>
                  <span className="label">{spec.label}</span>
                  <span className="value">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Comments Section */}
          <section className="comments-section" id="comments">
            <h2><FontAwesomeIcon icon={faComments} style={{ color: 'var(--primary)', marginRight: '12px' }} /> User reviews</h2>
            <p className="comment-subtitle">Share your experience with {product.title}</p>

            <div className="comment-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="commentName">Full name</label>
                  <input 
                    type="text" 
                    id="commentName" 
                    placeholder="e.g. John Kamau" 
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="commentEmail">Email address</label>
                  <input 
                    type="email" 
                    id="commentEmail" 
                    placeholder="e.g. john@example.com" 
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Your rating</label>
                <div className="rating-input">
                  {renderStars(5, true)}
                </div>
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
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button className="btn primary" onClick={handleSubmitComment}>
                  <FontAwesomeIcon icon={faPaperPlane} /> Submit review
                </button>
                <button className="btn outline" onClick={() => {
                  setNewComment({ name: '', email: '', text: '' })
                  setSelectedRating(0)
                  setHoverRating(0)
                  showToast('Review cleared', 'info')
                }}>
                  Cancel
                </button>
              </div>
            </div>

            <div className="comments-list">
              {comments.map((comment) => (
                <div className="comment-item" key={comment.id}>
                  <div className="comment-header">
                    <span className="comment-author">
                      <FontAwesomeIcon icon={faUserCircle} style={{ color: 'var(--primary)', marginRight: '6px' }} /> 
                      {comment.author}
                    </span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <div className="comment-stars">{renderStars(comment.rating)}</div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button><FontAwesomeIcon icon={faThumbsUp} /> {comment.likes}</button>
                    <button><FontAwesomeIcon icon={faReply} /> Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="related-section" id="related">
              <h2><FontAwesomeIcon icon={faThLarge} style={{ color: 'var(--primary)', marginRight: '12px' }} /> Related products</h2>
              <div className="related-grid">
                {relatedProducts.map((related) => (
                  <Link to={`/product/${related.id}`} className="related-card-link" key={related.id}>
                    <div className="related-card">
                      <div className="icon"><FontAwesomeIcon icon={related.icon} /></div>
                      <h4>{related.title}</h4>
                      <div className="cat">{related.category}</div>
                      <span className="link">
                        View details <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="video-modal-content">
              <div className="video-wrapper">
                <iframe
                  src={demoVideoUrl}
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