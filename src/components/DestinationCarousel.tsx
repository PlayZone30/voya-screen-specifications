
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
    description: 'City of Light and Love'
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    description: 'Modern meets Traditional'
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
    description: 'Stunning Cycladic Beauty'
  },
  {
    id: '4',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    description: 'The City That Never Sleeps'
  },
  {
    id: '5',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    description: 'Tropical Paradise'
  },
  {
    id: '6',
    name: 'London',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    description: 'Royal Heritage & Culture'
  }
];

interface DestinationCarouselProps {
  onDestinationClick: (destination: string) => void;
}

const DestinationCarousel = ({ onDestinationClick }: DestinationCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, destinations.length - itemsPerView);

  const next = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative">
      {/* Carousel Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          disabled={currentIndex === 0}
          className="glass-morphism text-white border-white/30 hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={next}
          disabled={currentIndex === maxIndex}
          className="glass-morphism text-white border-white/30 hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Carousel Items */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="w-1/3 flex-shrink-0 px-4"
            >
              <div 
                className="travel-card cursor-pointer group overflow-hidden"
                onClick={() => onDestinationClick(destination.name)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">{destination.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Indicators */}
      <div className="flex justify-center mt-6 space-x-2 md:hidden">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationCarousel;
