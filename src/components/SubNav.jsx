import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faArrowRight, faStore } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const SubNav = ({ onStoreClick }) => {
  const { t } = useLanguage()

  const handleStoreClick = (e) => {
    e.preventDefault()
    if (onStoreClick) {
      onStoreClick()
    }
  }

  return (
    <nav className="subnav" aria-label="Quick navigation">
      <div className="container row">
        <ul className="sublinks">
          <li>
            <a href="#how">{t('howItWorks')} <FontAwesomeIcon icon={faChevronDown} /></a>
            <div className="sub-dropdown">
              <div className="sub-label">{t('overview')}</div>
              <a href="#how">{t('platformOverview')}</a>
              <a href="#how">{t('userJourney')}</a>
              <a href="#how">{t('successStories')}</a>
            </div>
          </li>
          <li>
            <a href="#services">{t('whatsIncluded')} <FontAwesomeIcon icon={faChevronDown} /></a>
            <div className="sub-dropdown">
              <div className="sub-label">{t('services')}</div>
              <a href="#services">{t('advisoryTools')}</a>
              <a href="#services">{t('dataIntelligence')}</a>
              <a href="#services">{t('supportKnowledge')}</a>
              <a href="#services">{t('allApps')}</a>
            </div>
          </li>
          <li>
            <a href="#updates">{t('updates')} <FontAwesomeIcon icon={faChevronDown} /></a>
            <div className="sub-dropdown">
              <div className="sub-label">{t('latest')}</div>
              <a href="#updates">{t('aiAdvisoryNews')}</a>
              <a href="#updates">{t('weatherUpdates')}</a>
              <a href="#updates">{t('soilHealthInsights')}</a>
              <a href="#updates">{t('allUpdates')}</a>
            </div>
          </li>
          <li>
            <a href="#start">{t('getStarted')} <FontAwesomeIcon icon={faChevronDown} /></a>
            <div className="sub-dropdown">
              <div className="sub-label">{t('startHere')}</div>
              <a href="#start">{t('farmAssessment')}</a>
              <a href="#start">{t('createAccount')}</a>
              <a href="#start">{t('demoTour')}</a>
              <a href="#start">{t('trainingResources')}</a>
            </div>
          </li>
          <li>
            <a href="#faq">{t('faqs')} <FontAwesomeIcon icon={faChevronDown} /></a>
            <div className="sub-dropdown">
              <div className="sub-label">{t('help')}</div>
              <a href="#faq">{t('generalQuestions')}</a>
              <a href="#faq">{t('accountSupport')}</a>
              <a href="#faq">{t('technicalHelp')}</a>
              <a href="#faq">{t('contactSupport')}</a>
            </div>
          </li>
          <li>
            <a href="#" onClick={handleStoreClick}>
              <FontAwesomeIcon icon={faStore} /> App Store
            </a>
          </li>
        </ul>
        <div className="actions">
          <a className="btn outline" href="#services">{t('exploreServices')}</a>
          <a className="btn primary" href="#start"><FontAwesomeIcon icon={faArrowRight} /> {t('startNow')}</a>
        </div>
      </div>
    </nav>
  )
}

export default SubNav