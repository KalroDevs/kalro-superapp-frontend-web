import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Solid icons
import { 
  faEnvelope, 
  faLock, 
  faUser, 
  faEye, 
  faEyeSlash,
  faArrowRight,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
// Brand icons
import { 
  faGoogle,
  faFacebook, 
  faApple 
} from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import './AuthPage.css'

const AuthPage = () => {
  const { t, currentLanguage } = useLanguage()
  const navigate = useNavigate()
  
  // State for login/register toggle
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  // Toggle between login and register
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormErrors({})
    setSuccessMessage('')
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required'
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'Name must be at least 2 characters'
      }
      
      if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number'
      }
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (!isLogin) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      
      if (!formData.agreeTerms) {
        errors.agreeTerms = 'You must agree to the terms and conditions'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setSuccessMessage('')
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (isLogin) {
        // Login success
        setSuccessMessage('Welcome back! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        // Registration success
        setSuccessMessage('Account created successfully! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (error) {
      setFormErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Social login handlers
  const handleSocialLogin = (provider) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Back button */}
        <Link to="/" className="auth-back-btn">
          <FontAwesomeIcon icon={faArrowRight} /> Back to Home
        </Link>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Logo/Brand */}
          <div className="auth-brand">
            <div className="auth-logo"><img 
                src="/images/logo.png" 
                alt="KALRO Logo" 
                className="brand-logo"
                onError={() => setLogoError(true)}
              />
              </div>
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>
              {isLogin 
                ? 'Sign in to access your agricultural dashboard' 
                : 'Join the KALRO digital ecosystem today'}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="auth-success">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {formErrors.submit && (
            <div className="auth-error">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{formErrors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name - Register only */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="fullName">
                  <FontAwesomeIcon icon={faUser} /> Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Kamau"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && (
                  <span className="error-message">{formErrors.fullName}</span>
                )}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>

            {/* Phone - Register only */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="phone">
                  <FontAwesomeIcon icon={faPhone} /> Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
              </div>
            )}

            {/* Location - Register only */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Location (Optional)
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Nairobi, Kenya"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} /> Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={formErrors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>

            {/* Confirm Password - Register only */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FontAwesomeIcon icon={faLock} /> Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={formErrors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <span className="error-message">{formErrors.confirmPassword}</span>
                )}
              </div>
            )}

            {/* Forgot Password - Login only */}
            {isLogin && (
              <div className="forgot-password">
                <Link to="#">Forgot password?</Link>
              </div>
            )}

            {/* Terms - Register only */}
            {!isLogin && (
              <div className="terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="#">Terms of Service</Link> and{' '}
                    <Link to="#">Privacy Policy</Link>
                  </span>
                </label>
                {formErrors.agreeTerms && (
                  <span className="error-message">{formErrors.agreeTerms}</span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button 
              className="social-btn google"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} />
              <span>Google</span>
            </button>
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faFacebook} />
              <span>Facebook</span>
            </button>
            <button 
              className="social-btn apple"
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faApple} />
              <span>Apple</span>
            </button>
          </div>

          {/* Toggle between Login/Register */}
          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleMode} type="button">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>© 2026 Kenya Agricultural and Livestock Research Organization</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage