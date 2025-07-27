import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVenueStore } from "@/store/venue-store";
import { useAuthStore } from "@/store/auth-store";
import { googlePlacesService } from "@/lib/google-places";
import { useToast } from "@/hooks/use-toast";

export default function VenueDetailModal() {
  const { currentVenue, setCurrentVenue } = useVenueStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleClose = () => {
    setCurrentVenue(null);
  };

  const handleWishlistAdd = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save venues to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to Wishlist",
      description: `${currentVenue?.name} has been added to your wishlist.`,
    });
  };

  if (!currentVenue) return null;

  const venue = currentVenue;
  const mainPhoto = venue.photos?.[0];
  const photoUrl = mainPhoto 
    ? googlePlacesService.getPhotoUrl(mainPhoto.photo_reference, 800)
    : "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop";

  return (
    <Dialog open={!!currentVenue} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={photoUrl}
              alt={venue.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                    {venue.name}
                  </DialogTitle>
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
                <Button onClick={handleWishlistAdd} className="bg-primary hover:bg-primary/90">
                  <i className="far fa-heart mr-2"></i>
                  Save
                </Button>
              </div>
            </DialogHeader>

            {/* Contact & Location Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Contact & Location</h3>
                <div className="space-y-2 text-muted-foreground">
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
                  {venue.distance && (
                    <div className="flex items-center">
                      <i className="fas fa-route w-5 text-muted-foreground mr-3"></i>
                      <span>{venue.distance} km from your location</span>
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

                {venue.reviews.length > 3 && (
                  <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
                    View All Reviews <i className="fas fa-arrow-right ml-1"></i>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
