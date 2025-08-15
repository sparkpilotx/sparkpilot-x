import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, RefreshCw, AlertCircle, CheckCircle, RotateCcw, MessageSquare, Hash, ToggleLeft, List, Code } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

/**
 * Properties for the EchoTest component.
 */
interface EchoTestProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * Input data structure for the echo test.
 */
interface EchoInput {
  text?: string;
  number?: number;
  boolean?: boolean;
  array?: string[];
}

/**
 * EchoTest component demonstrating tRPC query with complex input types.
 * 
 * This component showcases:
 * - tRPC query with optional parameters
 * - Complex input data types (string, number, boolean, array)
 * - Form state management for multiple input types
 * - Data serialization testing
 * - Debugging and testing utilities
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element with various input controls and echo response display
 */
const EchoTest = ({ className }: EchoTestProps): React.JSX.Element => {
  const [inputData, setInputData] = useState<EchoInput>({});
  const [submittedData, setSubmittedData] = useState<EchoInput | null>(null);
  const [arrayInput, setArrayInput] = useState('');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...trpc.samples.helloQuery.echo.queryOptions(submittedData || {}),
    enabled: !!submittedData, // Only run query when data is submitted
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Parse array input
    const arrayValue = arrayInput.trim() 
      ? arrayInput.split(',').map(item => item.trim()).filter(Boolean)
      : undefined;
    
    const dataToSubmit: EchoInput = {
      ...(inputData.text && { text: inputData.text }),
      ...(inputData.number !== undefined && { number: inputData.number }),
      ...(inputData.boolean !== undefined && { boolean: inputData.boolean }),
      ...(arrayValue && arrayValue.length > 0 && { array: arrayValue }),
    };
    
    setSubmittedData(dataToSubmit);
  };

  const handleReset = (): void => {
    setInputData({});
    setSubmittedData(null);
    setArrayInput('');
  };

  const updateInputData = (key: keyof EchoInput, value: string | number | boolean | undefined): void => {
    setInputData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getInputCount = (): number => {
    let count = 0;
    if (inputData.text) count++;
    if (inputData.number !== undefined) count++;
    if (inputData.boolean !== undefined) count++;
    if (arrayInput.trim()) count++;
    return count;
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <MessageSquare className="h-6 w-6 text-purple-500" />
              Echo Test Query
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Test tRPC communication with various data types and complex input structures.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {getInputCount()} inputs
            </Badge>
            <Badge variant={data ? "default" : "secondary"} className="text-sm px-3 py-1">
              {data ? "Echoed" : "Ready"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Form */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Text Input */}
              <div className="space-y-3">
                <Label htmlFor="text-input" className="flex items-center gap-3 text-base">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Text Input
                </Label>
                <Input
                  id="text-input"
                  type="text"
                  value={inputData.text || ''}
                  onChange={(e) => updateInputData('text', e.target.value || undefined)}
                  placeholder="Enter some text to echo back"
                  className="h-12 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Number Input */}
              <div className="space-y-3">
                <Label htmlFor="number-input" className="flex items-center gap-3 text-base">
                  <Hash className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Number Input
                </Label>
                <Input
                  id="number-input"
                  type="number"
                  value={inputData.number ?? ''}
                  onChange={(e) => updateInputData('number', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Enter a number to echo back"
                  className="h-12 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Boolean Input */}
              <div className="flex items-center space-x-4 p-4 rounded-lg border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
                <Checkbox
                  id="boolean-input"
                  checked={inputData.boolean || false}
                  onCheckedChange={(checked) => updateInputData('boolean', checked === true ? true : undefined)}
                  className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-5 w-5"
                />
                <Label htmlFor="boolean-input" className="flex items-center gap-3 cursor-pointer text-base">
                  <ToggleLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Boolean value (checked = true)
                </Label>
              </div>
              
              {/* Array Input */}
              <div className="space-y-3">
                <Label htmlFor="array-input" className="flex items-center gap-3 text-base">
                  <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Array Input
                </Label>
                <Input
                  id="array-input"
                  type="text"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder="Enter comma-separated values (e.g., apple, banana, cherry)"
                  className="h-12 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Values will be split by commas and trimmed
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <Button 
                  type="submit" 
                  disabled={isLoading || getInputCount() === 0}
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
                      Test Echo
                    </>
                  )}
                </Button>
                
                {submittedData && (
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
                <div className="space-y-2">
                  <p className="font-medium text-destructive text-lg">Echo Query Error</p>
                  <p className="text-base text-destructive/80">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Success State */}
        {data && (
          <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-xl text-purple-800 dark:text-purple-200">
                  {data.message}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <Separator className="bg-purple-200 dark:bg-purple-800" />
              
              {/* Echo Response */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Code className="mr-2 h-4 w-4" />
                    Echo Response
                  </Badge>
                </div>
                <pre className="text-base bg-purple-100 dark:bg-purple-800/50 p-4 rounded-lg overflow-auto text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700">
                  {JSON.stringify(data.echo, null, 2)}
                </pre>
              </div>
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Text
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {data.hasText ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Hash className="mr-2 h-4 w-4" />
                    Number
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {data.hasNumber ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Boolean
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {data.hasBoolean ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <List className="mr-2 h-4 w-4" />
                    Array
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {data.hasArray ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Code className="mr-2 h-4 w-4" />
                    Type
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {data.inputType}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Timestamp
                  </Badge>
                  <span className="text-base font-medium text-purple-800 dark:text-purple-200">
                    {new Date(data.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-purple-600 dark:text-purple-400 text-center">
                Echo query executed successfully • Input validation passed
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default EchoTest;
