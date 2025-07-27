import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useVenueStore } from "@/store/venue-store";

const CATEGORIES = [
  { id: 'dining', label: 'Dining', icon: 'fas fa-utensils' },
  { id: 'entertainment', label: 'Entertainment', icon: 'fas fa-film' },
  { id: 'sports', label: 'Sports', icon: 'fas fa-dumbbell' },
  { id: 'adventure', label: 'Adventure', icon: 'fas fa-mountain' },
  { id: 'relaxation', label: 'Relaxation', icon: 'fas fa-spa' },
  { id: 'devotion', label: 'Devotion', icon: 'fas fa-pray' },
];

const PRICE_LEVELS = [
  { level: 1, label: '$', description: 'Inexpensive' },
  { level: 2, label: '$$', description: 'Moderate' },
  { level: 3, label: '$$$', description: 'Expensive' },
  { level: 4, label: '$$$$', description: 'Very Expensive' },
];

export default function FilterPanel() {
  const { filters, updateFilters, searchVenues, resetFilters, searchLocation } = useVenueStore();

  const handleCategoryChange = (category: string) => {
    updateFilters({ category });
    if (searchLocation) searchVenues();
  };

  const handleDistanceChange = (distance: number[]) => {
    updateFilters({ distance: distance[0] });
    if (searchLocation) searchVenues();
  };

  const handleRatingChange = (rating: number) => {
    updateFilters({ minRating: rating });
    if (searchLocation) searchVenues();
  };

  const handlePriceLevelToggle = (level: number) => {
    const newPriceLevels = filters.priceLevel.includes(level)
      ? filters.priceLevel.filter(p => p !== level)
      : [...filters.priceLevel, level];
    
    updateFilters({ priceLevel: newPriceLevels });
    if (searchLocation) searchVenues();
  };

  const handleClearFilters = () => {
    resetFilters();
    if (searchLocation) searchVenues();
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
        
        {/* Categories */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-3">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className="text-sm"
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Distance Slider */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-foreground mb-3">
            Distance: <span className="text-primary">{filters.distance} km</span>
          </label>
          <Slider
            value={[filters.distance]}
            onValueChange={handleDistanceChange}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-3">Min Rating</label>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={() => handleRatingChange(rating === filters.minRating ? 0 : rating)}
                className="p-1"
              >
                <i 
                  className={`fas fa-star ${
                    rating <= filters.minRating ? 'text-yellow-400' : 'text-muted-foreground'
                  }`}
                ></i>
              </Button>
            ))}
          </div>
        </div>

        {/* Price Level */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-3">Price Level</label>
          <div className="flex space-x-2">
            {PRICE_LEVELS.map((price) => (
              <Button
                key={price.level}
                variant={filters.priceLevel.includes(price.level) ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriceLevelToggle(price.level)}
                className="text-sm min-w-[40px]"
              >
                {price.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <i className="fas fa-times mr-1"></i>
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
