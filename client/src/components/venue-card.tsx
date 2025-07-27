import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GooglePlace } from "@/types/venue";
import { googlePlacesService } from "@/lib/google-places";
import { useVenueStore } from "@/store/venue-store";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

interface VenueCardProps {
  venue: GooglePlace;
  viewMode?: 'grid' | 'list';
}

export default function VenueCard({ venue, viewMode = 'grid' }: VenueCardProps) {
  const [, setLocation] = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { setCurrentVenue } = useVenueStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const mainPhoto = venue.photos?.[0];
  const photoUrl = mainPhoto 
    ? googlePlacesService.getPhotoUrl(mainPhoto.photo_reference, 400)
    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop";

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    setCurrentVenue(venue);
    setLocation(`/venue/${venue.place_id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save venues to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${venue.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const getPriceLevelDisplay = (priceLevel?: number) => {
    if (!priceLevel) return '';
    return '$'.repeat(priceLevel);
  };

  const getStatusDisplay = () => {
    if (venue.business_status === 'CLOSED_TEMPORARILY') {
      return <span className="text-red-400 text-sm font-medium">Temporarily Closed</span>;
    }
    
    if (venue.opening_hours?.open_now) {
      return <span className="text-green-400 text-sm font-medium">Open Now</span>;
    }
    
    return <span className="text-muted-foreground text-sm">Closed</span>;
  };

  const formatCategory = (types: string[]) => {
    const primaryType = types.find(type => 
      !['establishment', 'point_of_interest'].includes(type)
    ) || types[0];
    
    return primaryType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Venue';
  };

  return (
    <div 
      className="venue-card animate-slide-up"
      onClick={handleCardClick}
    >
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="w-full h-48 bg-muted animate-pulse flex items-center justify-center">
            <i className="fas fa-image text-muted-foreground text-2xl"></i>
          </div>
        )}
        
        <img 
          src={photoUrl}
          alt={venue.name}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${imageError ? 'hidden' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {imageError && (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-image text-muted-foreground text-2xl mb-2"></i>
              <p className="text-sm text-muted-foreground">No image available</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-white hover:text-red-400 bg-black/20 hover:bg-black/40"
          onClick={handleWishlistToggle}
        >
          <i className={isWishlisted ? "fas fa-heart text-red-400" : "far fa-heart"}></i>
        </Button>
        
        {/* Google Attribution for photos */}
        {mainPhoto && imageLoaded && !imageError && (
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
            Google
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg line-clamp-1">
            {venue.name}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
          {venue.vicinity || venue.formatted_address}
        </p>

        <div className="flex items-center space-x-4 text-sm mb-3">
          {venue.rating && (
            <div className="flex items-center text-yellow-400">
              <i className="fas fa-star text-xs mr-1"></i>
              <span>{venue.rating}</span>
              {venue.user_ratings_total && (
                <span className="text-muted-foreground ml-1">
                  ({venue.user_ratings_total})
                </span>
              )}
            </div>
          )}
          
          {venue.distance && (
            <div className="text-muted-foreground">
              {venue.distance} km
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {venue.price_level && (
              <>
                <span className="text-muted-foreground text-sm">
                  {getPriceLevelDisplay(venue.price_level)}
                </span>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <span className="text-muted-foreground text-sm">
              {formatCategory(venue.types)}
            </span>
          </div>
          
          {getStatusDisplay()}
        </div>
      </div>
    </div>
  );
}
