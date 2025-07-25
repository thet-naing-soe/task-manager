'use client';

import { useParams } from 'next/navigation';
import { useTask } from '@/hooks/use-tasks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TaskDetailSkeleton } from '@/components/tasks/task-skeleton';
import { FileText, Calendar, CheckCircle, Circle, Tag } from 'lucide-react';
import { PRIORITY_STYLES } from '@/lib/constants/tasks';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const { data: task, isLoading, error } = useTask(taskId);

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!task) {
    return (
      <EmptyState
        title="Task Not Found"
        message="The task you are looking for does not exist or you do not have
            permission to view it."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{task.title}</CardTitle>
        {task.description && (
          <CardDescription className="flex items-start pt-2">
            <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
            <span>{task.description}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          {task.completed ? (
            <CheckCircle className="h-5 w-5 mr-2 text-green-500 " />
          ) : (
            <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
          )}
          <span
            className={
              task.completed
                ? 'text-green-500 font-semibold'
                : 'text-muted-foreground'
            }
          >
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        <div className="flex items-center">
          <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
          <Badge className={PRIORITY_STYLES[task.priority]}>
            {task.priority.toLowerCase()}
          </Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center">
            <Calendar />
            <span>Due on {format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
          </div>
        )}
        <div className="text-sm text-muted-foreground pt-4">
          Created on {format(new Date(task.createdAt), 'PPpp')}
        </div>
      </CardContent>
    </Card>
  );
}
