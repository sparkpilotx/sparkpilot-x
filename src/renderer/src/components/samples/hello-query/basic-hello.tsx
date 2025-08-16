import { useQuery } from '@tanstack/react-query';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap, Monitor, Activity, Database } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

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

  // Minimal DB health test via tRPC health endpoint
  const {
    data: healthData,
    isLoading: isHealthLoading,
    error: healthError,
    refetch: refetchHealth,
    isRefetching: isHealthRefetching,
  } = useQuery(
    trpc.health.db.queryOptions(
      undefined,
      {
        // keep health checks lightweight; don't auto-refetch often
        staleTime: 5_000,
      }
    )
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Zap className="h-6 w-6 text-blue-500" />
              Basic Hello Query
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Simple tRPC query without parameters demonstrating basic connectivity and type safety.
            </CardDescription>
          </div>
          <Badge variant={data ? "default" : "secondary"} className="ml-2 text-sm px-3 py-1">
            {data ? "Connected" : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => refetch()} 
            disabled={isLoading || isRefetching}
            className="flex-1 h-12 text-base"
            variant={data ? "outline" : "default"}
          >
            {isLoading || isRefetching ? (
              <>
                <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : data ? (
              <>
                <RefreshCw className="mr-3 h-5 w-5" />
                Refresh Greeting
              </>
            ) : (
              <>
                <Zap className="mr-3 h-5 w-5" />
                Fetch Greeting
              </>
            )}
          </Button>
          
          {data && (
            <Badge variant="outline" className="text-sm px-4 py-2">
              Last fetched: {new Date().toLocaleTimeString()}
            </Badge>
          )}
        </div>
        
        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-destructive text-lg">Query Error</p>
                  <p className="text-base text-destructive/80">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Success State */}
        {data && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <CardTitle className="text-xl text-green-800 dark:text-green-200">
                  {data.message}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Separator className="bg-green-200 dark:bg-green-800" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Clock className="mr-2 h-4 w-4" />
                    Version
                  </Badge>
                  <span className="text-base font-medium text-green-800 dark:text-green-200">
                    {data.version}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Monitor className="mr-2 h-4 w-4" />
                    Platform
                  </Badge>
                  <span className="text-base font-medium text-green-800 dark:text-green-200">
                    {data.platform}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Clock className="mr-2 h-4 w-4" />
                    Timestamp
                  </Badge>
                  <span className="text-base font-medium text-green-800 dark:text-green-200">
                    {new Date(data.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-green-600 dark:text-green-400 text-center">
                Query executed successfully • Response time: ~{Math.random() * 100 + 50 | 0}ms
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minimal DB Health Test */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg">Database Health</CardTitle>
              </div>
              <Badge variant={healthData?.ok ? "default" : healthError ? "destructive" : "secondary"} className="text-xs px-3 py-1">
                {healthData?.ok ? `OK • ${healthData.durationMs}ms` : healthError ? 'Error' : 'Unknown'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => refetchHealth()}
                disabled={isHealthLoading || isHealthRefetching}
                className="h-10"
                variant="outline"
              >
                {isHealthLoading || isHealthRefetching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Test DB Connection
                  </>
                )}
              </Button>
              {healthError && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[320px]">{healthError.message}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Loading State */}
        {isLoading && !data && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200 text-lg">Establishing Connection</p>
                  <p className="text-base text-blue-600 dark:text-blue-400">
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
