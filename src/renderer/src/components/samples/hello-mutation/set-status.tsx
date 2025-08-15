import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, RefreshCw, AlertCircle, Loader, Pause, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

type DemoStatus = 'idle' | 'processing' | 'done';

interface SetStatusProps {
  className?: string;
}

const statusToIcon = (status: DemoStatus): React.JSX.Element => {
  switch (status) {
    case 'idle':
      return <Pause className="h-5 w-5" />;
    case 'processing':
      return <Loader className="h-5 w-5 animate-spin" />;
    case 'done':
      return <CheckCircle className="h-5 w-5" />;
  }
};

const SetStatus = ({ className }: SetStatusProps): React.JSX.Element => {
  const [status, setStatus] = useState<DemoStatus>('idle');

  const mutation = useMutation({
    ...trpc.samples.helloMutation.setStatus.mutationOptions(),
  });

  const submit = (next: DemoStatus): void => {
    setStatus(next);
    mutation.mutate({ status: next });
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Play className="h-6 w-6 text-sky-500" />
              Set Status Mutation
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Demonstrates sending simple enum state to the server and receiving previous/current status.
            </CardDescription>
          </div>
          <Badge variant={mutation.data ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {mutation.isPending ? 'Updating...' : 'Ready'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Button variant={status === 'idle' ? 'default' : 'outline'} onClick={() => submit('idle')} disabled={mutation.isPending} className="h-12 text-base">
            {statusToIcon('idle')}<span className="ml-2">Idle</span>
          </Button>
          <Button variant={status === 'processing' ? 'default' : 'outline'} onClick={() => submit('processing')} disabled={mutation.isPending} className="h-12 text-base">
            {statusToIcon('processing')}<span className="ml-2">Processing</span>
          </Button>
          <Button variant={status === 'done' ? 'default' : 'outline'} onClick={() => submit('done')} disabled={mutation.isPending} className="h-12 text-base">
            {statusToIcon('done')}<span className="ml-2">Done</span>
          </Button>
        </div>

        {mutation.error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-destructive text-lg">Mutation Error</p>
                  <p className="text-base text-destructive/80">{mutation.error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mutation.data && (
          <Card className="border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                <CardTitle className="text-xl text-sky-800 dark:text-sky-200">Status Updated</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator className="bg-sky-200 dark:bg-sky-800" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Previous</Badge>
                  <p className="text-base font-medium text-sky-800 dark:text-sky-200">{mutation.data.previous}</p>
                </div>
                <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Current</Badge>
                  <p className="text-base font-medium text-sky-800 dark:text-sky-200">{mutation.data.current}</p>
                </div>
                <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Changed</Badge>
                  <p className="text-base font-medium text-sky-800 dark:text-sky-200">{mutation.data.changed ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className="text-sm text-sky-600 dark:text-sky-400 text-center">
                Timestamp: {new Date(mutation.data.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default SetStatus;


