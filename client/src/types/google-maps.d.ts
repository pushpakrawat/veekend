declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: any);
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    class Geocoder {
      geocode(request: any, callback: (results: any[], status: any) => void): void;
    }
    
    enum GeocoderStatus {
      OK = 'OK'
    }
    
    namespace places {
      class PlacesService {
        constructor(map: Map);
        nearbySearch(request: PlaceSearchRequest, callback: (results: any[], status: any, pagination?: any) => void): void;
        getDetails(request: any, callback: (place: any, status: any) => void): void;
      }
      
      class AutocompleteService {
        getPlacePredictions(request: any, callback: (predictions: AutocompletePrediction[], status: any) => void): void;
      }
      
      interface PlaceSearchRequest {
        location: LatLng;
        radius: number;
        type?: string;
        pageToken?: string;
      }
      
      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }
      
      enum PlacesServiceStatus {
        OK = 'OK'
      }
    }
  }
}