import { create } from 'zustand';
import { GooglePlace, VenueFilters, SearchLocation, VenueSearchResult } from '@/types/venue';
import { googlePlacesService } from '@/lib/google-places';

interface VenueStore {
  venues: GooglePlace[];
  currentVenue: GooglePlace | null;
  searchLocation: SearchLocation | null;
  filters: VenueFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    resultsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  nextPageToken?: string;

  // Actions
  setSearchLocation: (location: SearchLocation) => void;
  updateFilters: (newFilters: Partial<VenueFilters>) => void;
  searchVenues: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  setCurrentVenue: (venue: GooglePlace | null) => void;
  getVenueDetails: (placeId: string) => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

const defaultFilters: VenueFilters = {
  category: 'dining',
  distance: 5,
  minRating: 0,
  priceLevel: [1, 2, 3, 4],
};

export const useVenueStore = create<VenueStore>((set, get) => ({
  venues: [],
  currentVenue: null,
  searchLocation: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    resultsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  nextPageToken: undefined,

  setSearchLocation: (location) => {
    set({ 
      searchLocation: location,
      filters: { ...get().filters, location: { lat: location.lat, lng: location.lng } }
    });
  },

  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  searchVenues: async () => {
    const { searchLocation, filters } = get();
    
    if (!searchLocation) {
      set({ error: 'Please select a location first' });
      return;
    }

    set({ isLoading: true, error: null, venues: [] });

    try {
      const result: VenueSearchResult = await googlePlacesService.searchPlaces(
        searchLocation,
        filters
      );

      set({
        venues: result.venues,
        pagination: result.pagination,
        nextPageToken: result.nextPageToken,
        isLoading: false,
      });
    } catch (error) {
      console.error('Search venues error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to search venues',
        isLoading: false,
      });
    }
  },

  loadNextPage: async () => {
    const { searchLocation, filters, nextPageToken, venues } = get();
    
    if (!searchLocation || !nextPageToken) return;

    set({ isLoading: true, error: null });

    try {
      const result: VenueSearchResult = await googlePlacesService.searchPlaces(
        searchLocation,
        filters,
        nextPageToken
      );

      set({
        venues: [...venues, ...result.venues],
        pagination: result.pagination,
        nextPageToken: result.nextPageToken,
        isLoading: false,
      });
    } catch (error) {
      console.error('Load next page error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load more venues',
        isLoading: false,
      });
    }
  },

  setCurrentVenue: (venue) => {
    set({ currentVenue: venue });
  },

  getVenueDetails: async (placeId) => {
    set({ isLoading: true, error: null });

    try {
      const venue = await googlePlacesService.getPlaceDetails(placeId);
      set({ currentVenue: venue, isLoading: false });
    } catch (error) {
      console.error('Get venue details error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to get venue details',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },
}));
