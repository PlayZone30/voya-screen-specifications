
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import DestinationCarousel from '@/components/DestinationCarousel';
import { useVoya } from '@/contexts/VoyaContext';

const Landing = () => {
  const [searchInput, setSearchInput] = useState('');
  const { setSearchQuery } = useVoya();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate('/map');
    }
  };

  const handleDestinationClick = (destination: string) => {
    setSearchQuery(destination);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
      <Header variant="landing" />
      
      {/* Hero Section - Added proper top padding for header */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="bg-hero-gradient absolute inset-0" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover. Stay. Explore.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Plan your perfect journey with personalized recommendations for stays and attractions.
          </p>
          
          {/* Primary Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex glass-morphism rounded-2xl p-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  placeholder="Where would you like to go?"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-transparent border-none text-white placeholder:text-white/70 focus:ring-0"
                />
              </div>
              <Button 
                type="submit"
                className="travel-button px-8 py-4 text-lg font-semibold"
              >
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Popular Destinations
          </h2>
          <DestinationCarousel onDestinationClick={handleDestinationClick} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Help</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy</a>
          </div>
          <div className="text-center mt-8 text-white/60">
            <p>&copy; 2024 VOYA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
