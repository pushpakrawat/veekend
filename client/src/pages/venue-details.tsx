import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useVenueStore } from "@/store/venue-store";
import { useAuthStore } from "@/store/auth-store";
import { googlePlacesService } from "@/lib/google-places";
import { useToast } from "@/hooks/use-toast";
import { GooglePlace } from "@/types/venue";
import LoadingOverlay from "@/components/loading-overlay";
import Footer from "@/components/footer";

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [venue, setVenue] = useState<GooglePlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { currentVenue } = useVenueStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const loadVenueDetails = async () => {
      if (!id) {
        setLocation("/");
        return;
      }

      setIsLoading(true);
      try {
        // Check if we already have venue data in store
        if (currentVenue && currentVenue.place_id === id) {
          setVenue(currentVenue);
        } else {
          // Fetch detailed venue data
          const venueDetails = await googlePlacesService.getPlaceDetails(id);
          setVenue(venueDetails);
        }
      } catch (error) {
        console.error("Failed to load venue details:", error);
        toast({
          title: "Error",
          description: "Failed to load venue details. Please try again.",
          variant: "destructive",
        });
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadVenueDetails();
  }, [id, currentVenue, setLocation, toast]);

  const handleBack = () => {
    setLocation("/");
  };

  const handleWishlistToggle = () => {
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
      description: `${venue?.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const getPhotoUrl = (photoReference: string, maxWidth: number = 800) => {
    return googlePlacesService.getPhotoUrl(photoReference, maxWidth);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Venue Not Found</h2>
          <Button onClick={handleBack}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const mainPhoto = venue.photos?.[0];
  const photoUrl = mainPhoto 
    ? getPhotoUrl(mainPhoto.photo_reference, 1200)
    : "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=600&fit=crop";

  const formatHours = (hours: any) => {
    if (!hours?.weekday_text) return null;
    return hours.weekday_text.map((day: string, index: number) => (
      <div key={index} className="text-sm text-muted-foreground">
        {day}
      </div>
    ));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }

    return stars;
  };

  const getPriceLevelText = (level: number) => {
    const levels = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    return levels[level] || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96">
        <img 
          src={photoUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=600&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4 z-10"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </Button>

        {/* Wishlist Button */}
        <Button
          onClick={handleWishlistToggle}
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-10"
        >
          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart mr-2 ${isWishlisted ? 'text-red-500' : ''}`}></i>
          {isWishlisted ? 'Saved' : 'Save'}
        </Button>

        {/* Venue Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {venue.name}
          </h1>
          <div className="flex items-center space-x-4 text-white/90">
            {venue.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {renderStars(venue.rating)}
                </div>
                <span className="ml-2 font-medium">{venue.rating}</span>
                {venue.user_ratings_total && (
                  <span className="text-sm">({venue.user_ratings_total.toLocaleString()} reviews)</span>
                )}
              </div>
            )}
            
            {venue.price_level !== undefined && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getPriceLevelText(venue.price_level)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address & Contact */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Location & Contact</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                  <span className="text-muted-foreground">{venue.formatted_address}</span>
                </div>
                
                {venue.formatted_phone_number && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-phone text-primary"></i>
                    <a 
                      href={`tel:${venue.formatted_phone_number}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {venue.formatted_phone_number}
                    </a>
                  </div>
                )}
                
                {venue.website && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-globe text-primary"></i>
                    <a 
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Categories */}
            {venue.types && venue.types.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.types.slice(0, 8).map((type, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {type.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Recent Reviews</h3>
                <div className="space-y-4">
                  {venue.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="bg-card p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{review.author_name}</span>
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.time * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            {venue.opening_hours && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Opening Hours</h3>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="space-y-1">
                    {formatHours(venue.opening_hours)}
                  </div>
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {venue.photos && venue.photos.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {venue.photos.slice(1, 5).map((photo, index) => (
                    <img
                      key={index}
                      src={getPhotoUrl(photo.photo_reference, 400)}
                      alt={`${venue.name} photo ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop";
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Attribution */}
      {mainPhoto && (
        <div className="container mx-auto px-4 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            Photos by Google Places API. Content may be subject to copyright.
          </p>
        </div>
      )}
      
      <Footer />
    </div>
  );
}