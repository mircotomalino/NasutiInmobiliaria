import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const BASE_URL = "https://inmobiliarianasuti.com.ar";
const DEFAULT_OG_IMAGE = `${BASE_URL}/img/logos/NombreYLogoNasutiInmobiliaria.png`;

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogType = "website",
  keywords = [],
  noindex = false,
  nofollow = false,
}) => {
  // Validación de longitudes para SEO (solo en desarrollo)
  if (import.meta.env.DEV) {
    if (title.length > 60) {
      console.warn(
        `⚠️ SEO Warning: Title is too long (${title.length} chars). Recommended: max 60 characters.`
      );
    }
    if (description.length > 160) {
      console.warn(
        `⚠️ SEO Warning: Description is too long (${description.length} chars). Recommended: max 160 characters.`
      );
    }
    if (description.length < 120) {
      console.warn(
        `⚠️ SEO Warning: Description is too short (${description.length} chars). Recommended: 120-160 characters.`
      );
    }
  }

  const fullCanonicalUrl = canonicalUrl
    ? `${BASE_URL}${canonicalUrl}`
    : BASE_URL;

  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${BASE_URL}${ogImage}`;

  // Generar alt text para imagen OG si no se proporciona
  const ogImageAltText = ogImageAlt || title;

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
  ].join(", ");

  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={ogImageAltText} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="Nasuti Inmobiliaria" />
      <meta property="og:locale" content="es_AR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={ogImageAltText} />

      {/* Additional meta tags */}
      <meta name="author" content="Nasuti Inmobiliaria" />
      <meta name="theme-color" content="#f0782c" />
    </Helmet>
  );
};

export default SEOHead;

