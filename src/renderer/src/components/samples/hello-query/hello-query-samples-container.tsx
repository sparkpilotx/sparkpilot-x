import { BasicHello, HelloWithName, EchoTest } from './index';

/**
 * Properties for the HelloQuerySamplesContainer component.
 */
interface HelloQuerySamplesContainerProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * HelloQuerySamplesContainer component organizing hello-query router sample demonstrations.
 * 
 * This container component provides:
 * - Organized layout for hello-query sample components
 * - Responsive grid system for various screen sizes
 * - Consistent spacing and visual hierarchy
 * - Focused demonstration of hello-query router features
 * 
 * @param props - Component properties
 * @returns JSX element containing hello-query sample components in an organized layout
 */
const HelloQuerySamplesContainer = ({ className }: HelloQuerySamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className || ''}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Hello Query Router Samples
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Interactive demonstrations of the hello-query router showcasing basic tRPC v11 patterns. 
          These samples demonstrate simple queries, input validation with Zod schemas, 
          and complex data serialization between Electron processes.
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
          About Hello Query Router
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            The hello-query router demonstrates fundamental tRPC v11 patterns and serves as 
            an excellent starting point for understanding type-safe API communication in Electron applications.
          </p>
          <p>
            <strong>Basic Hello:</strong> Simple connectivity testing without parameters, 
            perfect for verifying the tRPC setup and basic request/response flow.
          </p>
          <p>
            <strong>Hello with Name:</strong> Input validation using Zod schemas, 
            form state management, and comprehensive error handling patterns.
          </p>
          <p>
            <strong>Echo Test:</strong> Complex data serialization testing with various data types 
            to ensure proper communication between main and renderer processes.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Development Tip:</strong> Use React Query DevTools 
            (Ctrl+Shift+D / Cmd+Shift+D) to inspect query states, cache data, and network requests 
            for these hello-query procedures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelloQuerySamplesContainer;
