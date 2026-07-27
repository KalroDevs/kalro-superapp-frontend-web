import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTractor, 
  faUsers, 
  faFlask, 
  faStore, 
  faSeedling, 
  faCloudSun, 
  faTrowel, 
  faChartLine, 
  faBook, 
  faHeadset, 
  faBug, 
  faDna, 
  faMap, 
  faChartPie,
  faWater, 
  faTree, 
  faIndustry, 
  faHandshake, 
  faGraduationCap,
  faMicroscope, 
  faFileAlt, 
  faVideo, 
  faPhone, 
  faEnvelope,
  faCalendarAlt, 
  faClock, 
  faUserGraduate, 
  faAward,
  faBriefcase, 
  faBuilding, 
  faRuler, 
  faBalanceScale,
  faTags
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'

const RoleTabs = () => {
  const { t } = useLanguage()
  const [activeRole, setActiveRole] = useState('farmers')

  const roles = [
    { id: 'farmers', label: t('forFarmers') },
    { id: 'extension', label: t('forExtension') },
    { id: 'researchers', label: t('forResearchers') },
    { id: 'agribusiness', label: t('forAgribusiness') }
  ]

  const roleData = {
    farmers: {
      icon: faTractor,
      title: t('farmersTitle'),
      description: t('farmersDesc'),
      mainFeatures: [
        { icon: faSeedling, text: 'Crop variety recommendations' },
        { icon: faCloudSun, text: 'Real-time weather alerts' },
        { icon: faTrowel, text: 'Soil testing & analysis' },
        { icon: faChartLine, text: 'Market price updates' },
        { icon: faBug, text: 'Pest & disease identification' },
        { icon: faWater, text: 'Irrigation scheduling' },
        { icon: faTree, text: 'Agroforestry advice' },
        { icon: faCalendarAlt, text: 'Planting calendars' }
      ],
      additionalResources: [
        { icon: faVideo, text: 'Training videos' },
        { icon: faPhone, text: 'Expert helpline' },
        { icon: faEnvelope, text: 'SMS notifications' },
        { icon: faClock, text: 'Seasonal forecasts' }
      ],
      tags: [t('cropSelector'), t('weatherAdvisory'), t('soilHealth'), t('markets')],
      tagIcons: [faSeedling, faCloudSun, faTrowel, faChartLine]
    },
    extension: {
      icon: faUsers,
      title: t('extensionTitle'),
      description: t('extensionDesc'),
      mainFeatures: [
        { icon: faBook, text: 'Knowledge management system' },
        { icon: faHeadset, text: 'Farmer advisory tools' },
        { icon: faSeedling, text: 'Crop selection guides' },
        { icon: faBug, text: 'Pest diagnosis tools' },
        { icon: faChartLine, text: 'Farmer data analytics' },
        { icon: faUsers, text: 'Community engagement' },
        { icon: faGraduationCap, text: 'Training resources' },
        { icon: faHandshake, text: 'Stakeholder collaboration' }
      ],
      additionalResources: [
        { icon: faVideo, text: 'Extension videos' },
        { icon: faFileAlt, text: 'Report generation' },
        { icon: faPhone, text: 'Field support' },
        { icon: faCalendarAlt, text: 'Event scheduling' }
      ],
      tags: [t('knowledgeHub'), t('askKalro'), t('cropSelector'), t('pestDiagnosis')],
      tagIcons: [faBook, faHeadset, faSeedling, faBug]
    },
    researchers: {
      icon: faFlask,
      title: t('researchersTitle'),
      description: t('researchersDesc'),
      mainFeatures: [
        { icon: faDna, text: 'TELA research data' },
        { icon: faBook, text: 'Publications & journals' },
        { icon: faMap, text: 'Suitability mapping' },
        { icon: faChartPie, text: 'Data analytics tools' },
        { icon: faMicroscope, text: 'Laboratory results' },
        { icon: faTree, text: 'Biodiversity data' },
        { icon: faWater, text: 'Water quality studies' },
        { icon: faBalanceScale, text: 'Research ethics' }
      ],
      additionalResources: [
        { icon: faFileAlt, text: 'Research papers' },
        { icon: faVideo, text: 'Webinars' },
        { icon: faUserGraduate, text: 'Student resources' },
        { icon: faAward, text: 'Grants & funding' }
      ],
      tags: [t('tela'), t('publications'), t('suitabilityMaps'), t('dataApi')],
      tagIcons: [faDna, faBook, faMap, faChartPie]
    },
    agribusiness: {
      icon: faStore,
      title: t('agribusinessTitle'),
      description: t('agribusinessDesc'),
      mainFeatures: [
        { icon: faChartLine, text: 'Market intelligence' },
        { icon: faTractor, text: 'KAOP platform' },
        { icon: faSeedling, text: 'Supply chain tools' },
        { icon: faHeadset, text: 'Business advisory' },
        { icon: faIndustry, text: 'Value chain analysis' },
        { icon: faBuilding, text: 'Agri-processing' },
        { icon: faBriefcase, text: 'Investment opportunities' },
        { icon: faHandshake, text: 'Partnerships' }
      ],
      additionalResources: [
        { icon: faChartPie, text: 'Market reports' },
        { icon: faCalendarAlt, text: 'Trade events' },
        { icon: faEnvelope, text: 'Business newsletters' },
        { icon: faRuler, text: 'Quality standards' }
      ],
      tags: [t('marketIntel'), t('kaop'), t('cropSelector'), t('askKalro')],
      tagIcons: [faChartLine, faTractor, faSeedling, faHeadset]
    }
  }

  return (
    <>
      <div className="tabs-section">
        <div className="container tabs-grid">
          {roles.map(role => (
            <button
              key={role.id}
              className={`tab ${activeRole === role.id ? 'active' : ''}`}
              onClick={() => setActiveRole(role.id)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <section className="role-content" id="role-content">
        <div className="container">
          <div className="role-grid-detailed">
            {Object.entries(roleData).map(([key, data]) => (
              <div
                key={key}
                className="role-card-detailed"
                style={{ display: activeRole === key ? 'block' : 'none' }}
              >
                <div className="role-header">
                  <span className="icon-lg"><FontAwesomeIcon icon={data.icon} /></span>
                  <h3>{data.title}</h3>
                  <p className="role-description">{data.description}</p>
                </div>

                <div className="role-features">
                  <h4><FontAwesomeIcon icon={faChartLine} /> Main Features</h4>
                  <div className="features-grid">
                    {data.mainFeatures.map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <FontAwesomeIcon icon={feature.icon} />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="role-additional">
                  <h4><FontAwesomeIcon icon={faBook} /> Additional Resources</h4>
                  <div className="additional-grid">
                    {data.additionalResources.map((resource, idx) => (
                      <div key={idx} className="resource-item">
                        <FontAwesomeIcon icon={resource.icon} />
                        <span>{resource.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="role-tags">
                  <h4><FontAwesomeIcon icon={faTags} /> Quick Access</h4>
                  <div className="app-tags">
                    {data.tags.map((tag, idx) => (
                      <span key={idx}>
                        <FontAwesomeIcon icon={data.tagIcons[idx]} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default RoleTabs