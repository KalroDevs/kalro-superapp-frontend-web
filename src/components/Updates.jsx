import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const Updates = () => {
  const { t } = useLanguage()

  const updates = [
    {
      type: t('featured'),
      title: t('update1Title'),
      description: t('update1Desc'),
      gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      featured: true,
      linkText: t('readFeature')
    },
    {
      type: t('weatherAdvisory'),
      title: t('update2Title'),
      description: t('update2Desc'),
      gradient: 'linear-gradient(135deg, #0067b8, #50e6ff)',
      featured: false,
      linkText: t('learnMore')
    },
    {
      type: t('soilHealth'),
      title: t('update3Title'),
      description: t('update3Desc'),
      gradient: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      featured: false,
      linkText: t('learnMore')
    }
  ]

  return (
    <section className="section alt" id="updates">
      <div className="container">
        <div className="label">{t('updates')}</div>
        <h2>{t('updatesTitle')}</h2>
        <div className="news">
          {updates.map((update, idx) => (
            <article key={idx} className={`card ${update.featured ? 'featured' : ''}`}>
              <div className="visual" style={{ background: update.gradient }}></div>
              <div className="card-body">
                <strong>{update.type}</strong>
                <h3>{update.title}</h3>
                <p>{update.description}</p>
                <a className="btn link" href="#">{update.linkText} <FontAwesomeIcon icon={faArrowRight} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Updates