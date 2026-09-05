import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCheckCircle,
  faDownload,
  faSeedling,
  faStar,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../context/ApiContext'
import { useLanguage } from '../context/LanguageContext'

const FeaturedProducts = () => {
  const { store } = useApi()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchFeatured = async () => {
      try {
        const response = await store.getFeaturedProducts({ limit: 4 })
        const products = response?.results || response || []
        if (active) setFeaturedProducts(products.slice(0, 4))
      } catch (error) {
        console.warn('Failed to fetch featured products:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchFeatured()
    return () => {
      active = false
    }
  }, [store])

  return (
    <section className="featured-products-section" aria-labelledby="featured-products-title">
      <div className="container">
        <div className="featured-products-heading">
          <div>
            <span className="section-eyebrow">
              <FontAwesomeIcon icon={faStar} /> {t('featuredEyebrow')}
            </span>
            <h2 id="featured-products-title">{t('featuredTitle')}</h2>
            <p>
              {t('featuredDescription')}
            </p>
          </div>

          <Link to="/?page=store" className="featured-view-all">
            {t('featuredViewAll')} <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        <div className="featured-products-grid">
          {loading
            ? [...Array(4)].map((_, index) => (
                <div className="featured-product-card skeleton" key={index}>
                  <div className="featured-image skeleton-image" />
                  <div className="featured-card-body">
                    <div className="skeleton-line skeleton-line-sm" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                </div>
              ))
            : featuredProducts.map((product) => (
                <article
                  className="featured-product-card"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/product/${product.slug}`)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="featured-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} loading="lazy" />
                    ) : (
                      <div className="featured-image-placeholder">
                        <FontAwesomeIcon icon={faSeedling} />
                      </div>
                    )}

                    <div className="featured-image-overlay" />

                    <span className="featured-type-pill">
                      {product.product_type || t('featuredProductType')}
                    </span>

                    {product.is_verified && (
                      <span className="featured-verified">
                        <FontAwesomeIcon icon={faCheckCircle} /> {t('featuredVerified')}
                      </span>
                    )}
                  </div>

                  <div className="featured-card-body">
                    <span className="featured-category">
                      {product.category_name || t('featuredCategoryDefault')}
                    </span>
                    <h3>{product.title}</h3>
                    <p>
                      {product.short_description?.length > 120
                        ? `${product.short_description.slice(0, 120)}...`
                        : product.short_description}
                    </p>

                    <div className="featured-card-footer">
                      <div className="featured-card-metrics">
                        <span><FontAwesomeIcon icon={faDownload} /> {product.downloads_count || 0}</span>
                        <span><FontAwesomeIcon icon={faUsers} /> {product.users_count || 0}</span>
                      </div>
                      <span className="featured-card-arrow">
                        <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
        </div>

        {!loading && featuredProducts.length === 0 && (
          <div className="featured-products-empty">
            {t('featuredEmpty')}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts