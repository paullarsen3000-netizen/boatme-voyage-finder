import { useEffect, useState } from 'react';
import { generateRobotsTxt } from '@/lib/sitemapGenerator';

const RobotsTxt = () => {
  const [txtContent, setTxtContent] = useState<string>('');

  useEffect(() => {
    const robotsTxt = generateRobotsTxt();
    setTxtContent(robotsTxt);
    
    // Set response headers for plain text content type
    const meta = document.createElement('meta');
    meta.httpEquiv = 'content-type';
    meta.content = 'text/plain; charset=utf-8';
    document.head.appendChild(meta);
  }, []);

  return (
    <pre style={{
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '20px',
      whiteSpace: 'pre-wrap',
      overflow: 'auto'
    }}>
      {txtContent}
    </pre>
  );
};

export default RobotsTxt;