
import { useState } from 'react';
import { X, Share2, Save, Download, GripVertical, Edit, Trash2, Clock, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useVoya } from '@/contexts/VoyaContext';
import { toast } from 'sonner';

interface ItineraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ItineraryPanel = ({ isOpen, onClose }: ItineraryPanelProps) => {
  const { itinerary, setItinerary, removeFromItinerary } = useVoya();
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const handleSave = () => {
    toast.success('Itinerary saved successfully!');
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
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {itinerary.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Route className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No stops yet</h3>
                <p className="text-gray-500 text-sm">
                  Add attractions and stays from the map to start building your itinerary.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {itinerary.map((stop, index) => (
                  <div
                    key={stop.id}
                    draggable
                    onDragStart={() => handleDragStart(stop.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-gray-50 rounded-lg p-3 cursor-move transition-all ${
                      isDragging === stop.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <GripVertical className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm truncate">{stop.name}</h4>
                            <Badge 
                              variant={stop.type === 'stay' ? 'default' : 'secondary'}
                              className="text-xs mt-1"
                            >
                              {stop.type === 'stay' ? 'Stay' : 'Attraction'}
                            </Badge>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromItinerary(stop.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
