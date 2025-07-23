import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getBlogPostBySlug, getRelatedPosts, getCategoryInfo } from '@/lib/blogData';
import { BlogSEO } from '@/utils/blogSeoUtils';
import { Clock, User, Calendar, ArrowLeft, Share2 } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }
  
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  const relatedPosts = getRelatedPosts(post, 3);
  const categoryInfo = getCategoryInfo(post.category);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Helmet>
        <BlogSEO post={post} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="container mx-auto px-4 mb-8">
          <div className="relative h-[400px] overflow-hidden rounded-2xl">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-3">
              {/* Article Header */}
              <header className="mb-8">
                <Badge className="mb-4" variant="secondary">
                  {categoryInfo?.name}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      {post.author.bio && (
                        <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator orientation="vertical" className="h-8" />
                  
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleShare} className="ml-auto">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <Separator />
              </header>
              
              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
              </div>
              
              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Call to Action */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to Start Your Boating Adventure?</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore our range of boat rentals and start planning your perfect day on the water.
                  </p>
                  <Button asChild size="lg">
                    <Link to="/rent">
                      Browse Boat Rentals
                    </Link>
                  </Button>
                </div>
              </footer>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <BlogSidebar currentPost={post} />
            </aside>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPost;