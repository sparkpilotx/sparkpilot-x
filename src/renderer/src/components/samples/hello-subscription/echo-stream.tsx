import { useEffect, useRef, useState } from 'react';
import { Quote, Play, Pause, Hash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpcClient } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface EchoStreamProps {
  className?: string;
}

const EchoStream = ({ className }: EchoStreamProps): React.JSX.Element => {
  const [text, setText] = useState<string>('Hello SSE');
  const [times, setTimes] = useState<number>(5);
  const [intervalMs, setIntervalMs] = useState<number>(500);
  const [active, setActive] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ index: number; text: string; timestamp: string }>>([]);
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
    const unsub = trpcClient.samples.helloSubscription.echo.subscribe(
      { text, times, intervalMs },
      {
        onData: (data) => {
          setMessages((prev) => [
            ...prev,
            { index: data.index, text: data.text, timestamp: new Date(data.timestamp).toLocaleTimeString() },
          ]);
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
              <Quote className="h-6 w-6 text-violet-500" />
              Echo Subscription
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Repeats a message a number of times at a given interval.
            </CardDescription>
          </div>
          <Badge variant={active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {active ? 'Live' : 'Idle'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="text" className="text-base">Text</Label>
                <Input id="text" type="text" value={text} onChange={(e) => setText(e.target.value)} className="h-12 text-base" />
              </div>
              <div>
                <Label htmlFor="times" className="text-base">Times</Label>
                <Input id="times" type="number" value={times} onChange={(e) => setTimes(Number(e.target.value) || 5)} className="h-12 text-base" min={1} max={20} />
              </div>
              <div>
                <Label htmlFor="interval" className="text-base">Interval (ms)</Label>
                <Input id="interval" type="number" value={intervalMs} onChange={(e) => setIntervalMs(Number(e.target.value) || 500)} className="h-12 text-base" min={100} max={2000} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={start} className="h-12 text-base flex-1" disabled={active}>
                <Play className="mr-3 h-5 w-5" /> Start
              </Button>
              <Button onClick={stop} variant="outline" className="h-12 text-base flex-1" disabled={!active}>
                <Pause className="mr-3 h-5 w-5" /> Stop
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {messages.map((m) => (
                <div key={`${m.index}-${m.timestamp}`} className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <div className="text-sm opacity-70 mb-1">#{m.index} • {m.timestamp}</div>
                  <div className="text-base font-medium">{m.text}</div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-sm opacity-70">No messages yet…</div>
              )}
            </div>
            <Separator />
            <div className="text-sm text-violet-700 dark:text-violet-300">Automatic complete after the specified count</div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default EchoStream;


