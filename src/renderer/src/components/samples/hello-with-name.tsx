import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';

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

  return (
    <div className={`space-y-4 p-6 border rounded-lg ${className || ''}`}>
      <h3 className="text-lg font-semibold">Hello with Name Query</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        tRPC query with input validation using Zod schemas for safe parameter handling.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name-input">Your Name</Label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (letters and spaces only)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Must be 1-50 characters, letters and spaces only
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={!name.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Sending...' : 'Say Hello'}
          </Button>
          
          {submittedName && (
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
          <strong>Validation Error:</strong> {error.message}
          <details className="mt-2">
            <summary className="cursor-pointer text-xs">Show details</summary>
            <pre className="mt-1 text-xs overflow-auto">{JSON.stringify(error, null, 2)}</pre>
          </details>
        </div>
      )}
      
      {data && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <div className="space-y-2">
            <p className="font-medium text-blue-800 dark:text-blue-200">
              {data.message}
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <p><strong>Input Received:</strong> "{data.inputReceived}"</p>
              <p><strong>Character Count:</strong> {data.characterCount}</p>
              <p><strong>Version:</strong> {data.version}</p>
              <p><strong>Platform:</strong> {data.platform}</p>
              <p><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelloWithName;
