import { ReverseText, AddNumbers, SetStatus } from './index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface HelloMutationSamplesContainerProps {
  className?: string;
}

const HelloMutationSamplesContainer = ({ className }: HelloMutationSamplesContainerProps): React.JSX.Element => {
  return (
    <div className={cn('w-full h-full p-6', className)}>
      <Tabs defaultValue="reverse" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-8">
          <TabsTrigger value="reverse" className="text-base font-medium px-6 py-3">
            Reverse Text
          </TabsTrigger>
          <TabsTrigger value="add" className="text-base font-medium px-6 py-3">
            Add Numbers
          </TabsTrigger>
          <TabsTrigger value="status" className="text-base font-medium px-6 py-3">
            Set Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reverse" className="mt-0 h-full">
          <ReverseText />
        </TabsContent>

        <TabsContent value="add" className="mt-0 h-full">
          <AddNumbers />
        </TabsContent>

        <TabsContent value="status" className="mt-0 h-full">
          <SetStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelloMutationSamplesContainer;


