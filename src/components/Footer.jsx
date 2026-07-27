import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  const sections = [
    {
      title: t('agriculturalServices'),
      links: [t('weatherAdvisory'), t('cropSelector'), t('soilHealth'), t('livestockServices')]
    },
    {
      title: t('knowledge'),
      links: [t('knowledgeHub'), t('publications'), t('technologyCatalogue')]
    },
    {
      title: t('support'),
      links: [t('askKalro'), t('farmerCallCentre'), t('contactUs')]
    },
    {
      title: t('organization'),
      links: [t('about'), t('researchInstitutes'), t('partners')]
    },
    {
      title: t('legal'),
      links: [t('privacy'), t('dataProtection'), t('accessibility')]
    }
  ]

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4>{section.title}</h4>
              {section.links.map((link, linkIdx) => (
                <a href="#" key={linkIdx}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="bottom">
          <span>{t('kenya')} · {t('english')}</span>
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer