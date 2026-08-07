import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faThLarge, 
  faChevronDown, 
  faGlobe, 
  faSearch, 
  faUser,
  faSeedling,
  faCloudSun,
  faTrowel,
  faBug,
  faChartLine,
  faMap,
  faDna,
  faTractor,
  faBook,
  faHeadset,
  faHorseHead,
  faUsers,
  faStore,
  faSignOutAlt,
  faUserCircle,
  faHeart,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import SearchModal from './SearchModal'

const Header = ({ onStoreClick }) => {
  const { t, currentLanguage, toggleLanguage } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLanguageChange = (lang) => {
    toggleLanguage(lang)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    document.body.style.overflow = ''
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    setIsDropdownOpen(false)
    await logout()
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-menu')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  return (
    <>
      <header className="top">
        <div className="container row">
          <Link className="brand" to="/">
            {!logoError ? (
              <img 
                src="/images/logo.png" 
                alt="KALRO Logo" 
                className="brand-logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="logo">KALRO</span>
            )}
            <span>KALRO <small>{t('superapp')}</small></span>
          </Link>
          <span className="divider"></span>

          <ul className="mainnav">
            <li>
              <a href="#"><FontAwesomeIcon icon={faThLarge} /> {t('oneStopShop')} <FontAwesomeIcon icon={faChevronDown} /></a>
              <div className="mega-dropdown">
                <div className="col">
                  <h4>{t('advisoryTools')}</h4>
                  <a href="#"><FontAwesomeIcon icon={faSeedling} /> {t('cropSelector')}</a>
                  <a href="#"><FontAwesomeIcon icon={faCloudSun} /> {t('weatherAdvisory')}</a>
                  <a href="#"><FontAwesomeIcon icon={faTrowel} /> {t('soilHealth')}</a>
                  <a href="#"><FontAwesomeIcon icon={faBug} /> {t('pestDiagnosis')}</a>
                </div>
                <div className="col">
                  <h4>{t('dataIntelligence')}</h4>
                  <a href="#"><FontAwesomeIcon icon={faChartLine} /> {t('marketIntelligence')}</a>
                  <a href="#"><FontAwesomeIcon icon={faMap} /> {t('suitabilityMaps')}</a>
                  <a href="#"><FontAwesomeIcon icon={faDna} /> {t('tela')} <span className="badge">{t('new')}</span></a>
                  <a href="#"><FontAwesomeIcon icon={faTractor} /> {t('kaop')}</a>
                </div>
                <div className="col">
                  <h4>{t('supportKnowledge')}</h4>
                  <a href="#"><FontAwesomeIcon icon={faBook} /> {t('knowledgeHub')}</a>
                  <a href="#"><FontAwesomeIcon icon={faHeadset} /> {t('askKalro')}</a>
                  <a href="#"><FontAwesomeIcon icon={faHorseHead} /> {t('livestockServices')}</a>
                  <a href="#"><FontAwesomeIcon icon={faUsers} /> {t('extensionResources')}</a>
                </div>
              </div>
            </li>
            <li><a href="#">{t('research')}</a></li>
            <li><a href="#">{t('digitalAgriculture')}</a></li>
            <li><a href="#">{t('knowledge')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onStoreClick(); }}><FontAwesomeIcon icon={faStore} /> App Store</a></li>
            <li><a href="#">{t('about')}</a></li>
          </ul>

          <div className="right">
            <div className="lang-selector">
              <FontAwesomeIcon icon={faGlobe} /> {currentLanguage === 'en' ? 'EN' : 'SW'}
              <div className="lang-dropdown">
                <button onClick={() => handleLanguageChange('en')}>{t('english')}</button>
                <button onClick={() => handleLanguageChange('sw')}>{t('kiswahili')}</button>
              </div>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); openSearch(); }}>
              <FontAwesomeIcon icon={faSearch} />
            </a>
            
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FontAwesomeIcon icon={faUserCircle} />
                </span>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <FontAwesomeIcon icon={faUserCircle} className="user-dropdown-avatar" />
                      <div>
                        <strong>{user?.first_name || user?.username || 'User'}</strong>
                        <small>{user?.email}</small>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <FontAwesomeIcon icon={faUser} /> Profile
                    </Link>
                    <Link to="/favorites" onClick={() => setIsDropdownOpen(false)}>
                      <FontAwesomeIcon icon={faHeart} /> Favorites
                    </Link>
                    <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                      <FontAwesomeIcon icon={faCog} /> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="sign-in-link">{t('signIn')}</Link>
                <Link to="/register" className="btn-primary-small">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  )
}

export default Header