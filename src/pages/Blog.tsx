import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBlogPosts, getFeaturedPosts, getBlogPostsByCategory, blogCategories } from '@/lib/blogData';
import { BlogCategory } from '@/types/blog';
import { BlogIndexSEO } from '@/utils/blogSeoUtils';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [showCount, setShowCount] = useState(6);
  
  const featuredPosts = getFeaturedPosts();
  const allPosts = getBlogPosts();
  
  const filteredPosts = selectedCategory === 'all' 
    ? allPosts 
    : getBlogPostsByCategory(selectedCategory);
    
  const displayedPosts = filteredPosts.slice(0, showCount);
  const hasMore = filteredPosts.length > showCount;

  return (
    <>
      <Helmet>
        <BlogIndexSEO posts={allPosts} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <BlogHero post={featuredPosts[0]} />
          </section>
        )}

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">BoatMe Blog</h1>
                  <p className="text-muted-foreground">
                    Expert boating tips, skipper guides, and destination insights
                  </p>
                </div>
                
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    setSelectedCategory(value as BlogCategory | 'all');
                    setShowCount(6); // Reset show count when filtering
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {blogCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Posts Grid */}
              {featuredPosts.length > 1 && selectedCategory === 'all' && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPosts.slice(1, 3).map(post => (
                      <BlogCard key={post.id} post={post} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts Grid */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {selectedCategory === 'all' ? 'Latest Articles' : `${blogCategories.find(c => c.id === selectedCategory)?.name} Articles`}
                </h2>
                
                {displayedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No articles found in this category.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {displayedPosts.map(post => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                    
                    {hasMore && (
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCount(prev => prev + 6)}
                          size="lg"
                        >
                          Load More Articles
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;