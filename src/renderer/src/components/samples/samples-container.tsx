import HelloQuerySamplesContainer from './hello-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Layers, 
  Code, 
  Zap, 
  Shield, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Monitor, 
  Database,
  GitBranch,
  Rocket,
  BookOpen,
  Terminal,
  Settings,
  RefreshCw
} from 'lucide-react';

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
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element containing all router sample containers in an organized layout
 */
const SamplesContainer = ({ className }: SamplesContainerProps): React.JSX.Element => {
  return (
    <div className={`w-full min-h-screen bg-background ${className || ''}`}>
      {/* Hero Header */}
      <Card className="w-full max-w-7xl mx-auto m-6 mb-8 border-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                tRPC v11
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Electron
              </Badge>
            </div>
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            tRPC v11 Sample Routers
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Interactive demonstrations of tRPC v11 features organized by router. 
            Each router showcases different aspects of type-safe API communication, 
            input validation, error handling, and React Query integration in Electron applications.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Router Samples */}
      <div className="space-y-12 px-6">
        {/* Hello Query Router Samples */}
        <section>
          <HelloQuerySamplesContainer />
        </section>

        {/* Future Router Placeholders */}
        <Card className="border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full w-fit mx-auto">
                <GitBranch className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  More Router Samples Coming Soon
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Additional router samples will be added here to demonstrate more advanced tRPC patterns, 
                  mutations, subscriptions, and real-world use cases.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  User Management
                </Badge>
                <Badge variant="outline" className="text-xs">
                  File Operations
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Real-time Updates
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Authentication
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-7xl mx-auto p-6 pt-12">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Layers className="h-6 w-6" />
              About tRPC v11 Integration
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Comprehensive architecture overview and development tools for building type-safe APIs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Architecture Section */}
              <Card className="border-blue-200 bg-blue-100/50 dark:border-blue-800 dark:bg-blue-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Database className="h-4 w-4" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Zap className="h-3 w-3" />
                    <span>Standalone HTTP server in main process</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Monitor className="h-3 w-3" />
                    <span>React Query client with split transport</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Shield className="h-3 w-3" />
                    <span>Type-safe communication via shared types</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Code className="h-3 w-3" />
                    <span>Superjson for complex data serialization</span>
                  </div>
                </CardContent>
              </Card>

              {/* Development Tools Section */}
              <Card className="border-purple-200 bg-purple-100/50 dark:border-purple-800 dark:bg-purple-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Terminal className="h-4 w-4" />
                    Development Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                    <Settings className="h-3 w-3" />
                    <span>React Query DevTools (Ctrl+Shift+D / Cmd+Shift+D)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                    <Code className="h-3 w-3" />
                    <span>TypeScript integration for full type safety</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                    <Shield className="h-3 w-3" />
                    <span>Zod schema validation with detailed errors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                    <RefreshCw className="h-3 w-3" />
                    <span>Hot reload support for rapid development</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-blue-200 dark:bg-blue-800" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Get Started
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <BookOpen className="h-3 w-3" />
                  tRPC Documentation
                  <ArrowRight className="h-3 w-3" />
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <ExternalLink className="h-3 w-3" />
                  React Query Guide
                  <ArrowRight className="h-3 w-3" />
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Code className="h-3 w-3" />
                  TypeScript Handbook
                  <ArrowRight className="h-3 w-3" />
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SamplesContainer;