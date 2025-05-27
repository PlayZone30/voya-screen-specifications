
import { useState, useEffect } from 'react';
import { MapPin, Layers, Navigation, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ItineraryPanel from '@/components/ItineraryPanel';
import { useVoya } from '@/contexts/VoyaContext';

// Mock map data
const mockAttractions = [
  { id: '1', name: 'Eiffel Tower', coordinates: [2.2945, 48.8584] as [number, number] },
  { id: '2', name: 'Louvre Museum', coordinates: [2.3376, 48.8606] as [number, number] },
  { id: '3', name: 'Arc de Triomphe', coordinates: [2.2950, 48.8738] as [number, number] },
];

const mockStays = [
  { id: '1', name: 'Hotel Plaza Athénée', coordinates: [2.3014, 48.8667] as [number, number] },
  { id: '2', name: 'Le Meurice', coordinates: [2.3281, 48.8651] as [number, number] },
  { id: '3', name: 'Hotel George V', coordinates: [2.3006, 48.8689] as [number, number] },
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

  useEffect(() => {
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
      // In a real app, this would center the map
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dashboard" />
      
      {/* Map Container */}
      <div className="pt-16 relative h-screen">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-travel-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Interactive Map</h2>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Search for a destination to see the map'}
            </p>
            <Badge variant="outline" className="mb-4">
              {currentData.length} {selectedLayer} found
            </Badge>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {/* Layer Toggle */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex space-x-1">
              <Button
                variant={selectedLayer === 'attractions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedLayer('attractions')}
                className="text-xs"
              >
                <Layers className="h-3 w-3 mr-1" />
                Attractions
              </Button>
              <Button
                variant={selectedLayer === 'stays' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedLayer('stays')}
                className="text-xs"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Stays
              </Button>
            </div>
          </div>

          {/* Current Location */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            className="bg-white shadow-lg"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Action Button */}
        <Button
          className="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full travel-button shadow-xl"
          onClick={() => setIsItineraryOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Mock POI Cards */}
        <div className="absolute bottom-4 left-4 z-10 space-y-2 max-h-60 overflow-y-auto">
          {currentData.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-3 w-64">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedLayer === 'attractions' ? 'Tourist Attraction' : 'Accommodation'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddToItinerary(item)}
                  className="text-xs"
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
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
