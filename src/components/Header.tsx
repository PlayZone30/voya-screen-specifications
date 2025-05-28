
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoya } from '@/contexts/VoyaContext';

interface HeaderProps {
  variant?: 'landing' | 'dashboard';
}

const Header = ({ variant = 'landing' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useVoya();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/map');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      variant === 'landing' ? 'bg-black/20 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md border-b'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-travel-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className={`text-xl font-bold ${
              variant === 'landing' ? 'text-white' : 'text-gray-900'
            }`}>
              VOYA
            </span>
          </Link>

          {/* Search Bar (Dashboard only) */}
          {variant === 'dashboard' && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Bell */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`relative ${
                    variant === 'landing' 
                      ? 'text-white hover:text-white hover:bg-white/20' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    2
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className={
                    variant === 'landing' 
                      ? 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900 bg-white border-gray-300'
                  }>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Profile & Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`md:hidden ${variant === 'landing' ? 'text-white hover:text-white hover:bg-white/20' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {variant === 'dashboard' && (
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </form>
              )}
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge className="ml-auto bg-red-500 text-white">2</Badge>
              </Button>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
