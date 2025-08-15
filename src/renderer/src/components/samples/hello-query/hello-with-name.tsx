import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, RefreshCw, AlertCircle, CheckCircle, RotateCcw, User, MessageSquare, Hash, Monitor, Clock, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

/**
 * Properties for the HelloWithName component.
 */
interface HelloWithNameProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * HelloWithName component demonstrating tRPC query with input validation.
 * 
 * This component showcases:
 * - tRPC query with Zod input validation
 * - Form state management with React hooks
 * - Input validation error handling
 * - Conditional query execution
 * - Type-safe parameter passing
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element with name input form and personalized greeting
 */
const HelloWithName = ({ className }: HelloWithNameProps): React.JSX.Element => {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...trpc.samples.helloQuery.helloWithName.queryOptions({ name: submittedName || '' }),
    enabled: !!submittedName, // Only run query when name is submitted
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (name.trim()) {
      setSubmittedName(name.trim());
    }
  };

  const handleReset = (): void => {
    setName('');
    setSubmittedName(null);
  };

  const getValidationStatus = (): 'valid' | 'invalid' | 'empty' => {
    if (!name.trim()) return 'empty';
    if (name.trim().length < 1 || name.trim().length > 50) return 'invalid';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'invalid';
    return 'valid';
  };

  const getValidationMessage = (): string => {
    const status = getValidationStatus();
    switch (status) {
      case 'valid':
        return 'Name is valid and ready to submit';
      case 'invalid':
        return 'Name must be 1-50 characters, letters and spaces only';
      case 'empty':
        return 'Please enter a name to continue';
      default:
        return '';
    }
  };

  const getValidationColor = (): string => {
    const status = getValidationStatus();
    switch (status) {
      case 'valid':
        return 'text-green-600 dark:text-green-400';
      case 'invalid':
        return 'text-red-600 dark:text-red-400';
      case 'empty':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <User className="h-6 w-6 text-blue-500" />
              Hello with Name Query
            </CardTitle>
            <CardDescription className="text-base mt-2">
              tRPC query with input validation using Zod schemas for safe parameter handling.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {name.trim() ? `${name.trim().length}/50` : '0/50'}
            </Badge>
            <Badge variant={data ? "default" : getValidationStatus() === 'valid' ? "secondary" : "destructive"} className="text-sm px-3 py-1">
              {data ? "Greeted" : getValidationStatus() === 'valid' ? "Ready" : "Invalid"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Form */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Personal Greeting
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name-input" className="flex items-center gap-3 text-base">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Your Name
                </Label>
                <Input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (letters and spaces only)"
                  className={cn(
                    "h-12 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500",
                    getValidationStatus() === 'valid' ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : '',
                    getValidationStatus() === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  )}
                  maxLength={50}
                />
                <div className="flex items-center gap-3">
                  <Info className={`h-4 w-4 ${getValidationColor()}`} />
                  <p className={`text-sm ${getValidationColor()}`}>
                    {getValidationMessage()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-3">
                <Button 
                  type="submit" 
                  disabled={getValidationStatus() !== 'valid' || isLoading}
                  className="flex-1 h-12 text-base"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-3 h-5 w-5" />
                      Say Hello
                    </>
                  )}
                </Button>
                
                {submittedName && (
                  <Button 
                    type="button" 
                    onClick={() => refetch()}
                    disabled={isLoading}
                    variant="outline"
                    className="h-12 text-base"
                  >
                    <RefreshCw className="mr-3 h-5 w-5" />
                    Refresh
                  </Button>
                )}
                
                <Button 
                  type="button" 
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 text-base"
                >
                  <RotateCcw className="mr-3 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-medium text-destructive text-lg">Validation Error</p>
                    <p className="text-base text-destructive/80">{error.message}</p>
                  </div>
                  
                  <details className="text-base">
                    <summary className="cursor-pointer text-destructive/80 hover:text-destructive font-medium">
                      Show error details
                    </summary>
                    <pre className="mt-3 p-3 bg-destructive/10 rounded-lg text-sm overflow-auto text-destructive/80 border border-destructive/20">
                      {JSON.stringify(error, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Success State */}
        {data && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-xl text-blue-800 dark:text-blue-200">
                  {data.message}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <Separator className="bg-blue-200 dark:bg-blue-800" />
              
              {/* Input Summary */}
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <User className="mr-2 h-4 w-4" />
                    Input Received
                  </Badge>
                </div>
                <p className="text-base font-medium text-blue-800 dark:text-blue-200">
                  "{data.inputReceived}"
                </p>
              </div>
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Hash className="mr-2 h-4 w-4" />
                    Characters
                  </Badge>
                  <span className="text-base font-medium text-blue-800 dark:text-blue-200">
                    {data.characterCount}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Monitor className="mr-2 h-4 w-4" />
                    Platform
                  </Badge>
                  <span className="text-base font-medium text-blue-800 dark:text-blue-200">
                    {data.platform}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Version
                  </Badge>
                  <span className="text-base font-medium text-blue-800 dark:text-blue-200">
                    {data.version}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Clock className="mr-2 h-4 w-4" />
                    Timestamp
                  </Badge>
                  <span className="text-base font-medium text-blue-800 dark:text-blue-200">
                    {new Date(data.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                Greeting sent successfully • Input validation passed
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default HelloWithName;
