import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { ApiProvider } from './context/ApiContext'
import { AuthProvider, useAuth } from './context/AuthContext'

import AccessibilityBar from './components/AccessibilityBar'
import Header from './components/Header'
import SubNav from './components/SubNav'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import AuthPage from './pages/AuthPage'


function AppContent() {
  const { isAuthenticated, user } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState('home')


  // ----------------------------------------------------------
  // Detect current page from query parameters
  // ----------------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const page = params.get('page')

    if (page === 'store') {
      setCurrentPage('store')
    } else {
      setCurrentPage('home')
    }
  }, [location.search])


  // ----------------------------------------------------------
  // Navigation helpers
  // ----------------------------------------------------------

  const navigateToStore = () => {
    navigate('/?page=store')
  }


  // ----------------------------------------------------------
  // Route detection
  // ----------------------------------------------------------

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register'

  const isProductPage =
    location.pathname.startsWith('/product/')


  // ----------------------------------------------------------
  // Page content
  // ----------------------------------------------------------

  const renderContent = () => {
    // Authentication pages
    if (isAuthPage) {
      return (
        <Routes>
          <Route
            path="/login"
            element={<AuthPage />}
          />

          <Route
            path="/register"
            element={<AuthPage />}
          />
        </Routes>
      )
    }


    // Product detail
    if (isProductPage) {
      return (
        <Routes>
          <Route
            path="/product/:slug"
            element={<ProductDetail />}
          />
        </Routes>
      )
    }


    // Store catalogue
    if (currentPage === 'store') {
      return <Store />
    }


    // Home page
    return (
      <main>
        <Hero />

        {/* <FeaturedProducts /> */}

        <FAQ />
      </main>
    )
  }


  return (
    <div className="app">
      <AccessibilityBar />

      <Header
        onStoreClick={navigateToStore}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <SubNav
        onStoreClick={navigateToStore}
      />

      {renderContent()}

      <Footer />
    </div>
  )
}


function App() {
  return (
    <Router>
      <ApiProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ApiProvider>
    </Router>
  )
}


export default App