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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
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

  const getCurrentStatus = () => {
    if (venue?.business_status === 'CLOSED_TEMPORARILY') {
      return { text: 'Temporarily Closed', color: 'text-red-500', icon: 'fas fa-exclamation-triangle' };
    }
    if (venue?.business_status === 'CLOSED_PERMANENTLY') {
      return { text: 'Permanently Closed', color: 'text-red-600', icon: 'fas fa-times-circle' };
    }
    if (venue?.opening_hours?.open_now === true) {
      return { text: 'Open Now', color: 'text-green-500', icon: 'fas fa-clock' };
    }
    if (venue?.opening_hours?.open_now === false) {
      return { text: 'Closed', color: 'text-red-500', icon: 'fas fa-clock' };
    }
    return { text: 'Hours Unknown', color: 'text-muted-foreground', icon: 'fas fa-question-circle' };
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
      {/* Hero Section with Photo Gallery */}
      <div className="relative h-64 md:h-96">
        {venue.photos && venue.photos.length > 0 ? (
          <>
            <img 
              src={getPhotoUrl(venue.photos[selectedPhotoIndex].photo_reference, 1200)}
              alt={`${venue.name} - Photo ${selectedPhotoIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=600&fit=crop";
              }}
            />
            
            {/* Photo Navigation */}
            {venue.photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhotoIndex(prev => 
                    prev > 0 ? prev - 1 : venue.photos!.length - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => setSelectedPhotoIndex(prev => 
                    prev < venue.photos!.length - 1 ? prev + 1 : 0
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {venue.photos.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                  {venue.photos.length > 5 && (
                    <span className="text-white text-xs ml-2">
                      +{venue.photos.length - 5} more
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-image text-muted-foreground text-4xl mb-4"></i>
              <p className="text-muted-foreground">No photos available</p>
            </div>
          </div>
        )}
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
          <div className="flex flex-wrap items-center gap-4 text-white/90 mb-2">
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
            
            {/* Live Status */}
            <div className={`flex items-center space-x-1 ${getCurrentStatus().color}`}>
              <i className={getCurrentStatus().icon}></i>
              <span className="text-sm font-medium">{getCurrentStatus().text}</span>
            </div>
          </div>
          
          {/* Google Photos Attribution */}
          {venue.photos && venue.photos.length > 0 && (
            <div className="text-xs text-white/70">
              Photos by Google • Content may be subject to copyright
            </div>
          )}
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

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {venue.formatted_phone_number && (
                <a
                  href={`tel:${venue.formatted_phone_number}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <i className="fas fa-phone"></i>
                  <span>Call</span>
                </a>
              )}
              
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <i className="fas fa-globe"></i>
                  <span>Website</span>
                </a>
              )}
              
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${venue.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-map-marked-alt"></i>
                <span>Directions</span>
              </a>
            </div>

            {/* Categories */}
            {venue.types && venue.types.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.types
                    .filter(type => !['establishment', 'point_of_interest'].includes(type))
                    .slice(0, 8)
                    .map((type, index) => (
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
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Customer Reviews ({venue.user_ratings_total?.toLocaleString() || venue.reviews.length})
                </h3>
                
                {/* Overall Rating Summary */}
                {venue.rating && (
                  <div className="bg-card p-4 rounded-lg border mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">{venue.rating}</div>
                        <div className="flex justify-center space-x-1 mt-1">
                          {renderStars(venue.rating)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {venue.user_ratings_total ? `${venue.user_ratings_total.toLocaleString()} reviews` : 'Overall rating'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Individual Reviews */}
                <div className="space-y-4">
                  {venue.reviews.map((review, index) => (
                    <div key={index} className="bg-card p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {review.profile_photo_url ? (
                            <img
                              src={review.profile_photo_url}
                              alt={review.author_name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.author_name);
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">
                                {review.author_name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">{review.author_name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex space-x-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.time * 1000).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
                      )}
                      {review.author_url && (
                        <a
                          href={review.author_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-2 inline-block"
                        >
                          View on Google
                        </a>
                      )}
                    </div>
                  ))}
                  
                  {venue.reviews.length >= 5 && (
                    <div className="text-center pt-4">
                      <a
                        href={`https://www.google.com/maps/place/?q=place_id:${venue.place_id}&reviews`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        View all reviews on Google
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            {venue.opening_hours && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">Opening Hours</h3>
                  <div className={`flex items-center space-x-1 ${getCurrentStatus().color}`}>
                    <i className={getCurrentStatus().icon}></i>
                    <span className="text-sm font-medium">{getCurrentStatus().text}</span>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  {venue.opening_hours.weekday_text ? (
                    <div className="space-y-2">
                      {venue.opening_hours.weekday_text.map((day: string, index: number) => {
                        const [dayName, hours] = day.split(': ');
                        const today = new Date().getDay();
                        const adjustedIndex = index === 6 ? 0 : index + 1; // Google uses Sunday=0, Monday=1...
                        const isToday = adjustedIndex === today;
                        
                        return (
                          <div key={index} className={`flex justify-between text-sm ${
                            isToday ? 'font-medium text-foreground bg-primary/5 p-2 rounded' : ''
                          }`}>
                            <span className={isToday ? 'text-foreground' : 'text-muted-foreground'}>
                              {isToday ? `Today (${dayName})` : dayName}
                            </span>
                            <span className={isToday ? 'text-foreground' : 'text-muted-foreground'}>
                              {hours || 'Closed'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className={`flex items-center justify-center space-x-2 ${getCurrentStatus().color}`}>
                        <i className={getCurrentStatus().icon}></i>
                        <span className="text-sm font-medium">{getCurrentStatus().text}</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-2">
                        Detailed hours not available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photo Gallery Thumbnails */}
            {venue.photos && venue.photos.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  All Photos ({venue.photos.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {venue.photos.slice(0, 6).map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative group ${
                        index === selectedPhotoIndex ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={getPhotoUrl(photo.photo_reference, 300)}
                        alt={`${venue.name} photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop";
                        }}
                      />
                      {index === 5 && venue.photos.length > 6 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium rounded-lg">
                          +{venue.photos.length - 6} more
                        </div>
                      )}
                      {/* Google Attribution */}
                      <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        G
                      </div>
                    </button>
                  ))}
                </div>
                
                {venue.photos.length > 6 && (
                  <button 
                    onClick={() => {/* Could implement full gallery modal */}}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    View all {venue.photos.length} photos
                  </button>
                )}
              </div>
            )}

            {/* Additional Details */}
            {(venue.plus_code || venue.international_phone_number) && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Additional Information</h3>
                <div className="space-y-2 text-sm">
                  {venue.plus_code && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-map-pin text-primary w-4"></i>
                      <span className="text-muted-foreground">Plus Code:</span>
                      <span className="font-mono">{venue.plus_code.global_code}</span>
                    </div>
                  )}
                  {venue.international_phone_number && venue.international_phone_number !== venue.formatted_phone_number && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-phone text-primary w-4"></i>
                      <span className="text-muted-foreground">International:</span>
                      <span>{venue.international_phone_number}</span>
                    </div>
                  )}
                  {venue.business_status && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-info-circle text-primary w-4"></i>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{venue.business_status.replace(/_/g, ' ').toLowerCase()}</span>
                    </div>
                  )}
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