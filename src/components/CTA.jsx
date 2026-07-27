import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const CTA = () => {
  const { t } = useLanguage()

  const handleStart = () => {
    alert(t('farmAssessment'))
  }

  return (
    <section className="section alt" id="start">
      <div className="container">
        <div className="cta">
          <div>
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaDesc')}</p>
          </div>
          <a className="btn primary" href="#" onClick={handleStart}>
            <FontAwesomeIcon icon={faArrowRight} /> {t('startAssessment')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTA