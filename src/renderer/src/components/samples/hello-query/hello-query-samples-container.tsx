import { BasicHello, HelloWithName, EchoTest } from './index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  User, 
  MessageSquare, 
  Code, 
  Lightbulb, 
  ExternalLink, 
  Layers, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

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
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element containing hello-query sample components in an organized layout
 */
const HelloQuerySamplesContainer = ({ className }: HelloQuerySamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full max-w-7xl mx-auto p-4 sm:p-6 ${className || ''}`}>
      {/* Hero Header Section */}
      <Card className="mb-8 border-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-sm">
              tRPC v11
            </Badge>
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Hello Query Router Samples
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Interactive demonstrations of the hello-query router showcasing basic tRPC v11 patterns. 
            These samples demonstrate simple queries, input validation with Zod schemas, 
            and complex data serialization between Electron processes.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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

      {/* Features Overview */}
      <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Layers className="h-5 w-5" />
            Router Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Basic Connectivity</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Simple queries without parameters for basic setup verification
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Input Validation</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Zod schema validation with comprehensive error handling
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Code className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Data Serialization</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Complex data types and array handling across processes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            About Hello Query Router
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Basic Hello</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Simple connectivity testing without parameters, perfect for verifying 
                    the tRPC setup and basic request/response flow.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Hello with Name</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Input validation using Zod schemas, form state management, 
                    and comprehensive error handling patterns.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Echo Test</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complex data serialization testing with various data types 
                    to ensure proper communication between main and renderer processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Real-time Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Live query states, loading indicators, and error handling 
                    with React Query integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Development Tips */}
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Development Tips
                  </h4>
                  <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                    <p>
                      <strong>React Query DevTools:</strong> Use Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (macOS) 
                      to inspect query states, cache data, and network requests for these hello-query procedures.
                    </p>
                    <p>
                      <strong>Type Safety:</strong> All tRPC calls are fully type-safe with automatic TypeScript 
                      inference and IntelliSense support.
                    </p>
                    <p>
                      <strong>Error Handling:</strong> Comprehensive error handling with detailed error messages 
                      and validation feedback for better debugging.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ExternalLink className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              Explore tRPC docs
              <ArrowRight className="h-3 w-3" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              Add new procedures
              <ArrowRight className="h-3 w-3" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              Implement mutations
              <ArrowRight className="h-3 w-3" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              Add subscriptions
              <ArrowRight className="h-3 w-3" />
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelloQuerySamplesContainer;
