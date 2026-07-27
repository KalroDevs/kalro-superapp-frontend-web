import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const HowItWorks = () => {
  const { t } = useLanguage()

  const steps = [
    { num: 1, title: t('step1Title'), description: t('step1Desc') },
    { num: 2, title: t('step2Title'), description: t('step2Desc') },
    { num: 3, title: t('step3Title'), description: t('step3Desc') },
    { num: 4, title: t('step4Title'), description: t('step4Desc') }
  ]

  return (
    <section className="section" id="how">
      <div className="container">
        <div className="center">
          <div className="label">{t('howItWorksTitle')}</div>
          <h2>{t('howItWorksSub')}</h2>
          <p className="lead">{t('howItWorksDesc')}</p>
        </div>
        <div className="steps">
          {steps.map(step => (
            <div className="step" key={step.num}>
              <div className="stepnum">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks