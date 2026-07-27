import React, { createContext, useState, useContext } from 'react'

// Translation dictionaries
const translations = {
  en: {
    // Accessibility Bar
    'accessibility': 'Accessibility',
    'increaseFont': 'Increase font size',
    'decreaseFont': 'Decrease font size',
    'resetFont': 'Reset font size',
    'contrast': 'Contrast',
    'close': 'Close accessibility toolbar',
    
    // Brand
    'kalro': 'KALRO',
    'superapp': 'SuperAPP',
    'oneStopShop': 'One Stop Shop',
    
    // Navigation
    'research': 'Research',
    'digitalAgriculture': 'Digital Agriculture',
    'knowledge': 'Knowledge',
    'about': 'About',
    'signIn': 'Sign in',
    'search': 'Search',
    
    // Mega Menu
    'advisoryTools': 'Advisory Tools',
    'cropSelector': 'Crop Selector',
    'weatherAdvisory': 'Weather Advisory',
    'soilHealth': 'Soil Health',
    'pestDiagnosis': 'Pest Diagnosis',
    'dataIntelligence': 'Data & Intelligence',
    'marketIntelligence': 'Market Intelligence',
    'suitabilityMaps': 'Suitability Maps',
    'tela': 'TELA',
    'new': 'new',
    'kaop': 'KAOP',
    'supportKnowledge': 'Support & Knowledge',
    'knowledgeHub': 'Knowledge Hub',
    'askKalro': 'Ask KALRO',
    'livestockServices': 'Livestock Services',
    'extensionResources': 'Extension Resources',
    
    // Sub Navigation
    'howItWorks': 'How it works',
    'overview': 'Overview',
    'platformOverview': 'Platform overview',
    'userJourney': 'User journey',
    'successStories': 'Success stories',
    'whatsIncluded': "What's included",
    'services': 'Services',
    'allApps': 'All apps',
    'updates': 'Updates',
    'latest': 'Latest',
    'aiAdvisoryNews': 'AI advisory news',
    'weatherUpdates': 'Weather updates',
    'soilHealthInsights': 'Soil health insights',
    'allUpdates': 'All updates',
    'getStarted': 'Get started',
    'startHere': 'Start here',
    'farmAssessment': 'Farm assessment',
    'createAccount': 'Create account',
    'demoTour': 'Demo tour',
    'trainingResources': 'Training resources',
    'faqs': 'FAQs',
    'help': 'Help',
    'generalQuestions': 'General questions',
    'accountSupport': 'Account support',
    'technicalHelp': 'Technical help',
    'contactSupport': 'Contact support',
    'exploreServices': 'Explore services',
    'startNow': 'Start now',
    
    // Hero
    'coreValues': 'Core Values?',
    'tagLine': 'KALRO digital agriculture',
    'heroTitle': 'Your farming potential, connected',
    'heroDescription': 'Access trusted agricultural knowledge, AI-assisted advisory, weather intelligence, soil recommendations, and market information in one integrated platform.',
    'getRecommendation': 'Get a recommendation',
    'exploreSuperapp': 'Explore the SuperAPP',
    
    // Role Tabs
    'forFarmers': 'For farmers',
    'forExtension': 'For extension officers',
    'forResearchers': 'For researchers',
    'forAgribusiness': 'For agribusiness',
    
    // Role Cards
    'farmersTitle': 'For Farmers',
    'farmersDesc': 'Get crop recommendations, weather alerts, soil health tips, and market prices tailored to your location.',
    'extensionTitle': 'For Extension Officers',
    'extensionDesc': 'Access advisory tools, farmer data, and knowledge resources to deliver better support to farming communities.',
    'researchersTitle': 'For Researchers',
    'researchersDesc': 'Explore datasets, trial results, publications, and analytical tools to advance agricultural science.',
    'agribusinessTitle': 'For Agribusiness',
    'agribusinessDesc': 'Access market intelligence, supply chain data, and enterprise tools to optimize agricultural value chains.',
    'markets': 'Markets',
    'publications': 'Publications',
    'dataApi': 'Data API',
    'marketIntel': 'Market Intel',
    
    // How It Works
    'howItWorksTitle': 'How it works',
    'howItWorksSub': 'From farm question to practical action',
    'howItWorksDesc': 'The KALRO SuperAPP brings together validated research, local data, intelligent tools, and agricultural services to support better decisions throughout the farming cycle.',
    'step1Title': 'Describe your farm',
    'step1Desc': 'Select your location, enterprise, season, production system, and farming objective.',
    'step2Title': 'Connect trusted data',
    'step2Desc': 'Combine KALRO knowledge with soil, weather, market, and location information.',
    'step3Title': 'Receive guidance',
    'step3Desc': 'Get clear recommendations on varieties, soil health, management, risks, and markets.',
    'step4Title': 'Access support',
    'step4Desc': 'Connect to nearby services, learning content, laboratories, experts, and agro-dealers.',
    
    // Updates
    'updatesTitle': "Discover what's happening across KALRO digital agriculture",
    'featured': 'Featured',
    'update1Title': 'AI-assisted advisory for more responsive extension services',
    'update1Desc': 'Help farmers and extension teams access clearer, faster, and more consistent agricultural guidance.',
    'update2Title': 'Turn forecasts into farm actions',
    'update2Desc': 'Use localized weather information to plan planting, field operations, and risk management.',
    'update3Title': 'Better nutrient decisions for productive farms',
    'update3Desc': 'Combine soil information, crop needs, and KALRO recommendations.',
    'learnMore': 'Learn more',
    'readFeature': 'Read the feature',
    
    // Services
    'servicesTitle': 'Powerful services for agriculture',
    'exploreAll': 'Explore all services',
    'weatherDesc': 'Localized forecasts, seasonal outlooks, crop calendars, and weather-based guidance.',
    'cropDesc': 'Identify suitable crops and varieties using location, climate, soil, and farming goals.',
    'soilDesc': 'Receive practical soil, nutrient, liming, organic matter, and fertilizer guidance.',
    'pestDesc': 'Identify likely crop health problems and access validated response measures.',
    'livestockDesc': 'Access breed, feeding, animal health, pasture, and husbandry recommendations.',
    'marketDesc': 'Compare prices, identify demand trends, and connect to nearby markets.',
    'knowledgeDesc': 'Explore extension content, publications, technologies, manuals, and learning resources.',
    'askDesc': 'Connect with the call centre, AI assistant, scientists, laboratories, and support.',
    
    // CTA
    'ctaTitle': 'Take the next step with KALRO SuperAPP',
    'ctaDesc': 'Start with your location and farming enterprise to receive practical, Kenya-specific agricultural guidance.',
    'startAssessment': 'Start farm assessment',
    
    // FAQ
    'faqTitle': 'Learn more about KALRO SuperAPP',
    'faq1Q': 'What is the KALRO SuperAPP?',
    'faq1A': 'An integrated digital gateway for agricultural advisories, decision-support tools, research knowledge, products, market information, and farmer support services.',
    'faq2Q': 'Who can use the platform?',
    'faq2A': 'Farmers, extension officers, researchers, agribusinesses, county teams, development partners, and other agricultural stakeholders.',
    'faq3Q': 'How are recommendations generated?',
    'faq3A': 'Recommendations combine farm details with validated KALRO content and relevant location, soil, weather, crop, livestock, and market data.',
    'faq4Q': 'Can I access expert support?',
    'faq4A': 'Yes. The platform is designed to connect users to KALRO experts, call-centre services, laboratories, and extension resources.',
    
    // Footer
    'agriculturalServices': 'Agricultural services',
    'technologyCatalogue': 'Technology catalogue',
    'farmerCallCentre': 'Farmer call centre',
    'contactUs': 'Contact us',
    'organization': 'Organization',
    'researchInstitutes': 'Research institutes',
    'partners': 'Partners',
    'legal': 'Legal',
    'privacy': 'Privacy',
    'dataProtection': 'Data protection',
    'kenya': 'Kenya',
    'english': 'English',
    'kiswahili': 'Kiswahili',
    'copyright': '© 2026 Kenya Agricultural and Livestock Research Organization',
    
    // Language
    'languageSet': 'Language set to English',
    'swahiliSet': 'Lugha imewekwa Kiswahili',


     // Store Page Translations
    'storeWelcome': 'Welcome to the KALRO Digital Ecosystem',
    'storeDescription': 'Explore categories - from AI advisory to traceability - powering Kenya\'s agricultural transformation.',
    'exploreAll': 'Explore all',
    'featuredProducts': 'Featured products',
    'seeAll': 'See all',
    'filterByCategory': 'Filter by category',
    'searchProducts': 'Search products...',
    'allDigitalProducts': 'All digital products & services',
    'products': 'products',
    'noProductsFound': 'No products found matching your criteria.',
    'clearFilters': 'Clear filters',
    'learnMore': 'Learn more',
    'privacy': 'Privacy',
    'terms': 'Terms',
    'support': 'Support',
    'copyright': '© 2026 KALRO · Digital Agriculture Ecosystem',
    
    // Categories
    'categoryAll': 'All',
    'categoryAdvisory': 'Advisory & AI',
    'categoryClimate': 'Climate & Weather',
    'categorySoil': 'Soil & Land',
    'categoryHealth': 'Crop, Livestock & Fish',
    'categoryKnowledge': 'Knowledge & Extension',
    'categoryMarkets': 'Markets & Agribusiness',
    'categoryIdentity': 'Farmer Identity & DPI',
    'categoryLab': 'Lab & Diagnostics',
    'categoryResearch': 'Research & Innovation',
    'categoryPrecision': 'Precision & IoT',
    'categoryFinance': 'Financial Services',
    'categoryTraceability': 'Traceability & Supply',
    'categoryEnterprise': 'Enterprise Services',
    'categoryData': 'Data & AI Platform',
    
    // App Descriptions
    'appKalroSelector': 'AI-powered crop and variety recommendation engine.',
    'appAIFarmAdvisor': 'Personalized recommendations for crops, livestock, and soil.',
    'appSoilHealth': 'Nutrient, liming, and organic matter recommendations.',
    'appCropRecommendation': 'Location-based crop suitability and variety selection.',
    'appLivestockRecommendation': 'Breed, feeding, and health recommendations for livestock.',
    'appPastureRecommendation': 'Optimal pasture and forage species for your region.',
    'appWeatherAdvisory': 'Localized forecasts, seasonal outlooks, and alerts.',
    'appObservatory': 'Real-time climate, drought, and environmental monitoring.',
    'appSeasonalForecasts': 'Seasonal rainfall and temperature outlooks.',
    'appDroughtMonitoring': 'Early warning and drought severity tracking.',
    'appDigitalSoilMaps': 'High-resolution soil property and fertility maps.',
    'appLandSoilCrop': 'Integrated land, soil, and crop information platform.',
    'appPestIdentification': 'AI-powered pest identification and management.',
    'appDiseaseIdentification': 'Crop and livestock disease diagnosis using AI.',
    'appGAPKnowledge': 'Good Agricultural Practices and extension content.',
    'appEExtension': 'Digital extension services for farmers and officers.',
    'appMarketPrices': 'Real-time commodity and input price information.',
    'appUjuziLink': 'Buyer-seller linkage and value chain platform.',
    'appKYF': 'Digital farmer identity and registration system.',
    'appAPIGateway': 'Open API infrastructure for interoperability.',
    'appSoilLab': 'Online booking and sample tracking for soil testing.',
    'appLIMS': 'Laboratory Information Management System.',
    'appResearchData': 'Open access to agricultural research data.',
    'appIoTSensor': 'Real-time sensor data for smart farming.',
    'appCreditScoring': 'Farmer credit scoring and loan eligibility assessment.',
    'appTraceability': 'End-to-end supply chain traceability using QR.',
    'appBusinessIntelligence': 'Executive dashboards and analytics for KALRO.',
    'appKilimoSTAT': 'National agricultural statistics and analytics.',
    'appGISPlatform': 'Geospatial data and mapping infrastructure.',
    
    // Badges
    'badgePopular': 'Popular',
    'badgeFeatured': 'Featured',
    'badgeTop': 'Top',
    'badgeNew': 'New',
    'badgeAIPowered': 'AI-Powered',
    'badgeRealTime': 'Real-time',
    'badgeMarket': 'Market'
  },
  sw: {
    // Accessibility Bar
    'accessibility': 'Ufikiaji',
    'increaseFont': 'Ongeza saizi ya herufi',
    'decreaseFont': 'Punguza saizi ya herufi',
    'resetFont': 'Rudisha saizi ya herufi',
    'contrast': 'Tofauti',
    'close': 'Funga upau wa ufikiaji',
    
    // Brand
    'kalro': 'KALRO',
    'superapp': 'SuperAPP',
    'oneStopShop': 'Duka Moja',
    
    // Navigation
    'research': 'Utafiti',
    'digitalAgriculture': 'Kilimo cha Dijitali',
    'knowledge': 'Maarifa',
    'about': 'Kuhusu',
    'signIn': 'Ingia',
    'search': 'Tafuta',
    
    // Mega Menu
    'advisoryTools': 'Zana za Ushauri',
    'cropSelector': 'Kichagua Mazao',
    'weatherAdvisory': 'Ushauri wa Hali ya Hewa',
    'soilHealth': 'Afya ya Udongo',
    'pestDiagnosis': 'Utambuzi wa Wadudu',
    'dataIntelligence': 'Data na Akili',
    'marketIntelligence': 'Akili ya Soko',
    'suitabilityMaps': 'Ramani za Kufaa',
    'tela': 'TELA',
    'new': 'mpya',
    'kaop': 'KAOP',
    'supportKnowledge': 'Msaada na Maarifa',
    'knowledgeHub': 'Kituo cha Maarifa',
    'askKalro': 'Uliza KALRO',
    'livestockServices': 'Huduma za Mifugo',
    'extensionResources': 'Rasilimali za Ugani',
    
    // Sub Navigation
    'howItWorks': 'Inavyofanya kazi',
    'overview': 'Muhtasari',
    'platformOverview': 'Muhtasari wa jukwaa',
    'userJourney': 'Safari ya mtumiaji',
    'successStories': 'Hadithi za mafanikio',
    'whatsIncluded': 'Kinachojumuishwa',
    'services': 'Huduma',
    'allApps': 'Programu zote',
    'updates': 'Sasisho',
    'latest': 'Hivi karibuni',
    'aiAdvisoryNews': 'Habari za ushauri wa AI',
    'weatherUpdates': 'Sasisho za hali ya hewa',
    'soilHealthInsights': 'Uchunguzi wa afya ya udongo',
    'allUpdates': 'Sasisho zote',
    'getStarted': 'Anza',
    'startHere': 'Anza hapa',
    'farmAssessment': 'Tathmini ya shamba',
    'createAccount': 'Tengeneza akaunti',
    'demoTour': 'Ziara ya onyesho',
    'trainingResources': 'Rasilimali za mafunzo',
    'faqs': 'Maswali yanayoulizwa mara kwa mara',
    'help': 'Msaada',
    'generalQuestions': 'Maswali ya jumla',
    'accountSupport': 'Msaada wa akaunti',
    'technicalHelp': 'Msaada wa kiufundi',
    'contactSupport': 'Wasiliana na msaada',
    'exploreServices': 'Chunguza huduma',
    'startNow': 'Anza sasa',
    
    // Hero
    'coreValues': 'Maadili ya Msingi?',
    'tagLine': 'Kilimo cha dijitali cha KALRO',
    'heroTitle': 'Uwezo wako wa kilimo, umeunganishwa',
    'heroDescription': 'Pata maarifa ya kilimo yaliyothibitishwa, ushauri wa AI, akili ya hali ya hewa, mapendekezo ya udongo, na taarifa za soko katika jukwaa moja lililounganishwa.',
    'getRecommendation': 'Pata pendekezo',
    'exploreSuperapp': 'Chunguza SuperAPP',
    
    // Role Tabs
    'forFarmers': 'Kwa wakulima',
    'forExtension': 'Kwa maafisa ugani',
    'forResearchers': 'Kwa watafiti',
    'forAgribusiness': 'Kwa biashara ya kilimo',
    
    // Role Cards
    'farmersTitle': 'Kwa Wakulima',
    'farmersDesc': 'Pata mapendekezo ya mazao, tahadhari za hali ya hewa, vidokezo vya afya ya udongo, na bei za soko kulingana na eneo lako.',
    'extensionTitle': 'Kwa Maafisa Ugani',
    'extensionDesc': 'Pata zana za ushauri, data ya wakulima, na rasilimali za maarifa ili kutoa msaada bora kwa jamii za kilimo.',
    'researchersTitle': 'Kwa Watafiti',
    'researchersDesc': 'Chunguza hifadhidata, matokeo ya majaribio, machapisho, na zana za uchambuzi ili kuendeleza sayansi ya kilimo.',
    'agribusinessTitle': 'Kwa Biashara ya Kilimo',
    'agribusinessDesc': 'Pata akili ya soko, data ya ugavi, na zana za biashara ili kuboresha minyororo ya thamani ya kilimo.',
    'markets': 'Masoko',
    'publications': 'Machapisho',
    'dataApi': 'API ya Data',
    'marketIntel': 'Akili ya Soko',
    
    // How It Works
    'howItWorksTitle': 'Inavyofanya kazi',
    'howItWorksSub': 'Kutoka swali la shamba hadi hatua ya vitendo',
    'howItWorksDesc': 'SuperAPP ya KALRO inaleta pamoja utafiti uliothibitishwa, data ya ndani, zana mahiri, na huduma za kilimo ili kusaidia maamuzi bora katika mzunguko mzima wa kilimo.',
    'step1Title': 'Elezea shamba lako',
    'step1Desc': 'Chagua eneo lako, biashara, msimu, mfumo wa uzalishaji, na lengo la kilimo.',
    'step2Title': 'Unganisha data inayoaminika',
    'step2Desc': 'Changanya maarifa ya KALRO na udongo, hali ya hewa, soko, na taarifa za eneo.',
    'step3Title': 'Pokea mwongozo',
    'step3Desc': 'Pata mapendekezo wazi kuhusu aina, afya ya udongo, usimamizi, hatari, na masoko.',
    'step4Title': 'Pata msaada',
    'step4Desc': 'Unganisha na huduma za karibu, maudhui ya kujifunza, maabara, wataalamu, na wauzaji wa mazao.',
    
    // Updates
    'updatesTitle': 'Gundua kinachotokea katika kilimo cha dijitali cha KALRO',
    'featured': 'Iliyoangaziwa',
    'update1Title': 'Ushauri wa AI kwa huduma za ugani zinazoitikia zaidi',
    'update1Desc': 'Wasaidie wakulima na timu za ugani kupata mwongozo wa kilimo ulio wazi, wa haraka, na thabiti zaidi.',
    'update2Title': 'Geuza utabiri wa hali ya hewa kuwa hatua za shamba',
    'update2Desc': 'Tumia taarifa za hali ya hewa za eneo lako kupanga upandaji, shughuli za shamba, na usimamizi wa hatari.',
    'update3Title': 'Maamuzi bora ya virutubisho kwa mashamba yenye tija',
    'update3Desc': 'Unganisha taarifa za udongo, mahitaji ya mazao, na mapendekezo ya KALRO.',
    'learnMore': 'Jifunze zaidi',
    'readFeature': 'Soma kipengele',
    
    // Services
    'servicesTitle': 'Huduma zenye nguvu kwa kilimo',
    'exploreAll': 'Chunguza huduma zote',
    'weatherDesc': 'Utabiri wa eneo, mtazamo wa msimu, kalenda ya mazao, na mwongozo kulingana na hali ya hewa.',
    'cropDesc': 'Tambua mazao na aina zinazofaa kwa kutumia eneo, hali ya hewa, udongo, na malengo ya kilimo.',
    'soilDesc': 'Pata mwongozo wa vitendo wa udongo, virutubisho, chokaa, mambo ya kikaboni, na mbolea.',
    'pestDesc': 'Tambua matatizo ya afya ya mazao na upate hatua za kukabiliana zilizothibitishwa.',
    'livestockDesc': 'Pata mapendekezo ya ufugaji, malisho, afya ya wanyama, malisho, na usimamizi.',
    'marketDesc': 'Linganisha bei, tambua mitindo ya mahitaji, na unganishwa na masoko ya karibu.',
    'knowledgeDesc': 'Chunguza maudhui ya ugani, machapisho, teknolojia, miongozo, na rasilimali za kujifunza.',
    'askDesc': 'Unganisha na kituo cha simu, msaidizi wa AI, wanasayansi, maabara, na msaada.',
    
    // CTA
    'ctaTitle': 'Chukua hatua inayofuata na KALRO SuperAPP',
    'ctaDesc': 'Anza na eneo lako na biashara yako ya kilimo ili kupata mwongozo wa kilimo unaofaa Kenya.',
    'startAssessment': 'Anza tathmini ya shamba',
    
    // FAQ
    'faqTitle': 'Jifunze zaidi kuhusu KALRO SuperAPP',
    'faq1Q': 'KALRO SuperAPP ni nini?',
    'faq1A': 'Lango lililounganishwa la dijitali kwa ushauri wa kilimo, zana za kusaidia maamuzi, maarifa ya utafiti, bidhaa, taarifa za soko, na huduma za msaada kwa wakulima.',
    'faq2Q': 'Nani anaweza kutumia jukwaa?',
    'faq2A': 'Wakulima, maafisa ugani, watafiti, biashara za kilimo, timu za kaunti, washirika wa maendeleo, na wadau wengine wa kilimo.',
    'faq3Q': 'Mapendekezo yanatolewaje?',
    'faq3A': 'Mapendekezo yanachanganya maelezo ya shamba na maudhui ya KALRO yaliyothibitishwa na data muhimu ya eneo, udongo, hali ya hewa, mazao, mifugo, na soko.',
    'faq4Q': 'Je, ninaweza kupata msaada wa kitaalamu?',
    'faq4A': 'Ndiyo. Jukwaa limeundwa kuwaunganisha watumiaji na wataalamu wa KALRO, huduma za kituo cha simu, maabara, na rasilimali za ugani.',
    
    // Footer
    'agriculturalServices': 'Huduma za Kilimo',
    'technologyCatalogue': 'Katalogi ya Teknolojia',
    'farmerCallCentre': 'Kituo cha Simu cha Wakulima',
    'contactUs': 'Wasiliana nasi',
    'organization': 'Shirika',
    'researchInstitutes': 'Taasisi za Utafiti',
    'partners': 'Washirika',
    'legal': 'Kisheria',
    'privacy': 'Faragha',
    'dataProtection': 'Ulinzi wa Data',
    'kenya': 'Kenya',
    'english': 'Kiingereza',
    'kiswahili': 'Kiswahili',
    'copyright': '© 2026 Shirika la Utafiti wa Kilimo na Mifugo Kenya',
    
    // Language
    'languageSet': 'Lugha imewekwa Kiingereza',
    'swahiliSet': 'Lugha imewekwa Kiswahili',

    // Store Page Translations
    'storeWelcome': 'Karibu kwenye Mfumo wa Dijitali wa KALRO',
    'storeDescription': 'Chunguza kategoria 14 za biashara - kutoka ushauri wa AI hadi ufuatiliaji - zinazoendesha mabadiliko ya kilimo nchini Kenya.',
    'exploreAll': 'Chunguza zote',
    'featuredProducts': 'Bidhaa zilizoangaziwa',
    'seeAll': 'Ona zote',
    'filterByCategory': 'Chuja kwa kategoria',
    'searchProducts': 'Tafuta bidhaa...',
    'allDigitalProducts': 'Bidhaa na huduma zote za dijitali',
    'products': 'bidhaa',
    'noProductsFound': 'Hakuna bidhaa zilizopatikana zinazolingana na vigezo vyako.',
    'clearFilters': 'Futa vichujio',
    'learnMore': 'Jifunze zaidi',
    'privacy': 'Faragha',
    'terms': 'Masharti',
    'support': 'Msaada',
    'copyright': '© 2026 KALRO · Mfumo wa Dijitali wa Kilimo',
    
    // Categories
    'categoryAll': 'Zote',
    'categoryAdvisory': 'Ushauri na AI',
    'categoryClimate': 'Hali ya Hewa',
    'categorySoil': 'Udongo na Ardhi',
    'categoryHealth': 'Mazao, Mifugo na Samaki',
    'categoryKnowledge': 'Maarifa na Ugani',
    'categoryMarkets': 'Masoko na Biashara ya Kilimo',
    'categoryIdentity': 'Utambulisho wa Mkulima na DPI',
    'categoryLab': 'Maabara na Uchunguzi',
    'categoryResearch': 'Utafiti na Ubunifu',
    'categoryPrecision': 'Usahihi na IoT',
    'categoryFinance': 'Huduma za Kifedha',
    'categoryTraceability': 'Ufuatiliaji na Ugavi',
    'categoryEnterprise': 'Huduma za Biashara',
    'categoryData': 'Data na Jukwaa la AI',
    
    // App Descriptions
    'appKalroSelector': 'Injini ya mapendekezo ya mazao na aina inayotumia AI.',
    'appAIFarmAdvisor': 'Mapendekezo ya kibinafsi kwa mazao, mifugo, na udongo.',
    'appSoilHealth': 'Mapendekezo ya virutubisho, chokaa, na vitu vya kikaboni.',
    'appCropRecommendation': 'Uchaguzi wa mazao na aina kulingana na eneo.',
    'appLivestockRecommendation': 'Mapendekezo ya ufugaji, malisho, na afya ya mifugo.',
    'appPastureRecommendation': 'Aina bora za malisho na nyasi kwa eneo lako.',
    'appWeatherAdvisory': 'Utabiri wa eneo, mtazamo wa msimu, na tahadhari.',
    'appObservatory': 'Ufuatiliaji wa hali ya hewa, ukame, na mazingira kwa wakati halisi.',
    'appSeasonalForecasts': 'Utabiri wa mvua na joto kwa msimu.',
    'appDroughtMonitoring': 'Onyo la mapema na ufuatiliaji wa ukali wa ukame.',
    'appDigitalSoilMaps': 'Ramani za ubora wa juu za mali na rutuba ya udongo.',
    'appLandSoilCrop': 'Jukwaa la taarifa za ardhi, udongo, na mazao.',
    'appPestIdentification': 'Utambuzi na usimamizi wa wadudu kwa kutumia AI.',
    'appDiseaseIdentification': 'Utambuzi wa magonjwa ya mazao na mifugo kwa kutumia AI.',
    'appGAPKnowledge': 'Mazoea Bora ya Kilimo na maudhui ya ugani.',
    'appEExtension': 'Huduma za ugani za dijitali kwa wakulima na maafisa.',
    'appMarketPrices': 'Taarifa za bei za bidhaa na pembejeo kwa wakati halisi.',
    'appUjuziLink': 'Jukwaa la kuunganisha wanunuzi na wauzaji na mnyororo wa thamani.',
    'appKYF': 'Mfumo wa utambulisho na usajili wa wakulima wa dijitali.',
    'appAPIGateway': 'Miundombinu ya API wazi kwa uunganishaji.',
    'appSoilLab': 'Kuhifadhi nafasi mtandaoni na ufuatiliaji wa sampuli za udongo.',
    'appLIMS': 'Mfumo wa Usimamizi wa Taarifa za Maabara.',
    'appResearchData': 'Upatikanaji wa wazi wa data za utafiti wa kilimo.',
    'appIoTSensor': 'Data ya sensorer kwa wakati halisi kwa kilimo cha kisasa.',
    'appCreditScoring': 'Tathmini ya alama ya mkopo na ustahiki wa mkopo kwa mkulima.',
    'appTraceability': 'Ufuatiliaji wa mnyororo wa ugavi kutoka shamba hadi meza kwa kutumia QR.',
    'appBusinessIntelligence': 'Dashibodi za utendaji na uchanganuzi wa KALRO.',
    'appKilimoSTAT': 'Takwimu na uchanganuzi wa kitaifa wa kilimo.',
    'appGISPlatform': 'Miundombinu ya data ya kijiografia na ramani.',
    
    // Badges
    'badgePopular': 'Inayojulikana',
    'badgeFeatured': 'Iliyoangaziwa',
    'badgeTop': 'Bora',
    'badgeNew': 'Mpya',
    'badgeAIPowered': 'Inaendeshwa na AI',
    'badgeRealTime': 'Wakati Halisi',
    'badgeMarket': 'Soko'
  }
}

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const toggleLanguage = (lang) => {
    setCurrentLanguage(lang)
  }

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}