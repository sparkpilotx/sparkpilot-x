import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

/**
 * Properties for the BasicHello component.
 */
interface BasicHelloProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * BasicHello component demonstrating a simple tRPC query without parameters.
 * 
 * This component showcases:
 * - Basic tRPC query usage with React Query
 * - Loading and error state handling
 * - Manual query refetching
 * - Type-safe API communication
 * 
 * @param props - Component properties
 * @returns JSX element displaying hello message with controls
 */
const BasicHello = ({ className }: BasicHelloProps): React.JSX.Element => {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery(trpc.samples.helloQuery.hello.queryOptions());

  return (
    <div className={`space-y-4 p-6 border rounded-lg ${className || ''}`}>
      <h3 className="text-lg font-semibold">Basic Hello Query</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Simple tRPC query without parameters demonstrating basic connectivity.
      </p>
      
      <div className="space-y-2">
        <Button 
          onClick={() => refetch()} 
          disabled={isLoading || isRefetching}
          className="w-full"
        >
          {isLoading || isRefetching ? 'Loading...' : 'Fetch Greeting'}
        </Button>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        {data && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <div className="space-y-2">
              <p className="font-medium text-green-800 dark:text-green-200">
                {data.message}
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                <p><strong>Version:</strong> {data.version}</p>
                <p><strong>Platform:</strong> {data.platform}</p>
                <p><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicHello;
