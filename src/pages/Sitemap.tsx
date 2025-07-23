import { useEffect, useState } from 'react';
import { generateSitemap, getMockSitemapData } from '@/lib/sitemapGenerator';

const Sitemap = () => {
  const [xmlContent, setXmlContent] = useState<string>('');

  useEffect(() => {
    // Generate sitemap XML
    const sitemapData = getMockSitemapData();
    const xml = generateSitemap(sitemapData);
    setXmlContent(xml);
    
    // Set response headers for XML content type
    const meta = document.createElement('meta');
    meta.httpEquiv = 'content-type';
    meta.content = 'application/xml; charset=utf-8';
    document.head.appendChild(meta);
  }, []);

  return (
    <pre style={{
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '20px',
      whiteSpace: 'pre-wrap',
      overflow: 'auto'
    }}>
      {xmlContent}
    </pre>
  );
};

export default Sitemap;