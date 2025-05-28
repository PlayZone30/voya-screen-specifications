
import { useState, useEffect } from 'react';
import { MapPin, Layers, Navigation, Plus, Filter, Search, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import ItineraryPanel from '@/components/ItineraryPanel';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useVoya } from '@/contexts/VoyaContext';

// Mock map data
const mockAttractions = [
  { id: '1', name: 'Eiffel Tower', coordinates: [2.2945, 48.8584] as [number, number], rating: 4.8 },
  { id: '2', name: 'Louvre Museum', coordinates: [2.3376, 48.8606] as [number, number], rating: 4.7 },
  { id: '3', name: 'Arc de Triomphe', coordinates: [2.2950, 48.8738] as [number, number], rating: 4.6 },
];

const mockStays = [
  { id: '1', name: 'Hotel Plaza Athénée', coordinates: [2.3014, 48.8667] as [number, number], rating: 4.9, price: 450 },
  { id: '2', name: 'Le Meurice', coordinates: [2.3281, 48.8651] as [number, number], rating: 4.8, price: 380 },
  { id: '3', name: 'Hotel George V', coordinates: [2.3006, 48.8689] as [number, number], rating: 4.9, price: 520 },
];

const MapDashboard = () => {
  const { 
    selectedLayer, 
    setSelectedLayer, 
    isItineraryOpen, 
    setIsItineraryOpen,
    addToItinerary,
    searchQuery 
  } = useVoya();
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filters, setFilters] = useState({
    minRating: [4],
    priceRange: [0, 1000],
    amenities: {
      wifi: false,
      parking: false,
      pool: false,
    }
  });

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

  const currentData = selectedLayer === 'attractions' ? mockAttractions : mockStays;

  const handleAddToItinerary = (item: any) => {
    addToItinerary({
      id: item.id,
      name: item.name,
      type: selectedLayer === 'attractions' ? 'attraction' : 'stay',
      coordinates: item.coordinates,
    });
  };

  const handleCurrentLocation = () => {
    if (userLocation) {
      console.log('Centering map to user location:', userLocation);
    }
  };

  const handleSearchArea = () => {
    setShowSearchArea(false);
    // Re-run search in current map bounds
    console.log('Searching in current area');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dashboard" />
      
      {/* Map Container - Fixed padding to account for header */}
      <div className="pt-20 h-screen relative overflow-hidden">
        {/* Enhanced Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Map Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-travel-gradient rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                <MapPin className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-700 mb-2">Interactive Map</h2>
              <p className="text-gray-600 mb-4 text-lg">
                {searchQuery ? `Showing results for "${searchQuery}"` : 'Search for a destination to see the map'}
              </p>
              <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
                {currentData.length} {selectedLayer} found
              </Badge>
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
            currentData.map((item, index) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                  >
                    <div className={`w-8 h-8 ${selectedLayer === 'attractions' ? 'bg-blue-500' : 'bg-green-500'} rounded-full border-4 border-white shadow-lg flex items-center justify-center relative`}>
                      <MapPin className="h-4 w-4 text-white" />
                      <Button
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 p-0"
                        onClick={() => handleAddToItinerary(item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs">Click + to add to itinerary</p>
                </TooltipContent>
              </Tooltip>
            ))
          )}
        </div>

        {/* Mini Legend (bottom-left) */}
        <div className="absolute bottom-20 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-xs font-semibold mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Attractions</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Stays</span>
            </div>
          </div>
        </div>

        {/* Search This Area Button */}
        {showSearchArea && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
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
        <div className="absolute top-6 right-4 z-10 space-y-2">
          {/* Layer Toggle */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedLayer === 'attractions' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedLayer('attractions')}
                    className="text-xs"
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    Attractions
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show attractions</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedLayer === 'stays' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedLayer('stays')}
                    className="text-xs"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Stays
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show accommodations</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Filter Panel */}
          <Sheet>
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
            <SheetContent side="right" className="w-80 bg-white">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
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
                      <span>{filters.minRating[0]}+</span>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                {selectedLayer === 'stays' && (
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
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium mb-3 block">Amenities</Label>
                  <div className="space-y-3">
                    {Object.entries(filters.amenities).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={checked}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev,
                              amenities: { ...prev.amenities, [key]: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor={key} className="text-sm capitalize">
                          {key === 'wifi' ? 'Free WiFi' : key}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={() => console.log('Apply filters:', filters)}>
                    Apply Filters
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

        {/* Back to Top FAB */}
        {showBackToTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="fixed bottom-24 right-6 z-20 w-12 h-12 rounded-full bg-white shadow-lg"
                onClick={() => setShowBackToTop(false)}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to top</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Mock POI Cards */}
        <div className="absolute bottom-4 left-4 z-10 space-y-2 max-h-60 overflow-y-auto">
          {isLoading ? (
            <LoadingSkeleton type="card" count={2} />
          ) : (
            currentData.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-3 w-64 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedLayer === 'attractions' ? 'Tourist Attraction' : 'Accommodation'}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs font-medium">{(item as any).rating}</span>
                      {selectedLayer === 'stays' && (
                        <span className="text-xs text-gray-500 ml-2">${(item as any).price}/night</span>
                      )}
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToItinerary(item)}
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
