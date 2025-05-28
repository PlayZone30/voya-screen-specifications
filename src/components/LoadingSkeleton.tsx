
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'card' | 'list' | 'map-marker' | 'itinerary';
  count?: number;
}

const LoadingSkeleton = ({ type, count = 3 }: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 space-y-3">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        );
      
      case 'list':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        );
      
      case 'map-marker':
        return (
          <div className="absolute animate-pulse">
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        );
      
      case 'itinerary':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        );
      
      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
