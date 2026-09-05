// Store.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { useLanguage } from '../context/LanguageContext';
import './Store.css';

// Icons
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const ListIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const FilterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>;
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const StarIcon = ({ filled = false }) => filled ? 
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#e4a400" stroke="#e4a400" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> :
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d7ddd9" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ChevronDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18"/></svg>;
const RefreshIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>;
const ExternalLinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Filter Accordion component
const FilterAccordion = ({ title, children, isOpen, onToggle, count }) => (
  <div className="filter-accordion">
    <button 
      className="filter-accordion-header" 
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span>
        {title}
        {count > 0 && <span className="filter-count">{count}</span>}
      </span>
      {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
    </button>
    {isOpen && <div className="filter-accordion-content">{children}</div>}
  </div>
);

// Filter label mapping for display
const FILTER_LABELS = {
  category: 'category',
  value_chain_stage: 'value_chain_stage',
  technology: 'technology',
  delivery_channel: 'delivery_channel',
  target_user: 'target_user',
  subsector: 'subsector',
  value_chain: 'value_chain',
  geographic_coverage: 'geographic_coverage',
  provider: 'provider',
  min_rating: 'min_rating',
  is_verified: 'is_verified',
  has_digital_content: 'has_digital_content'
};

const Store = () => {
  const { store } = useApi();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState({});
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState({ total: 0, categories: 0, providers: 0 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Filter data states
  const [filterData, setFilterData] = useState({
    categories: [],
    valueChainStages: [],
    technologies: [],
    deliveryChannels: [],
    targetUsers: [],
    subsectors: [],
    valueChains: [],
    geographicCoverage: [],
    providers: [],
    filterOptions: {}
  });
  
  // Accordion state
  const [openAccordions, setOpenAccordions] = useState({
    categories: true,
    valueChainStages: false,
    technologies: false,
    deliveryChannels: false,
    targetUsers: false,
    subsectors: false,
    valueChains: false,
    geographicCoverage: false,
    providers: false,
    additional: false
  });

  const debouncedSearch = useDebounce(searchQuery, 500);
  const initialLoadDone = useRef(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (initialLoadDone.current) {
        fetchAllData();
      }
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch all filter data on mount
  const fetchFilterData = useCallback(async () => {
    try {
      const [
        categories,
        valueChainStages,
        technologies,
        deliveryChannels,
        targetUsers,
        subsectors,
        valueChains,
        geographicCoverage,
        providers,
        filterOptions
      ] = await Promise.allSettled([
        store.getCategories().catch(() => []),
        store.getValueChainStages().catch(() => []),
        store.getTechnologies().catch(() => []),
        store.getDeliveryChannels().catch(() => []),
        store.getTargetUsers().catch(() => []),
        store.getSubsectors().catch(() => []),
        store.getValueChains().catch(() => []),
        store.getGeographicCoverage().catch(() => []),
        store.getProviders().catch(() => []),
        store.getFilterOptions().catch(() => ({}))
      ]);

      const getValue = (result, defaultValue) => 
        result.status === 'fulfilled' ? result.value : defaultValue;

      const categoriesData = getValue(categories, []);
      const valueChainStagesData = getValue(valueChainStages, []);
      const technologiesData = getValue(technologies, []);
      const deliveryChannelsData = getValue(deliveryChannels, []);
      const targetUsersData = getValue(targetUsers, []);
      const subsectorsData = getValue(subsectors, []);
      const valueChainsData = getValue(valueChains, []);
      const geographicCoverageData = getValue(geographicCoverage, []);
      const providersData = getValue(providers, []);
      const filterOptionsData = getValue(filterOptions, {});

      setFilterData({
        categories: categoriesData.results || categoriesData || [],
        valueChainStages: valueChainStagesData.results || valueChainStagesData || [],
        technologies: technologiesData.results || technologiesData || [],
        deliveryChannels: deliveryChannelsData.results || deliveryChannelsData || [],
        targetUsers: targetUsersData.results || targetUsersData || [],
        subsectors: subsectorsData.results || subsectorsData || [],
        valueChains: valueChainsData.results || valueChainsData || [],
        geographicCoverage: geographicCoverageData.results || geographicCoverageData || [],
        providers: providersData.results || providersData || [],
        filterOptions: filterOptionsData || {}
      });

      if (filterOptionsData?.stats) {
        setStats(filterOptionsData.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch filter data:', err);
    }
  }, [store]);

  // Build filter query params
  const buildFilterParams = useCallback(() => {
    const params = { 
      page: pagination.page, 
      page_size: 12 
    };
    
    const filterMap = {
      category: 'category',
      value_chain_stage: 'value_chain_stage',
      technology: 'technology',
      delivery_channel: 'delivery_channel',
      target_user: 'target_user',
      subsector: 'subsector',
      value_chain: 'value_chain',
      geographic_coverage: 'geographic_coverage',
      provider: 'provider',
      min_rating: 'min_rating',
      is_verified: 'is_verified',
      has_digital_content: 'has_digital_content'
    };

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        const apiKey = filterMap[key] || key;
        params[apiKey] = value;
      }
    });
    
    if (debouncedSearch) params.search = debouncedSearch;
    
    return params;
  }, [activeFilters, pagination.page, debouncedSearch]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isOnline) {
        throw new Error('You are offline. Please check your internet connection.');
      }
      
      const params = buildFilterParams();
      let response;
      
      if (debouncedSearch) {
        response = await store.searchProducts(params);
      } else {
        response = await store.getProducts(params);
      }
      
      const productsData = response.results || response || [];
      setProducts(productsData);
      
      if (response.count !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: response.count,
          totalPages: Math.ceil(response.count / (params.page_size || 12))
        }));
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [store, buildFilterParams, debouncedSearch, isOnline]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      if (!isOnline) return;
      const response = await store.getFeaturedProducts({ limit: 6 });
      setFeaturedProducts(response.results || response || []);
    } catch (err) {
      console.warn('Failed to fetch featured products:', err);
    }
  }, [store, isOnline]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!isOnline) {
      setError('You are offline. Please check your internet connection.');
      setLoading(false);
      return;
    }
    
    await Promise.all([
      fetchProducts(),
      fetchFeaturedProducts(),
      fetchFilterData()
    ]);
  }, [fetchProducts, fetchFeaturedProducts, fetchFilterData, isOnline]);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchAllData();
      initialLoadDone.current = true;
    }
  }, [fetchAllData]);

  // Fetch on filter/search/page changes
  useEffect(() => {
    if (initialLoadDone.current) {
      const timer = setTimeout(() => {
        fetchProducts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fetchProducts]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => {
      if (value === null || value === undefined || value === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRetry = () => {
    fetchAllData();
  };

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveFilterCount = (filterKeys) => {
    return filterKeys.filter(key => activeFilters[key]).length;
  };

  // Get display label for filter value
  const getFilterDisplayValue = (key, value) => {
    if (!value) return value;
    
    const lookupMap = {
      category: filterData.categories,
      value_chain_stage: filterData.valueChainStages,
      technology: filterData.technologies,
      delivery_channel: filterData.deliveryChannels,
      target_user: filterData.targetUsers,
      subsector: filterData.subsectors,
      value_chain: filterData.valueChains,
      geographic_coverage: filterData.geographicCoverage,
      provider: filterData.providers
    };
    
    const options = lookupMap[key];
    if (options) {
      const found = options.find(opt => String(opt.id) === String(value) || opt.name === value);
      if (found) return found.name || found.value || value;
    }
    
    if (key === 'min_rating') {
      const ratings = { '1': '1+ Stars', '2': '2+ Stars', '3': '3+ Stars', '4': '4+ Stars' };
      return ratings[value] || value;
    }
    if (key === 'is_verified') return value ? t('storeVerified') : t('storeNotVerified');
    if (key === 'has_digital_content') return value ? t('storeFilterDigitalContent') : t('storeFilterPhysicalOnly');
    
    return value;
  };

  const renderSelectFilter = (key, label, options, placeholder = `All ${label}s`) => {
    if (!options || options.length === 0) return null;
    
    return (
      <div className="filter-field">
        <label htmlFor={`filter-${key}`}>{label}</label>
        <select
          id={`filter-${key}`}
          value={activeFilters[key] || ''}
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.id || option} value={option.id || option}>
              {option.name || option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Handle product card click
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  // Render product card with link
  const renderProductCard = (product) => {
    // Map API fields to display fields
    const imageUrl = product.image_url || product.image || null;
    const productName = product.title || product.name || 'Product';
    const categoryName = product.category_name || product.category?.name || t('storeUncategorized');
    const providerName = product.provider_name || product.provider?.name || '';
    const description = product.short_description || product.description || t('storeNoDescription');
    const rating = parseFloat(product.rating) || 0;
    const reviewCount = parseInt(product.reviews_count) || 0;
    const downloadCount = parseInt(product.downloads_count) || parseInt(product.downloads) || 0;
    const isVerified = product.is_verified || false;
    const isFeatured = product.is_featured || false;
    const badges = product.badges || [];
    const productType = product.product_type || t('storeProductType');
    const slug = product.slug || product.id;

    return (
      <div 
        className="product-card" 
        key={product.id || slug}
        onClick={() => handleProductClick(slug)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProductClick(slug);
          }
        }}
        aria-label={`View ${productName} details`}
      >
        <div className="product-card-media">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={productName} 
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="product-placeholder">
                    <span>📦</span>
                    <span>${categoryName}</span>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="product-placeholder">
              <span>📦</span>
              <span>{categoryName}</span>
            </div>
          )}
          <div className="card-badges">
            {isVerified && (
              <span className="verified-badge">✓ {t('storeVerified')}</span>
            )}
            {isFeatured && (
              <span>⭐ {t('storeFeatured')}</span>
            )}
            {badges.length > 0 && badges.slice(0, 2).map((badge, index) => (
              <span key={index}>{badge}</span>
            ))}
          </div>
        </div>
        <div className="product-card-body">
          <div className="product-card-topline">
            <span className="product-category">{categoryName}</span>
            <span className="product-type">{productType}</span>
          </div>
          <h3>{productName}</h3>
          {providerName && (
            <p className="provider-name">{t('storeByProvider', { provider: providerName })}</p>
          )}
          <p className="product-description">{description}</p>
          <div className="product-card-footer">
            <div className="product-meta">
              {rating > 0 && (
                <span className="rating">
                  <span className="stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < Math.round(rating)} />
                    ))}
                  </span>
                  {rating.toFixed(1)}
                </span>
              )}
              {reviewCount > 0 && (
                <span>({reviewCount} {t('storeReviews')})</span>
              )}
              {downloadCount > 0 && (
                <span>⬇ {downloadCount.toLocaleString()}</span>
              )}
              {product.users_count && parseInt(product.users_count) > 0 && (
                <span>👤 {parseInt(product.users_count).toLocaleString()}</span>
              )}
            </div>
            <span className="learn-more">
              {t('storeViewDetails')} <ExternalLinkIcon />
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render featured card with link
  const renderFeaturedCard = (product) => {
    const imageUrl = product.image_url || product.image || null;
    const slug = product.slug || product.id;
    
    return (
      <div 
        className="featured-card" 
        key={product.id}
        onClick={() => handleProductClick(slug)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProductClick(slug);
          }
        }}
        aria-label={`View ${product.title || product.name} details`}
      >
        <div className="featured-card-image">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title || product.name} loading="lazy" />
          ) : (
            <div className="featured-placeholder">🌟</div>
          )}
        </div>
        <h4>{product.title || product.name}</h4>
        <span className="featured-category">{product.category_name || product.category?.name}</span>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="product-skeleton">
      <div className="skeleton-media"></div>
      <div className="skeleton-line wide"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );

  // Offline/Error state
  if (!isOnline && !loading) {
    return (
      <div className="store-page">
        <div className="store-shell">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '48px' }}>📶</div>
            <h3>{t('storeNoInternet')}</h3>
            <p>
              {t('storeOfflineMessage')}
            </p>
            <button onClick={handleRetry}>
              <RefreshIcon /> {t('storeTryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading && products.length === 0) {
    return (
      <div className="store-page">
        <div className="store-shell">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>{t('storeLoadError')}</h3>
            <p>{error}</p>
            <button onClick={handleRetry}>
              <RefreshIcon /> {t('storeRetry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-page">
      <div className="store-shell">
        {/* Hero Section */}
        <section className="store-hero">
          <div>
            <span className="eyebrow">{t('storeHeroEyebrow')}</span>
            <h1>{t('storeHeroTitle')}</h1>
            <p>
              {t('storeHeroDescription')}
            </p>
          </div>
          <div className="hero-summary">
            <div>
              <strong>{pagination.total || products.length || 0}</strong>
              <span>{t('storeTotalProducts')}</span>
            </div>
            <div>
              <strong>{filterData.categories.length || 0}</strong>
              <span>{t('storeCategories')}</span>
            </div>
            <div>
              <strong>{filterData.providers.length || 0}</strong>
              <span>{t('storeProviders')}</span>
            </div>
          </div>
        </section>       

        {/* Catalogue */}
        <section className="catalogue" id="catalogue">
          {/* Toolbar */}
          <div className="catalogue-toolbar">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder={t('storeSearchPlaceholder')}
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search products"
                disabled={!isOnline}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} aria-label={t('storeClearSearch')}>
                  <CloseIcon />
                </button>
              )}
            </div>
            <div className="toolbar-actions">
              <select 
                value={activeFilters.category || ''} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                aria-label="Filter by category"
                disabled={!isOnline || filterData.categories.length === 0}
              >
                <option value="">{t('storeAllCategories')}</option>
                {filterData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="view-switcher">
                <button 
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label={t('storeGrid')}
                >
                  <GridIcon />
                </button>
                <button 
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label={t('storeList')}
                >
                  <ListIcon />
                </button>
              </div>
              <button 
                className="mobile-filter-button"
                onClick={() => setFilterSidebarOpen(true)}
                aria-label={t('storeFilters')}
                disabled={!isOnline}
              >
                <FilterIcon />
                <span>{Object.keys(activeFilters).length}</span>
              </button>
            </div>
          </div>

          {/* Active Filters with correct labels */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="active-filter-row">
              <span className="active-filter-label">{t('storeActiveFilters')}</span>
              {Object.entries(activeFilters).map(([key, value]) => {
                const label = t(`storeFilterLabel${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`) || key.replace(/_/g, ' ');
                const displayValue = getFilterDisplayValue(key, value);
                return (
                  <span key={key} className="filter-chip">
                    {label}: {displayValue}
                    <button onClick={() => handleFilterChange(key, null)} aria-label={`Remove ${label} filter`}>
                      <CloseIcon />
                    </button>
                  </span>
                );
              })}
              <button className="clear-filter-link" onClick={handleClearFilters}>
                {t('storeClearAll')}
              </button>
            </div>
          )}

          {/* Layout */}
          <div className="catalogue-layout">
            {/* Filter Sidebar */}
            <aside className={`filter-sidebar ${filterSidebarOpen ? 'open' : ''}`}>
              <div className="filter-sidebar-header">
                <h2>
                  <FilterIcon />
                  {t('storeFilters')}
                </h2>
                <button 
                  className="filter-close"
                  onClick={() => setFilterSidebarOpen(false)}
                  aria-label="Close filters"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Categories */}
              <FilterAccordion
                title={t('storeFilterLabelCategory')}
                isOpen={openAccordions.categories}
                onToggle={() => toggleAccordion('categories')}
                count={getActiveFilterCount(['category'])}
              >
                {renderSelectFilter('category', t('storeFilterLabelCategory'), filterData.categories)}
              </FilterAccordion>

              {/* Value Chain Stages */}
              {filterData.valueChainStages.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelValueChainStage')}
                  isOpen={openAccordions.valueChainStages}
                  onToggle={() => toggleAccordion('valueChainStages')}
                  count={getActiveFilterCount(['value_chain_stage'])}
                >
                  {renderSelectFilter('value_chain_stage', t('storeFilterLabelStage'), filterData.valueChainStages)}
                </FilterAccordion>
              )}

              {/* Technologies */}
              {filterData.technologies.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelTechnologies')}
                  isOpen={openAccordions.technologies}
                  onToggle={() => toggleAccordion('technologies')}
                  count={getActiveFilterCount(['technology'])}
                >
                  {renderSelectFilter('technology', t('storeFilterLabelTechnology'), filterData.technologies)}
                </FilterAccordion>
              )}

              {/* Delivery Channels */}
              {filterData.deliveryChannels.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelDeliveryChannels')}
                  isOpen={openAccordions.deliveryChannels}
                  onToggle={() => toggleAccordion('deliveryChannels')}
                  count={getActiveFilterCount(['delivery_channel'])}
                >
                  {renderSelectFilter('delivery_channel', t('storeFilterLabelChannel'), filterData.deliveryChannels)}
                </FilterAccordion>
              )}

              {/* Target Users */}
              {filterData.targetUsers.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelTargetUsers')}
                  isOpen={openAccordions.targetUsers}
                  onToggle={() => toggleAccordion('targetUsers')}
                  count={getActiveFilterCount(['target_user'])}
                >
                  {renderSelectFilter('target_user', t('storeFilterLabelUserType'), filterData.targetUsers)}
                </FilterAccordion>
              )}

              {/* Subsectors */}
              {filterData.subsectors.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelSubsectors')}
                  isOpen={openAccordions.subsectors}
                  onToggle={() => toggleAccordion('subsectors')}
                  count={getActiveFilterCount(['subsector'])}
                >
                  {renderSelectFilter('subsector', t('storeFilterLabelSubsector'), filterData.subsectors)}
                </FilterAccordion>
              )}

              {/* Value Chains */}
              {filterData.valueChains.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelValueChains')}
                  isOpen={openAccordions.valueChains}
                  onToggle={() => toggleAccordion('valueChains')}
                  count={getActiveFilterCount(['value_chain'])}
                >
                  {renderSelectFilter('value_chain', t('storeFilterLabelValueChain'), filterData.valueChains)}
                </FilterAccordion>
              )}

              {/* Geographic Coverage */}
              {filterData.geographicCoverage.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelGeographicCoverage')}
                  isOpen={openAccordions.geographicCoverage}
                  onToggle={() => toggleAccordion('geographicCoverage')}
                  count={getActiveFilterCount(['geographic_coverage'])}
                >
                  {renderSelectFilter('geographic_coverage', t('storeFilterLabelRegion'), filterData.geographicCoverage)}
                </FilterAccordion>
              )}

              {/* Providers */}
              {filterData.providers.length > 0 && (
                <FilterAccordion
                  title={t('storeFilterLabelProviders')}
                  isOpen={openAccordions.providers}
                  onToggle={() => toggleAccordion('providers')}
                  count={getActiveFilterCount(['provider'])}
                >
                  {renderSelectFilter('provider', t('storeFilterLabelProvider'), filterData.providers)}
                </FilterAccordion>
              )}

              {/* Additional Filters */}
              <FilterAccordion
                title={t('storeFilterLabelAdditional')}
                isOpen={openAccordions.additional}
                onToggle={() => toggleAccordion('additional')}
                count={getActiveFilterCount(['min_rating', 'is_verified', 'has_digital_content'])}
              >
                <div className="filter-field">
                  <label htmlFor="filter-min-rating">{t('storeFilterMinRating')}</label>
                  <select
                    id="filter-min-rating"
                    value={activeFilters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                  >
                    <option value="">{t('storeFilterAnyRating')}</option>
                    <option value="1">⭐ 1+ {t('storeFilterStars')}</option>
                    <option value="2">⭐ 2+ {t('storeFilterStars')}</option>
                    <option value="3">⭐ 3+ {t('storeFilterStars')}</option>
                    <option value="4">⭐ 4+ {t('storeFilterStars')}</option>
                  </select>
                </div>

                <div className="filter-divider" />

                <div className="filter-checks">
                  <label>
                    <input
                      type="checkbox"
                      checked={activeFilters.is_verified || false}
                      onChange={(e) => handleFilterChange('is_verified', e.target.checked || null)}
                    />
                    <span>{t('storeFilterVerifiedOnly')}</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={activeFilters.has_digital_content || false}
                      onChange={(e) => handleFilterChange('has_digital_content', e.target.checked || null)}
                    />
                    <span>{t('storeFilterDigitalContent')}</span>
                  </label>
                </div>
              </FilterAccordion>

              <button className="clear-filters-button" onClick={handleClearFilters}>
                {t('storeResetFilters')}
              </button>
            </aside>

            {/* Products Area */}
            <div className="products-area">
              <div className="results-heading">
                <div>
                  <h2>
                    {loading ? t('storeLoading') : t('storeProductsCount', { count: pagination.total || products.length })}
                  </h2>
                  {!loading && products.length > 0 && (
                    <p>
                      {searchQuery 
                        ? t('storeShowingSearch', { showing: products.length, total: pagination.total || products.length, search: searchQuery })
                        : t('storeShowingProducts', { showing: products.length, total: pagination.total || products.length })
                      }
                    </p>
                  )}
                  {!loading && products.length === 0 && (
                    <p>{t('storeNoProductsFound')}</p>
                  )}
                </div>
                <div className="endpoint-status">
                  <span className={`status-dot ${!isOnline ? 'offline' : ''}`} />
                  {isOnline ? t('storeLive') : t('storeOffline')}
                </div>
              </div>

              {error && (
                <div className="catalogue-alert">
                  <span>⚠️</span>
                  <span>{error}</span>
                  <button onClick={handleRetry}>
                    {t('storeRetry')}
                  </button>
                </div>
              )}

              {loading ? (
                <div className={`products-container ${viewMode}`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3>{t('storeNoProductsFound')}</h3>
                  <p>
                    {searchQuery 
                      ? t('storeNoSearchResults', { search: searchQuery })
                      : t('storeNoProductsMessage')
                    }
                  </p>
                  <button onClick={handleClearFilters}>{t('storeClearAll')}</button>
                </div>
              ) : (
                <>
                  <div className={`products-container ${viewMode}`}>
                    {products.map(product => renderProductCard(product))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <span className="pagination-summary">
                        {t('storePageOf', { current: pagination.page, total: pagination.totalPages })}
                      </span>
                      <div className="pagination-controls">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page <= 1 || loading}
                          aria-label="Previous page"
                        >
                          ← {t('storePagePrevious')}
                        </button>
                        <span>{pagination.page}</span>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.totalPages || loading}
                          aria-label="Next page"
                        >
                          {t('storePageNext')} →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Filter Overlay */}
      {filterSidebarOpen && (
        <button 
          className="filter-overlay"
          onClick={() => setFilterSidebarOpen(false)}
          aria-label="Close filters"
        />
      )}
    </div>
  );
};

export default Store;