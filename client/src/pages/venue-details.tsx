import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import LoadingOverlay from "@/components/loading-overlay";
import { useVenueStore } from "@/store/venue-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { googlePlacesService } from "@/lib/google-places";

export default function VenueDetails() {
  const { venueId } = useParams<{ venueId: string }>();
  const [, setLocation] = useLocation();
  const { currentVenue, isLoading, getVenueDetails } = useVenueStore();

  useEffect(() => {
    if (venueId) {
      getVenueDetails(venueId);
    }
  }, [venueId, getVenueDetails]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!currentVenue) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Venue Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The venue you're looking for could not be found.
              </p>
              <Button onClick={() => setLocation("/")}>
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const venue = currentVenue;
  const mainPhoto = venue.photos?.[0];
  const photoUrl = mainPhoto 
    ? googlePlacesService.getPhotoUrl(mainPhoto.photo_reference, 800)
    : "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Search
        </Button>

        <div className="bg-card rounded-xl overflow-hidden border border-border">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={photoUrl}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm">
                <i className="far fa-heart mr-2"></i>
                Save
              </Button>
            </div>
          </div>

          {/* Venue Details */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{venue.name}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  {venue.rating && (
                    <div className="flex items-center text-yellow-400">
                      <i className="fas fa-star mr-1"></i>
                      <span>{venue.rating}</span>
                      {venue.user_ratings_total && (
                        <span className="text-muted-foreground ml-1">
                          ({venue.user_ratings_total} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  {venue.price_level && (
                    <div className="text-muted-foreground">
                      {'$'.repeat(venue.price_level)} • {venue.types[0]?.replace(/_/g, ' ')}
                    </div>
                  )}
                  {venue.opening_hours?.open_now && (
                    <div className="text-green-400 font-medium">Open Now</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Location Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Contact & Location</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt w-5 text-muted-foreground mt-0.5 mr-3"></i>
                    <span>{venue.formatted_address}</span>
                  </div>
                  {venue.formatted_phone_number && (
                    <div className="flex items-center">
                      <i className="fas fa-phone w-5 text-muted-foreground mr-3"></i>
                      <span>{venue.formatted_phone_number}</span>
                    </div>
                  )}
                  {venue.website && (
                    <div className="flex items-center">
                      <i className="fas fa-globe w-5 text-muted-foreground mr-3"></i>
                      <a 
                        href={venue.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {venue.opening_hours?.weekday_text && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Opening Hours</h3>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    {venue.opening_hours.weekday_text.map((day, index) => {
                      const [dayName, hours] = day.split(': ');
                      const isToday = new Date().getDay() === (index + 1) % 7;
                      
                      return (
                        <div 
                          key={index}
                          className={`flex justify-between ${isToday ? 'font-medium text-foreground' : ''}`}
                        >
                          <span>{dayName}</span>
                          <span>{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            {venue.reviews && venue.reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  {venue.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="bg-muted/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {review.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.author_name}</p>
                            <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i 
                              key={i}
                              className={`fas fa-star text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
