import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import AccessibilityBar from './components/AccessibilityBar'
import Header from './components/Header'
import SubNav from './components/SubNav'
import Hero from './components/Hero'
import RoleTabs from './components/RoleTabs'
import HowItWorks from './components/HowItWorks'
import Updates from './components/Updates'
import Services from './components/Services'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import AuthPage from './pages/AuthPage'
import { useLanguage } from './context/LanguageContext'

function AppContent() {
  const { currentLanguage } = useLanguage()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const page = params.get('page')
    if (page === 'store') {
      setCurrentPage('store')
    } else {
      setCurrentPage('home')
    }
  }, [location])

  const navigateToStore = () => {
    window.history.pushState({}, '', '/?page=store')
    setCurrentPage('store')
  }

  // Check if we're on auth page (login or register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  
  // Check if we're on product detail page
  const isProductPage = location.pathname.startsWith('/product/')

  return (
    <div>
      <AccessibilityBar />
      <Header onStoreClick={navigateToStore} />
      <SubNav onStoreClick={navigateToStore} />
      
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      ) : isProductPage ? (
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      ) : currentPage === 'store' ? (
        <Store />
      ) : (
        <main>
          <Hero />
          <RoleTabs />
          <HowItWorks />
          <Updates />
          <Services />
          <CTA />
          <FAQ />
        </main>
      )}
      
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App