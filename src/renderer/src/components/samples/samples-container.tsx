import HelloQuerySamplesContainer from './hello-query';

/**
 * Properties for the SamplesContainer component.
 */
interface SamplesContainerProps {
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * SamplesContainer component organizing all tRPC sample router demonstrations.
 * 
 * This main container component provides:
 * - Organized layout for multiple router sample containers
 * - Navigation between different router samples
 * - Consistent spacing and visual hierarchy
 * - Easy extensibility for future router sample additions
 * 
 * @param props - Component properties
 * @returns JSX element containing all router sample containers in an organized layout
 */
const SamplesContainer = ({ className }: SamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full min-h-screen bg-background ${className || ''}`}>
      {/* Main Header */}
      <div className="w-full max-w-7xl mx-auto p-6 pb-0">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            tRPC v11 Sample Routers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl">
            Interactive demonstrations of tRPC v11 features organized by router. 
            Each router showcases different aspects of type-safe API communication, 
            input validation, error handling, and React Query integration in Electron applications.
          </p>
        </div>
      </div>

      {/* Router Samples */}
      <div className="space-y-12">
        {/* Hello Query Router Samples */}
        <section>
          <HelloQuerySamplesContainer />
        </section>

        {/* Future router samples will be added here */}
        {/* 
        <section>
          <UserRouterSamplesContainer />
        </section>
        
        <section>
          <FileRouterSamplesContainer />
        </section>
        */}
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-7xl mx-auto p-6 pt-12">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                        border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              About tRPC v11 Integration
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Architecture</h3>
                <ul className="space-y-1">
                  <li>• Standalone HTTP server in main process</li>
                  <li>• React Query client with split transport</li>
                  <li>• Type-safe communication via shared types</li>
                  <li>• Superjson for complex data serialization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Development Tools</h3>
                <ul className="space-y-1">
                  <li>• React Query DevTools (Ctrl+Shift+D / Cmd+Shift+D)</li>
                  <li>• TypeScript integration for full type safety</li>
                  <li>• Zod schema validation with detailed errors</li>
                  <li>• Hot reload support for rapid development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplesContainer;