
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ItineraryStop {
  id: string;
  name: string;
  type: 'stay' | 'attraction';
  coordinates: [number, number];
  duration?: number;
}

interface VoyaContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itinerary: ItineraryStop[];
  setItinerary: (itinerary: ItineraryStop[]) => void;
  addToItinerary: (stop: ItineraryStop) => void;
  removeFromItinerary: (stopId: string) => void;
  selectedLayer: 'attractions' | 'stays';
  setSelectedLayer: (layer: 'attractions' | 'stays') => void;
  isItineraryOpen: boolean;
  setIsItineraryOpen: (open: boolean) => void;
}

const VoyaContext = createContext<VoyaContextType | undefined>(undefined);

export const VoyaProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryStop[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<'attractions' | 'stays'>('attractions');
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);

  const addToItinerary = (stop: ItineraryStop) => {
    setItinerary(prev => [...prev, stop]);
  };

  const removeFromItinerary = (stopId: string) => {
    setItinerary(prev => prev.filter(stop => stop.id !== stopId));
  };

  return (
    <VoyaContext.Provider value={{
      searchQuery,
      setSearchQuery,
      itinerary,
      setItinerary,
      addToItinerary,
      removeFromItinerary,
      selectedLayer,
      setSelectedLayer,
      isItineraryOpen,
      setIsItineraryOpen,
    }}>
      {children}
    </VoyaContext.Provider>
  );
};

export const useVoya = () => {
  const context = useContext(VoyaContext);
  if (context === undefined) {
    throw new Error('useVoya must be used within a VoyaProvider');
  }
  return context;
};
