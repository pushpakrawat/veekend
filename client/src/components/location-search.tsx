import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVenueStore } from "@/store/venue-store";
import { googlePlacesService } from "@/lib/google-places";
import { SearchLocation } from "@/types/venue";
import { useToast } from "@/hooks/use-toast";

export default function LocationSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { setSearchLocation, searchVenues } = useVenueStore();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const predictions = await googlePlacesService.getLocationSuggestions(query);
          setSuggestions(predictions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error getting suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = async (prediction: google.maps.places.AutocompletePrediction) => {
    setQuery(prediction.description);
    setShowSuggestions(false);
    
    try {
      const location = await googlePlacesService.geocodeAddress(prediction.description);
      setSearchLocation(location);
      await searchVenues();
    } catch (error) {
      console.error("Error geocoding address:", error);
      toast({
        title: "Error",
        description: "Failed to find location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      const location: SearchLocation = await googlePlacesService.getCurrentLocation();
      setSearchLocation(location);
      setQuery(location.address);
      await searchVenues();
      
      toast({
        title: "Location Found",
        description: "Using your current location for search.",
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      toast({
        title: "Location Error",
        description: "Failed to get your location. Please enter a location manually.",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-search text-muted-foreground"></i>
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by city, state, country..."
          className="w-full pl-10 pr-12 py-3 bg-card border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 pr-3 text-muted-foreground hover:text-primary"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-location-arrow"></i>
          )}
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors border-b border-border last:border-b-0"
              onClick={() => handleSelectSuggestion(prediction)}
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-muted-foreground"></i>
                <div>
                  <div className="font-medium text-foreground">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
