import { BlogPost, BlogMetadata } from '@/types/blog';

export function generateBlogMetadata(post: BlogPost, baseUrl: string = 'https://boatme.co.za'): BlogMetadata {
  return {
    title: post.metaTitle || `${post.title} | BoatMe Blog`,
    description: post.metaDescription || post.excerpt,
    canonicalUrl: post.canonicalUrl || `${baseUrl}/blog/${post.slug}`,
    ogImage: post.featuredImage,
    keywords: post.seoKeywords || post.tags,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
    category: post.category
  };
}

export function generateBlogSchema(post: BlogPost, baseUrl: string = 'https://boatme.co.za') {
  const metadata = generateBlogMetadata(post, baseUrl);
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "BoatMe",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": metadata.canonicalUrl
    },
    "articleSection": post.category,
    "keywords": post.tags.join(', '),
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readTime}M`
  };
}

interface BlogSEOProps {
  post: BlogPost;
  baseUrl?: string;
}

export function BlogSEO({ post, baseUrl = 'https://boatme.co.za' }: BlogSEOProps) {
  const metadata = generateBlogMetadata(post, baseUrl);
  const schema = generateBlogSchema(post, baseUrl);

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords.join(', ')} />
      <link rel="canonical" href={metadata.canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={metadata.ogImage} />
      <meta property="og:url" content={metadata.canonicalUrl} />
      <meta property="og:site_name" content="BoatMe" />
      <meta property="article:published_time" content={metadata.publishedTime} />
      {metadata.modifiedTime && (
        <meta property="article:modified_time" content={metadata.modifiedTime} />
      )}
      <meta property="article:author" content={metadata.author} />
      <meta property="article:section" content={metadata.category} />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={metadata.ogImage} />
      
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema, null, 2)
        }}
      />
    </>
  );
}

export function generateBlogIndexSchema(posts: BlogPost[], baseUrl: string = 'https://boatme.co.za') {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "BoatMe Blog",
    "description": "Expert boating tips, skipper guides, and destination insights for South African waters",
    "url": `${baseUrl}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "BoatMe",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.featuredImage,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt || post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "url": `${baseUrl}/blog/${post.slug}`
    }))
  };
}

interface BlogIndexSEOProps {
  posts: BlogPost[];
  baseUrl?: string;
}

export function BlogIndexSEO({ posts, baseUrl = 'https://boatme.co.za' }: BlogIndexSEOProps) {
  const schema = generateBlogIndexSchema(posts, baseUrl);

  return (
    <>
      <title>BoatMe Blog | Boating Tips, Skipper Guides & Destinations</title>
      <meta name="description" content="Expert boating advice, skipper licence guides, and the best boating destinations across South Africa. Your complete resource for safe and enjoyable boating." />
      <meta name="keywords" content="boating tips, skipper licence, boat rental, south africa, boating destinations, water sports, boat safety" />
      <link rel="canonical" href={`${baseUrl}/blog`} />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content="BoatMe Blog - Boating Tips & Guides" />
      <meta property="og:description" content="Expert boating advice, skipper licence guides, and the best boating destinations across South Africa." />
      <meta property="og:url" content={`${baseUrl}/blog`} />
      <meta property="og:site_name" content="BoatMe" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="BoatMe Blog - Boating Tips & Guides" />
      <meta name="twitter:description" content="Expert boating advice, skipper licence guides, and the best boating destinations across South Africa." />
      
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema, null, 2)
        }}
      />
    </>
  );
}