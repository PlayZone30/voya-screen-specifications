
import { useState } from 'react';
import { X, Share2, Save, Download, GripVertical, Edit, Trash2, Clock, Route, Calendar, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoya } from '@/contexts/VoyaContext';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { toast } from 'sonner';

interface ItineraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ItineraryStop {
  id: string;
  name: string;
  type: 'stay' | 'attraction';
  coordinates: [number, number];
  day?: number;
  status?: 'pending' | 'visited' | 'locked';
}

const ItineraryPanel = ({ isOpen, onClose }: ItineraryPanelProps) => {
  const { itinerary, setItinerary, removeFromItinerary } = useVoya();
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDay, setActiveDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Organize itinerary by days
  const itineraryByDays = itinerary.reduce((acc, stop) => {
    const day = (stop as ItineraryStop).day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(stop as ItineraryStop);
    return acc;
  }, {} as Record<number, ItineraryStop[]>);

  const maxDays = Math.max(3, Object.keys(itineraryByDays).length);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Itinerary saved successfully!');
    }, 1000);
  };

  const handleShare = () => {
    const shareData = {
      title: 'My VOYA Itinerary',
      text: `Check out my travel itinerary with ${itinerary.length} stops!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Itinerary link copied to clipboard!');
    }
  };

  const handleExport = () => {
    toast.success('PDF export started!');
  };

  const handleDragStart = (stopId: string) => {
    setIsDragging(stopId);
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!isDragging) return;

    const dragIndex = itinerary.findIndex(stop => stop.id === isDragging);
    if (dragIndex === -1) return;

    const newItinerary = [...itinerary];
    const [draggedItem] = newItinerary.splice(dragIndex, 1);
    newItinerary.splice(targetIndex, 0, draggedItem);
    
    setItinerary(newItinerary);
    setIsDragging(null);
  };

  const toggleStopStatus = (stopId: string) => {
    const updatedItinerary = itinerary.map(stop => {
      if (stop.id === stopId) {
        const currentStatus = (stop as ItineraryStop).status || 'pending';
        const newStatus = currentStatus === 'pending' ? 'visited' : 
                         currentStatus === 'visited' ? 'locked' : 'pending';
        return { ...stop, status: newStatus };
      }
      return stop;
    });
    setItinerary(updatedItinerary);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'visited':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const totalDistance = "12.5 km";
  const estimatedTime = "2h 30m";

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">My Itinerary</h2>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share itinerary</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save itinerary</p>
                </TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Date Picker */}
          <div className="p-4 border-b">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(selectedDate, 'MMMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {itinerary.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Route className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No stops yet</h3>
                <p className="text-gray-500 text-sm">
                  Add attractions and stays from the map to start building your itinerary.
                </p>
              </div>
            ) : (
              <Tabs value={`day${activeDay}`} onValueChange={(value) => setActiveDay(parseInt(value.replace('day', '')))}>
                {/* Day Tabs */}
                <div className="border-b">
                  <TabsList className="w-full h-auto p-0 bg-transparent">
                    {Array.from({ length: maxDays }, (_, i) => (
                      <TabsTrigger 
                        key={i + 1} 
                        value={`day${i + 1}`}
                        className="flex-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                      >
                        Day {i + 1}
                        {itineraryByDays[i + 1] && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {itineraryByDays[i + 1].length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Day Content */}
                {Array.from({ length: maxDays }, (_, i) => (
                  <TabsContent key={i + 1} value={`day${i + 1}`} className="p-4 space-y-3">
                    {isLoading ? (
                      <LoadingSkeleton type="itinerary" count={2} />
                    ) : itineraryByDays[i + 1]?.length > 0 ? (
                      itineraryByDays[i + 1].map((stop, index) => (
                        <div
                          key={stop.id}
                          draggable
                          onDragStart={() => handleDragStart(stop.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`bg-gray-50 rounded-lg p-3 cursor-move transition-all hover:shadow-md ${
                            isDragging === stop.id ? 'opacity-50 scale-95' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <GripVertical className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm truncate">{stop.name}</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge 
                                      variant={stop.type === 'stay' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {stop.type === 'stay' ? 'Stay' : 'Attraction'}
                                    </Badge>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          onClick={() => toggleStopStatus(stop.id)}
                                          className="hover:scale-110 transition-transform"
                                        >
                                          {getStatusIcon(stop.status)}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {stop.status === 'pending' && 'Mark as visited'}
                                          {stop.status === 'visited' && 'Lock this stop'}
                                          {stop.status === 'locked' && 'Unlock this stop'}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit stop</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeFromItinerary(stop.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Remove from itinerary</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No stops planned for this day</p>
                        <p className="text-gray-400 text-xs mt-1">Add attractions from the map</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>

          {/* Footer */}
          {itinerary.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <Route className="h-4 w-4" />
                    <span className="text-sm">Distance</span>
                  </div>
                  <p className="font-semibold">{totalDistance}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-semibold">{estimatedTime}</p>
                </div>
              </div>
              <Separator />
              <Button 
                className="w-full travel-button"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItineraryPanel;
