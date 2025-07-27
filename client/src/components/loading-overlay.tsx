import { useVenueStore } from "@/store/venue-store";

export default function LoadingOverlay() {
  const { isLoading, venues } = useVenueStore();

  if (!isLoading || venues.length > 0) return null;

  return (
    <div className="fixed inset-0 bg-background/90 z-40 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground font-medium">Finding amazing venues near you...</p>
        <p className="text-muted-foreground text-sm mt-2">Getting real-time data from Google Places</p>
      </div>
    </div>
  );
}
