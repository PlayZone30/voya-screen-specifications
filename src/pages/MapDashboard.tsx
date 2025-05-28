
import { useState, useEffect } from 'react';
import { MapPin, Layers, Navigation, Plus, Filter, Search, ArrowUp, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ItineraryPanel from '@/components/ItineraryPanel';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useVoya } from '@/contexts/VoyaContext';

// Mock data with enhanced properties
const mockStays = [
  { id: '1', name: 'Hotel Plaza Athénée', coordinates: [2.3014, 48.8667] as [number, number], rating: 4.9, price: 450, type: 'Hotel' },
  { id: '2', name: 'Le Meurice', coordinates: [2.3281, 48.8651] as [number, number], rating: 4.8, price: 380, type: 'Hotel' },
  { id: '3', name: 'Modern Apartment', coordinates: [2.3006, 48.8689] as [number, number], rating: 4.7, price: 120, type: 'Apartment' },
  { id: '4', name: 'Cozy B&B', coordinates: [2.2950, 48.8738] as [number, number], rating: 4.5, price: 90, type: 'B&B' },
];

const mockAttractions = [
  { id: '1', name: 'Eiffel Tower', coordinates: [2.2945, 48.8584] as [number, number], rating: 4.8, distance: '0.8 km', duration: '3 min' },
  { id: '2', name: 'Louvre Museum', coordinates: [2.3376, 48.8606] as [number, number], rating: 4.7, distance: '1.2 km', duration: '5 min' },
  { id: '3', name: 'Arc de Triomphe', coordinates: [2.2950, 48.8738] as [number, number], rating: 4.6, distance: '2.1 km', duration: '8 min' },
  { id: '4', name: 'Notre-Dame', coordinates: [2.3499, 48.8530] as [number, number], rating: 4.8, distance: '1.8 km', duration: '7 min' },
  { id: '5', name: 'Sacré-Cœur', coordinates: [2.3431, 48.8867] as [number, number], rating: 4.7, distance: '3.2 km', duration: '12 min' },
];

const MapDashboard = () => {
  const { 
    isItineraryOpen, 
    setIsItineraryOpen,
    addToItinerary,
    searchQuery 
  } = useVoya();
  
  const { toast } = useToast();
  
  // View state
  const [viewMode, setViewMode] = useState<'stays' | 'drill-in'>('stays');
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    minRating: [4],
    accommodationType: {
      Hotel: false,
      'B&B': false,
      Apartment: false,
      Hostel: false,
    },
    distanceRadius: 5, // km
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  // Filter stays based on active filters
  const filteredStays = mockStays.filter(stay => {
    const priceInRange = stay.price >= filters.priceRange[0] && stay.price <= filters.priceRange[1];
    const ratingMatch = stay.rating >= filters.minRating[0];
    const typeMatch = !Object.values(filters.accommodationType).some(Boolean) || 
                     filters.accommodationType[stay.type as keyof typeof filters.accommodationType];
    
    return priceInRange && ratingMatch && typeMatch;
  });

  const handleStayClick = (stay: any) => {
    if (viewMode === 'stays') {
      setSelectedStay(stay);
      setViewMode('drill-in');
      setShowRoute(true);
      
      // Simulate loading attractions
      toast({
        title: "Loading nearby attractions...",
        description: `Finding things to do near ${stay.name}`,
      });
    }
  };

  const handleBackToStays = () => {
    setViewMode('stays');
    setSelectedStay(null);
    setShowRoute(false);
  };

  const handleAddToItinerary = (item: any) => {
    addToItinerary({
      id: item.id,
      name: item.name,
      type: viewMode === 'drill-in' ? 'attraction' : 'stay',
      coordinates: item.coordinates,
    });
    
    toast({
      title: "Added to itinerary",
      description: `${item.name} has been added to your trip`,
    });
  };

  const handleCurrentLocation = () => {
    if (userLocation) {
      console.log('Centering map to user location:', userLocation);
      toast({
        title: "Current location",
        description: "Map centered to your location",
      });
    }
  };

  const handleSearchArea = () => {
    setShowSearchArea(false);
    console.log('Searching in current area');
    toast({
      title: "Searching area",
      description: "Looking for accommodations in this area...",
    });
  };

  const handleApplyFilters = () => {
    const newActiveFilters: string[] = [];
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      newActiveFilters.push(`€${filters.priceRange[0]}-€${filters.priceRange[1]}`);
    }
    
    if (filters.minRating[0] > 4) {
      newActiveFilters.push(`${filters.minRating[0]}+ stars`);
    }
    
    const selectedTypes = Object.entries(filters.accommodationType)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type);
    
    if (selectedTypes.length > 0) {
      newActiveFilters.push(...selectedTypes);
    }
    
    if (filters.distanceRadius < 10) {
      newActiveFilters.push(`Within ${filters.distanceRadius}km`);
    }
    
    setActiveFilters(newActiveFilters);
    setIsFilterOpen(false);
    
    toast({
      title: "Filters applied",
      description: `Found ${filteredStays.length} accommodations`,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      minRating: [4],
      accommodationType: {
        Hotel: false,
        'B&B': false,
        Apartment: false,
        Hostel: false,
      },
      distanceRadius: 5,
    });
    setActiveFilters([]);
  };

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterToRemove));
    // Reset corresponding filter
    if (filterToRemove.includes('€')) {
      setFilters(prev => ({ ...prev, priceRange: [0, 1000] }));
    } else if (filterToRemove.includes('stars')) {
      setFilters(prev => ({ ...prev, minRating: [4] }));
    } else if (filterToRemove.includes('km')) {
      setFilters(prev => ({ ...prev, distanceRadius: 5 }));
    } else {
      setFilters(prev => ({
        ...prev,
        accommodationType: {
          ...prev.accommodationType,
          [filterToRemove]: false
        }
      }));
    }
  };

  const currentData = viewMode === 'stays' ? filteredStays : mockAttractions;
  const routeDistance = viewMode === 'drill-in' && selectedStay ? '8.2 km' : '';
  const routeDuration = viewMode === 'drill-in' && selectedStay ? '32 min' : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dashboard" />
      
      {/* Map Container - Fixed padding to account for header */}
      <div className="pt-24 h-screen relative overflow-hidden">
        {/* Enhanced Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Route Polyline */}
          {showRoute && selectedStay && (
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
              <polyline
                points="300,200 350,150 400,180 320,250 380,300 300,200"
                fill="none"
                stroke="#008F7A"
                strokeWidth="3"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
          
          {/* Map Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-travel-gradient rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                <MapPin className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-700 mb-2">
                {viewMode === 'stays' ? 'Find Your Stay' : `Explore around ${selectedStay?.name}`}
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                {searchQuery ? `Showing results for "${searchQuery}"` : 
                 viewMode === 'stays' ? 'Select an accommodation to see nearby attractions' :
                 'Plan your perfect itinerary'}
              </p>
              <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
                {currentData.length} {viewMode === 'stays' ? 'accommodations' : 'attractions'} found
              </Badge>
              {viewMode === 'drill-in' && selectedStay && (
                <div className="flex gap-4 justify-center">
                  <Badge className="bg-green-100 text-green-800">
                    Total: {routeDistance}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    Duration: {routeDuration}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Mock Map Markers */}
          {isLoading ? (
            <>
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="absolute animate-pulse"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </>
          ) : (
            currentData.map((item, index) => {
              const isSelected = selectedStay && item.id === selectedStay.id;
              const markerSize = isSelected ? 'w-10 h-10' : 'w-8 h-8';
              const markerColor = viewMode === 'stays' ? 'bg-green-500' : 'bg-blue-500';
              const ringStyle = isSelected ? 'ring-4 ring-green-300 ring-opacity-50' : '';
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute cursor-pointer transform hover:scale-110 transition-all ${ringStyle}`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                      }}
                      onClick={() => viewMode === 'stays' && handleStayClick(item)}
                    >
                      <div className={`${markerSize} ${markerColor} rounded-full border-4 border-white shadow-lg flex items-center justify-center relative`}>
                        <MapPin className="h-4 w-4 text-white" />
                        <Button
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToItinerary(item);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs">
                      {viewMode === 'stays' ? 'Click to explore area' : 'Click + to add to itinerary'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="absolute top-8 left-4 z-10 flex flex-wrap gap-2 max-w-md">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Back to Stays Button */}
        {viewMode === 'drill-in' && (
          <div className="absolute top-8 left-4 z-20">
            <Button 
              onClick={handleBackToStays}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to stays
            </Button>
          </div>
        )}

        {/* Search This Area Button */}
        {showSearchArea && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              onClick={handleSearchArea}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-lg"
            >
              <Search className="h-4 w-4 mr-2" />
              Search this area
            </Button>
          </div>
        )}

        {/* Floating Controls (top-right) */}
        <div className="absolute top-8 right-4 z-10 space-y-2">
          {/* Filter Panel */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white shadow-lg">
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open filters</p>
                </TooltipContent>
              </Tooltip>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white border-l">
              <SheetHeader>
                <SheetTitle>Filter Accommodations</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium">Price Range (per night)</Label>
                  <div className="mt-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={1000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>€{filters.priceRange[0]}</span>
                      <span>€{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Minimum Rating</Label>
                  <div className="mt-2">
                    <Slider
                      value={filters.minRating}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value }))}
                      max={5}
                      min={1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1.0</span>
                      <span>{filters.minRating[0]}+ stars</span>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Accommodation Type</Label>
                  <div className="space-y-3">
                    {Object.entries(filters.accommodationType).map(([type, checked]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type}
                          checked={checked}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev,
                              accommodationType: { ...prev.accommodationType, [type]: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor={type} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Distance Radius</Label>
                  <div className="mt-2">
                    <Slider
                      value={[filters.distanceRadius]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, distanceRadius: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 km</span>
                      <span>{filters.distanceRadius} km</span>
                      <span>10 km</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleResetFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Current Location */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCurrentLocation}
                className="bg-white shadow-lg"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to current location</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom Info Card for Drill-in View */}
        {viewMode === 'drill-in' && selectedStay && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-xl p-4 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedStay.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500">★</span>
                  <span>{selectedStay.rating}</span>
                  <span>•</span>
                  <span>€{selectedStay.price}/night</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{routeDistance}</div>
                <div className="text-xs text-gray-600">{routeDuration} total</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Nearby Attractions</h4>
              {mockAttractions.slice(0, 5).map((attraction, index) => (
                <div key={attraction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{attraction.name}</div>
                    <div className="text-xs text-gray-500">
                      {attraction.distance} • {attraction.duration}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToItinerary(attraction)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stay Cards for Default View */}
        {viewMode === 'stays' && (
          <div className="absolute bottom-4 left-4 z-10 space-y-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <LoadingSkeleton type="card" count={2} />
            ) : (
              filteredStays.slice(0, 3).map((stay) => (
                <div 
                  key={stay.id} 
                  className="bg-white rounded-lg shadow-lg p-3 w-64 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleStayClick(stay)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{stay.name}</h3>
                      <p className="text-xs text-gray-500">{stay.type}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-xs font-medium">{stay.rating}</span>
                        <span className="text-xs text-gray-500 ml-2">€{stay.price}/night</span>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToItinerary(stay);
                          }}
                          className="text-xs ml-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to itinerary</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Floating Action Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full travel-button shadow-xl"
              onClick={() => setIsItineraryOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open itinerary</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Itinerary Panel */}
      <ItineraryPanel 
        isOpen={isItineraryOpen} 
        onClose={() => setIsItineraryOpen(false)} 
      />
    </div>
  );
};

export default MapDashboard;
