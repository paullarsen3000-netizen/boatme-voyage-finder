import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UniversalSearchBar } from '@/components/search/UniversalSearchBar';
import { LocationFilters } from '@/components/search/LocationFilters';
import { SearchResultsView } from '@/components/search/SearchResultsView';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { toast } from 'sonner';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    results,
    filters,
    isLoading,
    search,
    updateFilters,
    clearFilters,
    clearLocation,
    totalResults,
  } = useLocationSearch();

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (query) {
      const location = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined;
      search(query, location);
    }
  }, [searchParams, search]);

  const handleSearch = (query: string, location?: { lat: number; lng: number }) => {
    const newParams = new URLSearchParams();
    newParams.set('q', query);
    if (location) {
      newParams.set('lat', location.lat.toString());
      newParams.set('lng', location.lng.toString());
    }
    setSearchParams(newParams);
    search(query, location);
  };

  const handleResultClick = (result: any) => {
    toast.success(`Selected ${result.name}`);
    // Would navigate to detail page in real app
  };

  const activeLocation = filters.query || (filters.centerPoint ? 'Current Location' : undefined);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          <UniversalSearchBar
            placeholder="Search boats, courses, or locations..."
            onSearch={handleSearch}
            className="max-w-2xl"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <LocationFilters
              radius={filters.radius}
              onRadiusChange={(radius) => updateFilters({ radius })}
              province={filters.province}
              onProvinceChange={(province) => updateFilters({ province })}
              listingType={filters.listingType}
              onListingTypeChange={(listingType) => updateFilters({ listingType })}
              waterBody={filters.waterBody}
              onWaterBodyChange={(waterBody) => updateFilters({ waterBody })}
              activeLocation={activeLocation}
              onClearLocation={clearLocation}
              onClearAll={clearFilters}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <SearchResultsView
              results={results}
              totalResults={totalResults}
              isLoading={isLoading}
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;