import React, { useState } from 'react'
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
  faStore
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import SearchModal from './SearchModal'

const Header = ({ onStoreClick }) => {
  const { t, currentLanguage, toggleLanguage } = useLanguage()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

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

  return (
    <>
      <header className="top">
        <div className="container row">
          <a className="brand" href="/">
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
            <span>{t('superapp')}  <small></small></span>
          </a>
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
            <a href="/login">{t('signIn')}</a>
            <span className="user"><FontAwesomeIcon icon={faUser} /></span>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  )
}

export default Header