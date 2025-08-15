import { useEffect, useRef, useState } from 'react';
import { ActivitySquare, Play, Pause } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpcClient } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface RandomNumberStreamProps {
  className?: string;
}

const RandomNumberStream = ({ className }: RandomNumberStreamProps): React.JSX.Element => {
  const [intervalMs, setIntervalMs] = useState<number>(750);
  const [active, setActive] = useState<boolean>(false);
  const [values, setValues] = useState<number[]>([]);
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

  useEffect(() => {
    return () => {
      callUnsubscribe(unsubscribeRef.current);
    };
  }, []);

  const start = (): void => {
    callUnsubscribe(unsubscribeRef.current);
    const unsub = trpcClient.samples.helloSubscription.randomNumber.subscribe(
      { intervalMs },
      {
        onData: (data) => {
          setValues((prev) => [...prev.slice(-19), data.value]);
        },
        onError: () => setActive(false),
        onComplete: () => setActive(false),
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
              <ActivitySquare className="h-6 w-6 text-fuchsia-500" />
              Random Number Subscription
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Streams random values; keeps the last 20 for display.
            </CardDescription>
          </div>
          <Badge variant={active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {active ? 'Live' : 'Idle'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="interval" className="text-sm mb-2 block">
              Interval (ms)
            </label>
            <Input
              id="interval"
              type="number"
              value={intervalMs}
              onChange={(e) => setIntervalMs(Number(e.target.value) || 750)}
              className="h-12 text-base"
              min={100}
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
        </div>

        <Separator />

        <div className="grid grid-cols-5 gap-3">
          {values.map((v, i) => (
            <div key={`${i}-${v}`} className="p-3 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 text-center">
              {v.toFixed(3)}
            </div>
          ))}
          {values.length === 0 && <div className="text-sm opacity-70">No values yet…</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default RandomNumberStream;


