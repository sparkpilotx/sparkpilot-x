import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';

interface IdeasSamplesContainerProps {
  className?: string;
}

const IdeasSamplesContainer = ({ className }: IdeasSamplesContainerProps): React.JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const ideasQuery = useQuery(trpc.ideas.list.queryOptions());
  const createIdea = useMutation(trpc.ideas.create.mutationOptions());
  const deleteIdea = useMutation(trpc.ideas.delete.mutationOptions());

  const isCreateDisabled = useMemo(() => title.trim().length === 0, [title]);

  const handleCreate = async (): Promise<void> => {
    if (isCreateDisabled) return;
    await createIdea.mutateAsync({ title: title.trim(), content: content.trim() || undefined });
    setTitle('');
    setContent('');
    await ideasQuery.refetch();
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteIdea.mutateAsync({ id });
    await ideasQuery.refetch();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ideas (Prisma/Postgres)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="idea-title">Title</Label>
            <Input id="idea-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quick idea title" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="idea-content">Content</Label>
            <Input id="idea-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCreate} disabled={isCreateDisabled || createIdea.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          {ideasQuery.isLoading && <div className="text-muted-foreground">Loading ideas…</div>}
          {ideasQuery.error && <div className="text-destructive">{ideasQuery.error.message}</div>}
          {ideasQuery.data?.length === 0 && <div className="text-muted-foreground">No ideas yet.</div>}
          {ideasQuery.data?.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <div className="font-medium">{idea.title}</div>
                {idea.content && <div className="text-sm text-muted-foreground">{idea.content}</div>}
              </div>
              <Button variant="outline" size="icon" onClick={() => handleDelete(idea.id)} disabled={deleteIdea.isPending}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasSamplesContainer;


