import { BasicHello, HelloWithName, EchoTest } from './index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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
 * - Tabbed interface for organized sample navigation
 * - Clean separation between different sample types
 * - Improved UX with focused sample viewing
 * - Enhanced UI with shadcn/ui components
 * 
 * @param props - Component properties
 * @returns JSX element containing hello-query sample components in organized tabs
 */
const HelloQuerySamplesContainer = ({ className }: HelloQuerySamplesContainerProps): React.JSX.Element => {
  return (
    <div className={cn("w-full h-full p-6", className)}>
      <Tabs defaultValue="basic" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-8">
          <TabsTrigger value="basic" className="text-base font-medium px-6 py-3">
            Basic Hello
          </TabsTrigger>
          <TabsTrigger value="name" className="text-base font-medium px-6 py-3">
            With Name
          </TabsTrigger>
          <TabsTrigger value="echo" className="text-base font-medium px-6 py-3">
            Echo Test
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-0 h-full">
          <BasicHello />
        </TabsContent>
        
        <TabsContent value="name" className="mt-0 h-full">
          <HelloWithName />
        </TabsContent>
        
        <TabsContent value="echo" className="mt-0 h-full">
          <EchoTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelloQuerySamplesContainer;
