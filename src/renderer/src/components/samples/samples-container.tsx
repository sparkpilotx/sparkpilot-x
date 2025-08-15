import BasicHello from './basic-hello';
import HelloWithName from './hello-with-name';
import EchoTest from './echo-test';

/**
 * Properties for the SamplesContainer component.
 */
interface SamplesContainerProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * SamplesContainer component organizing all tRPC sample demonstrations.
 * 
 * This container component provides:
 * - Organized layout for multiple sample components
 * - Responsive grid system for various screen sizes
 * - Consistent spacing and visual hierarchy
 * - Easy extensibility for future sample additions
 * 
 * @param props - Component properties
 * @returns JSX element containing all sample components in an organized layout
 */
const SamplesContainer = ({ className }: SamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className || ''}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          tRPC v11 Samples
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Interactive demonstrations of tRPC v11 features in Electron applications. 
          These samples showcase type-safe API communication, input validation, 
          error handling, and React Query integration.
        </p>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Basic Hello Sample */}
        <div className="lg:col-span-1">
          <BasicHello />
        </div>

        {/* Hello with Name Sample */}
        <div className="lg:col-span-1">
          <HelloWithName />
        </div>

        {/* Echo Test Sample */}
        <div className="lg:col-span-1 xl:col-span-1">
          <EchoTest />
        </div>
      </div>

      {/* Footer Information */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          About These Samples
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Basic Hello:</strong> Demonstrates simple tRPC queries without parameters, 
            perfect for testing basic connectivity and understanding the request/response flow.
          </p>
          <p>
            <strong>Hello with Name:</strong> Shows input validation using Zod schemas, 
            form state management, and error handling for invalid inputs.
          </p>
          <p>
            <strong>Echo Test:</strong> Tests complex data serialization with various data types 
            including strings, numbers, booleans, and arrays.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Development Tip:</strong> Open React Query DevTools 
            (Ctrl+Shift+D / Cmd+Shift+D) to inspect query states, cache data, and network requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SamplesContainer;
