import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const FAQ = () => {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    { question: t('faq1Q'), answer: t('faq1A') },
    { question: t('faq2Q'), answer: t('faq2A') },
    { question: t('faq3Q'), answer: t('faq3A') },
    { question: t('faq4Q'), answer: t('faq4A') }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="center">
          <div className="label">{t('faqs')}</div>
          <h2>{t('faqTitle')}</h2>
        </div>
        <div className="faq">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
              <button className="faq-btn" onClick={() => toggleFAQ(idx)}>
                <span>{faq.question}</span>
                <span className="plus">+</span>
              </button>
              <div className="answer">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ