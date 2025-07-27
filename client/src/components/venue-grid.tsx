import { useEffect } from "react";
import VenueCard from "@/components/venue-card";
import { Button } from "@/components/ui/button";
import { useVenueStore } from "@/store/venue-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function VenueGrid() {
  const { venues, isLoading, pagination, loadNextPage, searchLocation } = useVenueStore();

  // Loading skeleton
  if (isLoading && venues.length === 0) {
    return (
      <div className="venue-grid">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="venue-card">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex space-x-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results state
  if (!isLoading && venues.length === 0 && searchLocation) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-search text-2xl text-muted-foreground"></i>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Venues Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No venues match your current filters. Try adjusting your search criteria or expanding your search radius.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Venue Grid */}
      <div className="venue-grid mb-8">
        {venues.map((venue) => (
          <VenueCard key={venue.place_id} venue={venue} />
        ))}
      </div>

      {/* Load More Button */}
      {pagination.hasNextPage && (
        <div className="text-center">
          <Button 
            onClick={loadNextPage} 
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading More...
              </>
            ) : (
              <>
                Load More Venues
                <i className="fas fa-chevron-down ml-2"></i>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {venues.length > 0 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{venues.length}</span> of{" "}
            <span className="font-medium text-foreground">{pagination.totalResults}</span> venues
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{pagination.currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{pagination.totalPages}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
