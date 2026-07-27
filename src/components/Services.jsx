import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudSun, faSeedling, faTrowel, faBug, 
  faHorseHead, faChartLine, faBook, faHeadset,
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const Services = () => {
  const { t } = useLanguage()

  const services = [
    { icon: faCloudSun, bg: 'blue-bg', title: t('weatherAdvisory'), description: t('weatherDesc') },
    { icon: faSeedling, bg: 'green-bg', title: t('cropSelector'), description: t('cropDesc') },
    { icon: faTrowel, bg: 'brown-bg', title: t('soilHealth'), description: t('soilDesc') },
    { icon: faBug, bg: 'orange-bg', title: t('pestDiagnosis'), description: t('pestDesc') },
    { icon: faHorseHead, bg: 'green-bg', title: t('livestockServices'), description: t('livestockDesc') },
    { icon: faChartLine, bg: 'blue-bg', title: t('marketIntelligence'), description: t('marketDesc') },
    { icon: faBook, bg: 'brown-bg', title: t('knowledgeHub'), description: t('knowledgeDesc') },
    { icon: faHeadset, bg: 'purple-bg', title: t('askKalro'), description: t('askDesc') }
  ]

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="apps-head">
          <div>
            <div className="label">{t('whatsIncluded')}</div>
            <h2>{t('servicesTitle')}</h2>
          </div>
          <a className="btn link" href="#">{t('exploreAll')} <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <div className="apps-grid">
          {services.map((service, idx) => (
            <article className="app" key={idx}>
              <div className="app-visual">
                <div className={`icon ${service.bg}`}>
                  <FontAwesomeIcon icon={service.icon} />
                </div>
              </div>
              <div className="app-body">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="btn link" href="#">{t('learnMore')} <FontAwesomeIcon icon={faArrowRight} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services