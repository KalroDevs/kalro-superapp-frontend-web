import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faSearch,
  faUser,
  faSignOutAlt,
  faUserCircle,
  faHeart,
  faCog,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import SearchModal from './SearchModal'

import './Header.css'

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

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest('.user-menu')
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [isDropdownOpen])

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="header-accent-line" />

        <div className="container header-container">

          {/* =====================================================
              BRAND / LOGO
          ===================================================== */}

          <Link
            className="header-brand"
            to="/"
            aria-label="KALRO Digital Products and Services"
          >
            <div className="header-logo-shell">

              {!logoError ? (
                <img
                  src="/images/logo_header.png"
                  alt="KALRO Digital Products and Services"
                  className="header-brand-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="header-logo-fallback">
                  <strong>KALRO</strong>
                  <span>Digital Products & Services</span>
                </div>
              )}

            </div>
          </Link>


          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}

          <div className="header-actions">

            {/* Search */}

            <button
              type="button"
              className="header-action-btn header-search-btn"
              onClick={openSearch}
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />

              <span className="header-action-text">
                Search
              </span>
            </button>


            {/* Language */}

            <div className="header-language">

              <button
                type="button"
                className="header-language-trigger"
              >
                <FontAwesomeIcon icon={faGlobe} />

                <span>
                  {currentLanguage === 'en'
                    ? 'EN'
                    : 'SW'}
                </span>

                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="header-chevron"
                />
              </button>


              <div className="header-language-menu">

                <button
                  type="button"
                  onClick={() =>
                    handleLanguageChange('en')
                  }
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleLanguageChange('sw')
                  }
                >
                  Kiswahili
                </button>

              </div>

            </div>


            {/* Authentication */}

            {isAuthenticated ? (

              <div className="user-menu">

                <button
                  type="button"
                  className="header-user-btn"
                  onClick={() =>
                    setIsDropdownOpen(
                      !isDropdownOpen
                    )
                  }
                  aria-expanded={isDropdownOpen}
                >

                  <span className="header-user-avatar">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                    />
                  </span>

                  <span className="header-user-info">

                    <strong>
                      {user?.first_name ||
                        user?.username ||
                        'User'}
                    </strong>

                    <small>
                      Account
                    </small>

                  </span>

                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="header-chevron"
                  />

                </button>


                {isDropdownOpen && (

                  <div className="user-dropdown">

                    <div className="user-dropdown-header">

                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="user-dropdown-avatar"
                      />

                      <div>

                        <strong>
                          {user?.first_name ||
                            user?.username ||
                            'User'}
                        </strong>

                        <small>
                          {user?.email}
                        </small>

                      </div>

                    </div>


                    <Link
                      to="/profile"
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                      />

                      Profile
                    </Link>


                    <Link
                      to="/favorites"
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                      />

                      Favorites
                    </Link>


                    <Link
                      to="/settings"
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCog}
                      />

                      Settings
                    </Link>


                    <div className="dropdown-divider" />


                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                      />

                      Logout
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <div className="header-auth-actions">

                <Link
                  to="/login"
                  className="header-signin"
                >
                  {t('signIn') || 'Sign in'}
                </Link>

                <Link
                  to="/register"
                  className="header-register"
                >
                  Register
                </Link>

              </div>

            )}

          </div>

        </div>
      </header>


      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  )
}

export default Header