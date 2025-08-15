import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus, RefreshCw, CheckCircle, AlertCircle, Hash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface AddNumbersProps {
  className?: string;
}

const AddNumbers = ({ className }: AddNumbersProps): React.JSX.Element => {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');

  const mutation = useMutation({
    ...trpc.samples.helloMutation.addNumbers.mutationOptions(),
  });

  const isValidNumber = (value: string): boolean => {
    if (value.trim() === '') return false;
    return !Number.isNaN(Number(value));
  };

  const canSubmit = isValidNumber(a) && isValidNumber(b);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!canSubmit) return;
    mutation.mutate({ a: Number(a), b: Number(b) });
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Plus className="h-6 w-6 text-orange-500" />
              Add Numbers Mutation
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Demonstrates a simple mutation with numeric validation and result metadata.
            </CardDescription>
          </div>
          <Badge variant={mutation.data ? 'default' : canSubmit ? 'secondary' : 'destructive'} className="text-sm px-3 py-1">
            {mutation.data ? 'Completed' : canSubmit ? 'Ready' : 'Invalid'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <Plus className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Enter Numbers
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="num-a" className="flex items-center gap-3 text-base">
                    <Hash className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Number A
                  </Label>
                  <Input
                    id="num-a"
                    type="number"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="Enter number A"
                    className="h-12 text-base border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="num-b" className="flex items-center gap-3 text-base">
                    <Hash className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Number B
                  </Label>
                  <Input
                    id="num-b"
                    type="number"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="Enter number B"
                    className="h-12 text-base border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" disabled={mutation.isPending || !canSubmit} className="flex-1 h-12 text-base">
                  {mutation.isPending ? (
                    <>
                      <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-3 h-5 w-5" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

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
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <CardTitle className="text-xl text-orange-800 dark:text-orange-200">Sum Calculated</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator className="bg-orange-200 dark:bg-orange-800" />
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">A</Badge>
                  <p className="text-base font-medium text-orange-800 dark:text-orange-200">{mutation.data.a}</p>
                </div>
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">B</Badge>
                  <p className="text-base font-medium text-orange-800 dark:text-orange-200">{mutation.data.b}</p>
                </div>
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Sum</Badge>
                  <p className="text-base font-medium text-orange-800 dark:text-orange-200">{mutation.data.sum}</p>
                </div>
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400 text-center">
                Total additions performed: {mutation.data.operations}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AddNumbers;


