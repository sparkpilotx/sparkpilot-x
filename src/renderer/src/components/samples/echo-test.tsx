import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/lib/trpc';

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

  return (
    <div className={`space-y-4 p-6 border rounded-lg ${className || ''}`}>
      <h3 className="text-lg font-semibold">Echo Test Query</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Test tRPC communication with various data types and complex input structures.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="text-input">Text Input</Label>
          <input
            id="text-input"
            type="text"
            value={inputData.text || ''}
            onChange={(e) => updateInputData('text', e.target.value || undefined)}
            placeholder="Enter some text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Number Input */}
        <div className="space-y-2">
          <Label htmlFor="number-input">Number Input</Label>
          <input
            id="number-input"
            type="number"
            value={inputData.number ?? ''}
            onChange={(e) => updateInputData('number', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Enter a number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Boolean Input */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="boolean-input"
            checked={inputData.boolean || false}
            onCheckedChange={(checked) => updateInputData('boolean', checked === true ? true : undefined)}
          />
          <Label htmlFor="boolean-input">Boolean value (checked = true)</Label>
        </div>
        
        {/* Array Input */}
        <div className="space-y-2">
          <Label htmlFor="array-input">Array Input</Label>
          <input
            id="array-input"
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="Enter comma-separated values"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Example: apple, banana, cherry
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Sending...' : 'Test Echo'}
          </Button>
          
          {submittedData && (
            <Button 
              type="button" 
              onClick={() => refetch()}
              disabled={isLoading}
              variant="outline"
            >
              Refresh
            </Button>
          )}
          
          <Button 
            type="button" 
            onClick={handleReset}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
          <strong>Error:</strong> {error.message}
        </div>
      )}
      
      {data && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded">
          <div className="space-y-3">
            <p className="font-medium text-purple-800 dark:text-purple-200">
              {data.message}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-300">Echo Response:</h4>
              <pre className="text-sm bg-purple-100 dark:bg-purple-800/50 p-2 rounded overflow-auto text-purple-800 dark:text-purple-200">
                {JSON.stringify(data.echo, null, 2)}
              </pre>
            </div>
            
            <div className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
              <p><strong>Input Type:</strong> {data.inputType}</p>
              <p><strong>Has Text:</strong> {data.hasText ? 'Yes' : 'No'}</p>
              <p><strong>Has Number:</strong> {data.hasNumber ? 'Yes' : 'No'}</p>
              <p><strong>Has Boolean:</strong> {data.hasBoolean ? 'Yes' : 'No'}</p>
              <p><strong>Has Array:</strong> {data.hasArray ? 'Yes' : 'No'}</p>
              <p><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoTest;
