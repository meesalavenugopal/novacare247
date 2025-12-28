import { Helmet } from 'react-helmet-async';
import { generateSEOKeywordsString, getTopCitiesForSEO } from '../data/indianCities';

// Pre-generate keywords for performance
const allCityKeywords = generateSEOKeywordsString();
const topCities = getTopCitiesForSEO();

/**
 * SEO Component for dynamic page-level SEO optimization
 * Use this on every page for optimal SEO performance
 */
const SEO = ({ 
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://novacare247.com/og-image.jpg',
  ogType = 'website',
  noindex = false,
  location = null,
  service = null,
  doctor = null,
  structuredData = null
}) => {
  // Base title with brand and cities
  const cityList = topCities.slice(0, 5).join(', ');
  const fullTitle = title 
    ? `${title} | NovaCare 24/7 Physiotherapy`
    : `NovaCare 24/7 Physiotherapy Clinics | Best Physio in ${cityList} & All India`;
  
  // Default description with dynamic cities
  const defaultDescription = location
    ? `Best physiotherapy clinic in ${location}. NovaCare offers 24/7 expert care for back pain, sports injuries, post-surgery rehab. Book appointment now!`
    : `NovaCare - India's #1 24/7 Physiotherapy Clinic Chain. Expert physiotherapists across India - ${topCities.slice(0, 8).join(', ')} & 500+ cities. Book appointment for back pain, sports injury, post-surgery rehab.`;
  
  const metaDescription = description || defaultDescription;
  
  // Enhanced keywords with all cities
  const baseKeywords = 'physiotherapy near me, physiotherapy clinic, physio, physiotherapist, NovaCare, novacare247, best physiotherapy, back pain treatment, sports injury, knee pain, neck pain';
  const enhancedKeywords = keywords 
    ? `${keywords}, ${topCities.slice(0, 20).map(c => `physiotherapy ${c}`).join(', ')}`
    : `${baseKeywords}, ${allCityKeywords.substring(0, 2000)}`;
  const metaKeywords = enhancedKeywords;
  
  // Canonical URL
  const canonicalUrl = canonical || 'https://novacare247.com/';
  
  // Generate service-specific structured data
  const generateServiceSchema = () => {
    if (!service) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalTherapy',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'MedicalOrganization',
        name: 'NovaCare Physiotherapy',
        url: 'https://novacare247.com'
      },
      relevantSpecialty: {
        '@type': 'MedicalSpecialty',
        name: 'Physiotherapy'
      }
    };
  };
  
  // Generate doctor-specific structured data
  const generateDoctorSchema = () => {
    if (!doctor) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: doctor.name,
      description: doctor.bio || `Expert physiotherapist at NovaCare`,
      image: doctor.image,
      jobTitle: doctor.specialization || 'Physiotherapist',
      worksFor: {
        '@type': 'MedicalOrganization',
        name: 'NovaCare Physiotherapy',
        url: 'https://novacare247.com'
      },
      medicalSpecialty: 'Physiotherapy',
      availableService: {
        '@type': 'MedicalTherapy',
        name: 'Physiotherapy'
      }
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="NovaCare Physiotherapy" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@novacare247" />
      
      {/* Location-specific geo tags */}
      {location && (
        <>
          <meta name="geo.placename" content={`${location}, India`} />
        </>
      )}
      
      {/* Service structured data */}
      {service && (
        <script type="application/ld+json">
          {JSON.stringify(generateServiceSchema())}
        </script>
      )}
      
      {/* Doctor structured data */}
      {doctor && (
        <script type="application/ld+json">
          {JSON.stringify(generateDoctorSchema())}
        </script>
      )}
      
      {/* Custom structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
