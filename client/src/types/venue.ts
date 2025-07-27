export interface GooglePlacePhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface GooglePlaceReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceOpeningHours {
  open_now: boolean;
  periods?: {
    close?: { day: number; time: string };
    open: { day: number; time: string };
  }[];
  weekday_text?: string[];
}

export interface GooglePlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: GooglePlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  photos?: GooglePlacePhoto[];
  opening_hours?: GooglePlaceOpeningHours;
  business_status?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  reviews?: GooglePlaceReview[];
  vicinity?: string;
  distance?: number; // Distance in km from user location
}

export interface VenueFilters {
  category: string;
  distance: number; // in kilometers
  minRating: number;
  priceLevel: number[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface SearchLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VenueSearchResult {
  venues: GooglePlace[];
  pagination: PaginationInfo;
  nextPageToken?: string;
}
