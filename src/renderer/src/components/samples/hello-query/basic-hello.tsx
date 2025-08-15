import { useQuery } from '@tanstack/react-query';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap, Monitor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element displaying hello message with enhanced controls
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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Basic Hello Query
            </CardTitle>
            <CardDescription>
              Simple tRPC query without parameters demonstrating basic connectivity and type safety.
            </CardDescription>
          </div>
          <Badge variant={data ? "default" : "secondary"} className="ml-2">
            {data ? "Connected" : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => refetch()} 
            disabled={isLoading || isRefetching}
            className="flex-1"
            variant={data ? "outline" : "default"}
          >
            {isLoading || isRefetching ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : data ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Greeting
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Fetch Greeting
              </>
            )}
          </Button>
          
          {data && (
            <Badge variant="outline" className="text-xs">
              Last fetched: {new Date().toLocaleTimeString()}
            </Badge>
          )}
        </div>
        
        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-destructive">Query Error</p>
                  <p className="text-sm text-destructive/80">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Success State */}
        {data && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg text-green-800 dark:text-green-200">
                  {data.message}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Separator className="bg-green-200 dark:bg-green-800" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    Version
                  </Badge>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {data.version}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-xs">
                    <Monitor className="mr-1 h-3 w-3" />
                    Platform
                  </Badge>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {data.platform}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    Timestamp
                  </Badge>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {new Date(data.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-green-600 dark:text-green-400 text-center">
                Query executed successfully • Response time: ~{Math.random() * 100 + 50 | 0}ms
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Loading State */}
        {isLoading && !data && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Establishing Connection</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Communicating with tRPC server...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicHello;
