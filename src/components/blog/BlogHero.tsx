import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryInfo } from '@/lib/blogData';

interface BlogHeroProps {
  post: BlogPost;
}

export function BlogHero({ post }: BlogHeroProps) {
  const categoryInfo = getCategoryInfo(post.category);
  
  return (
    <div className="relative h-[500px] overflow-hidden rounded-2xl">
      <img 
        src={post.featuredImage} 
        alt={post.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-4xl">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
            {categoryInfo?.name}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-white/90 mb-6 max-w-2xl">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-6 mb-6 text-white/80">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          
          <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90">
            <Link to={`/blog/${post.slug}`}>
              Read Full Article
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}