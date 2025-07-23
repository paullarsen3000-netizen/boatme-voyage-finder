import { Helmet } from 'react-helmet-async';

export interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

const DEFAULT_IMAGE = '/images/social-fallback.jpg';
const DEFAULT_SITE_NAME = 'BoatMe';
const DEFAULT_LOCALE = 'en_ZA';
const BASE_URL = 'https://boatme.co.za';

export function generateSocialMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  siteName = DEFAULT_SITE_NAME,
  locale = DEFAULT_LOCALE,
  twitterCard = 'summary_large_image'
}: SocialMetaProps) {
  const fullUrl = url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : BASE_URL;
  const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    title: `${title} | ${siteName}`,
    description,
    canonicalUrl: fullUrl,
    ogImage: fullImageUrl,
    ogUrl: fullUrl,
    ogType: type,
    ogSiteName: siteName,
    ogLocale: locale,
    twitterCard,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: fullImageUrl
  };
}

interface SocialMetaComponentProps extends SocialMetaProps {}

export function SocialMeta(props: SocialMetaComponentProps) {
  const meta = generateSocialMeta(props);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta property="og:site_name" content={meta.ogSiteName} />
      <meta property="og:locale" content={meta.ogLocale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:title" content={meta.twitterTitle} />
      <meta name="twitter:description" content={meta.twitterDescription} />
      <meta name="twitter:image" content={meta.twitterImage} />
      
      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
}

// Predefined meta generators for specific page types
export function generateBoatMeta(boat: {
  name: string;
  description: string;
  image?: string;
  location: string;
  price: number;
  id: string;
}) {
  return generateSocialMeta({
    title: `Rent ${boat.name} in ${boat.location}`,
    description: `${boat.description.slice(0, 160)}... Starting from R${boat.price}/day. Book now on BoatMe!`,
    image: boat.image,
    url: `/boats/${boat.id}`,
    type: 'product'
  });
}

export function generateCourseMeta(course: {
  title: string;
  description: string;
  provider: string;
  location: string;
  price: number;
  id: string;
  image?: string;
}) {
  return generateSocialMeta({
    title: `${course.title} - ${course.provider}`,
    description: `${course.description.slice(0, 160)}... R${course.price} in ${course.location}. Book your SAMSA accredited skipper course today!`,
    image: course.image,
    url: `/courses/${course.id}`,
    type: 'product'
  });
}

export function generateHomepageMeta() {
  return generateSocialMeta({
    title: 'Rent Boats & Get Your Skipper License in South Africa',
    description: 'Find the perfect boat rental and get your SAMSA skipper license. Verified listings, trusted providers, and expert support across South Africa.',
    url: '/',
    type: 'website'
  });
}

export function generateBlogIndexMeta() {
  return generateSocialMeta({
    title: 'Boating Tips, Guides & Destinations Blog',
    description: 'Expert boating advice, skipper license guides, and the best boating destinations across South Africa. Your complete resource for safe and enjoyable boating.',
    url: '/blog',
    type: 'website'
  });
}

export function generateRentPageMeta() {
  return generateSocialMeta({
    title: 'Boat Rentals Across South Africa',
    description: 'Browse verified boat rentals from trusted owners. Find pontoons, ski boats, and more for your perfect day on the water.',
    url: '/rent',
    type: 'website'
  });
}