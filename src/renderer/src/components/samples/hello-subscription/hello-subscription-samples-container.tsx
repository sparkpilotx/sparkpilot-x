import { TickerStream, RandomNumberStream, EchoStream } from './index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface HelloSubscriptionSamplesContainerProps {
  className?: string;
}

const HelloSubscriptionSamplesContainer = ({ className }: HelloSubscriptionSamplesContainerProps): React.JSX.Element => {
  return (
    <div className={cn('w-full h-full p-6', className)}>
      <Tabs defaultValue="ticker" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-8">
          <TabsTrigger value="ticker" className="text-base font-medium px-6 py-3">
            Ticker
          </TabsTrigger>
          <TabsTrigger value="random" className="text-base font-medium px-6 py-3">
            Random Number
          </TabsTrigger>
          <TabsTrigger value="echo" className="text-base font-medium px-6 py-3">
            Echo Stream
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ticker" className="mt-0 h-full">
          <TickerStream />
        </TabsContent>

        <TabsContent value="random" className="mt-0 h-full">
          <RandomNumberStream />
        </TabsContent>

        <TabsContent value="echo" className="mt-0 h-full">
          <EchoStream />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelloSubscriptionSamplesContainer;


