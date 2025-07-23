interface ListingReviewData {
  name: string;
  description: string;
  image: string;
  averageRating: number;
  reviewCount: number;
  reviews?: {
    author: string;
    rating: number;
    reviewText: string;
    datePublished: string;
  }[];
  brand?: string;
  offers?: {
    price: number;
    currency: string;
    availability: string;
  };
}

export function generateProductSchema(data: ListingReviewData) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "brand": {
      "@type": "Brand",
      "name": data.brand || "BoatMe"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": data.averageRating.toFixed(1),
      "reviewCount": data.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Add individual reviews if provided (up to 5 for better performance)
  if (data.reviews && data.reviews.length > 0) {
    (schema as any).review = data.reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished,
      "reviewBody": review.reviewText,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    }));
  }

  // Add offers if provided
  if (data.offers) {
    (schema as any).offers = {
      "@type": "Offer",
      "price": data.offers.price.toString(),
      "priceCurrency": data.offers.currency,
      "availability": `https://schema.org/${data.offers.availability}`
    };
  }

  return schema;
}

export function generateServiceSchema(data: ListingReviewData) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "provider": {
      "@type": "Organization",
      "name": data.brand || "BoatMe"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": data.averageRating.toFixed(1),
      "reviewCount": data.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Add individual reviews
  if (data.reviews && data.reviews.length > 0) {
    (schema as any).review = data.reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person", 
        "name": review.author
      },
      "datePublished": review.datePublished,
      "reviewBody": review.reviewText,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    }));
  }

  return schema;
}

interface SEOSchemaProps {
  data: ListingReviewData;
  type?: 'product' | 'service';
}

export function SEOSchema({ data, type = 'product' }: SEOSchemaProps) {
  const schema = type === 'product' 
    ? generateProductSchema(data) 
    : generateServiceSchema(data);

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}