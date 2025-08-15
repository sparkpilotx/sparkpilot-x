import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Timer, Play, Pause, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpc, trpcClient } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface TickerStreamProps {
  className?: string;
}

const TickerStream = ({ className }: TickerStreamProps): React.JSX.Element => {
  const [intervalMs, setIntervalMs] = useState<number>(1000);
  const [active, setActive] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
  const [lastIso, setLastIso] = useState<string>('');
  type Unsubscribe = (() => void) | { unsubscribe: () => void } | null;
  const unsubscribeRef = useRef<Unsubscribe>(null);

  const callUnsubscribe = (value: Unsubscribe): void => {
    if (!value) return;
    if (typeof value === 'function') {
      value();
    } else if (typeof value === 'object' && 'unsubscribe' in value && typeof value.unsubscribe === 'function') {
      value.unsubscribe();
    }
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      callUnsubscribe(unsubscribeRef.current);
    };
  }, []);

  const start = (): void => {
    callUnsubscribe(unsubscribeRef.current);
    const unsub = trpcClient.samples.helloSubscription.ticker.subscribe(
      { intervalMs },
      {
        onData: (data) => {
          setTick(data.tick);
          setLastIso(data.iso);
        },
        onError: () => {
          setActive(false);
        },
        onComplete: () => {
          setActive(false);
        },
      }
    );
    unsubscribeRef.current = unsub;
    setActive(true);
  };

  const stop = (): void => {
    callUnsubscribe(unsubscribeRef.current);
    unsubscribeRef.current = null;
    setActive(false);
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Timer className="h-6 w-6 text-teal-500" />
              Ticker Subscription
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Subscribes to a server-side ticker stream via SSE.
            </CardDescription>
          </div>
          <Badge variant={active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {active ? 'Live' : 'Idle'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="interval" className="text-sm mb-2 block">
                  Interval (ms)
                </label>
                <Input
                  id="interval"
                  type="number"
                  value={intervalMs}
                  onChange={(e) => setIntervalMs(Number(e.target.value) || 1000)}
                  className="h-12 text-base border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  min={250}
                  max={5000}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={start} className="h-12 text-base flex-1" disabled={active}>
                  <Play className="mr-3 h-5 w-5" /> Start
                </Button>
                <Button onClick={stop} variant="outline" className="h-12 text-base flex-1" disabled={!active}>
                  <Pause className="mr-3 h-5 w-5" /> Stop
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: trpc.samples.helloQuery.hello.queryKey() })}
                  variant="outline"
                  className="h-12 text-base w-full"
                >
                  <RefreshCw className="mr-3 h-5 w-5" /> Invalidate Hello Query
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Latest Tick</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <div className="text-sm opacity-70">Tick</div>
                <div className="text-lg font-medium">{tick}</div>
              </div>
              <div className="p-4 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <div className="text-sm opacity-70">ISO</div>
                <div className="text-lg font-medium">{lastIso || '—'}</div>
              </div>
            </div>
            <Separator className="bg-teal-200 dark:bg-teal-800" />
            <div className="text-sm text-teal-700 dark:text-teal-300">Streaming via SSE</div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TickerStream;


