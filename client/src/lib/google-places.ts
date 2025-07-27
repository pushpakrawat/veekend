import { GooglePlace, VenueFilters, SearchLocation, VenueSearchResult } from "@/types/venue";

import { env } from "./env";

const GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;

// Category mapping for Google Places types
const CATEGORY_MAPPING: Record<string, string[]> = {
  dining: ["restaurant", "food", "meal_takeaway", "cafe", "bakery", "bar"],
  entertainment: ["movie_theater", "amusement_park", "night_club", "casino", "bowling_alley"],
  sports: ["gym", "spa", "stadium", "golf_course"],
  adventure: ["tourist_attraction", "park", "zoo", "aquarium", "museum"],
  relaxation: ["spa", "beauty_salon", "park"],
  devotion: ["church", "hindu_temple", "mosque", "synagogue", "place_of_worship"],
  amusement: ["amusement_park", "arcade", "bowling_alley"],
  games: ["bowling_alley", "arcade", "casino"]
};

export class GooglePlacesService {
  private service: google.maps.places.PlacesService | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private geocoder: google.maps.Geocoder | null = null;

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    if (typeof google === 'undefined') {
      await this.loadGoogleMapsScript();
    }
    
    // Create a dummy div for PlacesService (required by Google Maps API)
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv);
    
    this.service = new google.maps.places.PlacesService(map);
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps script'));
      
      document.head.appendChild(script);
    });
  }

  async searchPlaces(
    location: SearchLocation,
    filters: VenueFilters,
    pageToken?: string
  ): Promise<VenueSearchResult> {
    await this.initializeServices();
    
    if (!this.service) {
      throw new Error('Google Places service not initialized');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: filters.distance * 1000, // Convert km to meters
        type: this.getCategoryType(filters.category),
        ...(pageToken && { pageToken })
      };

      this.service!.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          let filteredResults = results;

          // Apply additional filters
          if (filters.minRating > 0) {
            filteredResults = filteredResults.filter(place => 
              (place.rating || 0) >= filters.minRating
            );
          }

          if (filters.priceLevel.length > 0) {
            filteredResults = filteredResults.filter(place => 
              place.price_level !== undefined && 
              filters.priceLevel.includes(place.price_level)
            );
          }

          // Calculate distances
          const venuesWithDistance = filteredResults.map(place => ({
            ...place,
            distance: this.calculateDistance(
              location.lat,
              location.lng,
              place.geometry!.location.lat(),
              place.geometry!.location.lng()
            )
          }));

          const totalResults = venuesWithDistance.length;
          const resultsPerPage = 20;
          const currentPage = 1; // Simplified for this implementation
          
          resolve({
            venues: venuesWithDistance.slice(0, resultsPerPage) as GooglePlace[],
            pagination: {
              currentPage,
              totalPages: Math.ceil(totalResults / resultsPerPage),
              totalResults,
              resultsPerPage,
              hasNextPage: !!pagination?.hasNextPage,
              hasPreviousPage: false
            },
            nextPageToken: pagination?.hasNextPage ? 'next' : undefined
          });
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlace> {
    await this.initializeServices();
    
    if (!this.service) {
      throw new Error('Google Places service not initialized');
    }

    return new Promise((resolve, reject) => {
      const request = {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'price_level',
          'types',
          'photos',
          'opening_hours',
          'business_status',
          'formatted_phone_number',
          'international_phone_number',
          'website',
          'reviews'
        ]
      };

      this.service!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place as GooglePlace);
        } else {
          reject(new Error(`Place details request failed: ${status}`));
        }
      });
    });
  }

  async getLocationSuggestions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.initializeServices();
    
    if (!this.autocompleteService) {
      throw new Error('Autocomplete service not initialized');
    }

    return new Promise((resolve, reject) => {
      this.autocompleteService!.getPlacePredictions(
        {
          input,
          types: ['(cities)'],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  async geocodeAddress(address: string): Promise<SearchLocation> {
    await this.initializeServices();
    
    if (!this.geocoder) {
      throw new Error('Geocoder service not initialized');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  getCurrentLocation(): Promise<SearchLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            const address = data.results?.[0]?.formatted_address || 'Current Location';
            
            resolve({
              lat: latitude,
              lng: longitude,
              address
            });
          } catch (error) {
            resolve({
              lat: latitude,
              lng: longitude,
              address: 'Current Location'
            });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  private getCategoryType(category: string): string {
    const types = CATEGORY_MAPPING[category];
    return types ? types[0] : 'establishment';
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
  }
}

export const googlePlacesService = new GooglePlacesService();
