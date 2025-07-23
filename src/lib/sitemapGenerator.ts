interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapData {
  boats: Array<{ id: string; updatedAt?: string }>;
  courses: Array<{ id: string; updatedAt?: string }>;
}

export function generateSitemap(data?: SitemapData): string {
  const baseUrl = 'https://boatme.co.za';
  const now = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // High priority pages
    {
      loc: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/rent`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/skippers`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    // Search results page
    {
      loc: `${baseUrl}/search`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    }
  ];

  // Add boat listings
  if (data?.boats) {
    data.boats.forEach(boat => {
      urls.push({
        loc: `${baseUrl}/boats/${boat.id}`,
        lastmod: boat.updatedAt ? boat.updatedAt.split('T')[0] : now,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  }

  // Add course listings  
  if (data?.courses) {
    data.courses.forEach(course => {
      urls.push({
        loc: `${baseUrl}/courses/${course.id}`,
        lastmod: course.updatedAt ? course.updatedAt.split('T')[0] : now,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export function generateRobotsTxt(): string {
  const baseUrl = 'https://boatme.co.za';
  
  return `User-agent: *
# Allow public pages
Allow: /
Allow: /rent
Allow: /skippers
Allow: /search
Allow: /boats/
Allow: /courses/

# Disallow private and admin areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /owner/
Disallow: /login
Disallow: /signup
Disallow: /auth/
Disallow: /checkout
Disallow: /confirmation
Disallow: /booking-history
Disallow: /receipt/

# Disallow utility routes
Disallow: /api/
Disallow: /*?*
Disallow: /*.json$

# Allow social media crawlers
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
`;
}

// Mock data for development - replace with actual Supabase queries
export function getMockSitemapData(): SitemapData {
  return {
    boats: [
      { id: '1', updatedAt: '2025-07-20T10:00:00Z' },
      { id: '2', updatedAt: '2025-07-19T15:30:00Z' },
      { id: '3', updatedAt: '2025-07-18T09:15:00Z' }
    ],
    courses: [
      { id: '1', updatedAt: '2025-07-15T12:00:00Z' },
      { id: '2', updatedAt: '2025-07-10T14:20:00Z' }
    ]
  };
}