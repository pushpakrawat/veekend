import { useEffect } from "react";
import Header from "@/components/header";
import LocationSearch from "@/components/location-search";
import FilterPanel from "@/components/filter-panel";
import VenueGrid from "@/components/venue-grid";
import LoadingOverlay from "@/components/loading-overlay";
import Footer from "@/components/footer";
import { useVenueStore } from "@/store/venue-store";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { searchLocation, venues, isLoading, error, pagination, clearError } = useVenueStore();
  const { initializeAuth } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <LocationSearch />
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel />
        </div>

        {/* Results Header */}
        {searchLocation && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Nearby Venues</h2>
              <p className="text-muted-foreground mt-1">
                Found {pagination.totalResults} venues in {searchLocation.address}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <select className="bg-card border border-border rounded px-3 py-1 text-foreground focus:ring-2 focus:ring-primary">
                <option>Distance</option>
                <option>Rating</option>
                <option>Price</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>
        )}

        {/* Venue Grid */}
        <VenueGrid />

        {/* Empty State */}
        {!searchLocation && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-map-marker-alt text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Your Venue Discovery
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a location or share your current location to discover amazing venues near you.
            </p>
          </div>
        )}
      </main>

      {/* Modals and Overlays */}
      <LoadingOverlay />
      
      <Footer />
    </div>
  );
}
