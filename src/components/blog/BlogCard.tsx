import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryInfo } from '@/lib/blogData';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryInfo = getCategoryInfo(post.category);
  
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        featured ? 'h-full' : 'h-full'
      }`}>
        <div className="relative overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-gray-900 hover:bg-white"
            >
              {categoryInfo?.name}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className={`font-semibold line-clamp-2 group-hover:text-primary transition-colors ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className={`text-muted-foreground mb-4 ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}>
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}