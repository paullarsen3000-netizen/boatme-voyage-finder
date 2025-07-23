import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { getBlogPosts, blogCategories } from '@/lib/blogData';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, BookOpen } from 'lucide-react';

interface BlogSidebarProps {
  currentPost?: BlogPost;
}

export function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const recentPosts = getBlogPosts(4).filter(post => post.id !== currentPost?.id);
  
  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts.map(post => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex gap-3">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} min</span>
                    <span>•</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {blogCategories.map(category => (
              <Badge 
                key={category.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Ready to Get on the Water?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Browse our fleet of boats and start your next adventure.
          </p>
          <Button asChild className="w-full">
            <Link to="/rent">
              View Boat Rentals
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get the latest boating tips and destination guides delivered to your inbox.
          </p>
          <div className="space-y-2">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="w-full">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}