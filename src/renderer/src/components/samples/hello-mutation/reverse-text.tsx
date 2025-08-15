import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeftRight, RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface ReverseTextProps {
  className?: string;
}

const ReverseText = ({ className }: ReverseTextProps): React.JSX.Element => {
  const [text, setText] = useState('');

  const mutation = useMutation({
    ...trpc.samples.helloMutation.reverseText.mutationOptions(),
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate({ text: text.trim() });
  };

  const getValidationStatus = (): 'valid' | 'invalid' | 'empty' => {
    if (!text.trim()) return 'empty';
    if (text.trim().length < 1 || text.trim().length > 200) return 'invalid';
    return 'valid';
  };

  const getValidationMessage = (): string => {
    const status = getValidationStatus();
    switch (status) {
      case 'valid':
        return 'Input is valid and ready to submit';
      case 'invalid':
        return 'Length must be 1-200 characters';
      case 'empty':
        return 'Please enter some text to continue';
      default:
        return '';
    }
  };

  const getValidationColor = (): string => {
    const status = getValidationStatus();
    switch (status) {
      case 'valid':
        return 'text-green-600 dark:text-green-400';
      case 'invalid':
        return 'text-red-600 dark:text-red-400';
      case 'empty':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl">
              <ArrowLeftRight className="h-6 w-6 text-emerald-500" />
              Reverse Text Mutation
            </CardTitle>
            <CardDescription className="text-base mt-2">
              tRPC mutation with Zod input validation and optimistic UX.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {text.trim() ? `${text.trim().length}/200` : '0/200'}
            </Badge>
            <Badge variant={mutation.data ? 'default' : getValidationStatus() === 'valid' ? 'secondary' : 'destructive'} className="text-sm px-3 py-1">
              {mutation.data ? 'Completed' : getValidationStatus() === 'valid' ? 'Ready' : 'Invalid'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <ArrowLeftRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Enter Text
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="reverse-input" className="flex items-center gap-3 text-base">
                  <ArrowLeftRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Text
                </Label>
                <Input
                  id="reverse-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to reverse"
                  className={cn(
                    'h-12 text-base border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500',
                    getValidationStatus() === 'valid' ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : '',
                    getValidationStatus() === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  )}
                  maxLength={200}
                />
                <div className="flex items-center gap-3">
                  <Info className={`h-4 w-4 ${getValidationColor()}`} />
                  <p className={`text-sm ${getValidationColor()}`}>{getValidationMessage()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" disabled={mutation.isPending || getValidationStatus() !== 'valid'} className="flex-1 h-12 text-base">
                  {mutation.isPending ? (
                    <>
                      <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="mr-3 h-5 w-5" />
                      Reverse
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
          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-xl text-emerald-800 dark:text-emerald-200">Text Reversed</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator className="bg-emerald-200 dark:bg-emerald-800" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Original</Badge>
                  <p className="text-base font-medium text-emerald-800 dark:text-emerald-200">{mutation.data.original}</p>
                </div>
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <Badge variant="outline" className="text-sm px-3 py-1 mb-2">Reversed</Badge>
                  <p className="text-base font-medium text-emerald-800 dark:text-emerald-200">{mutation.data.reversed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ReverseText;


