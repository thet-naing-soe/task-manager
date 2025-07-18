import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRIORITY_OPTIONS } from '@/lib/constants/tasks';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  isPending: boolean;
}

export function TitleField<T extends FieldValues>({
  control,
  isPending,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={'title' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., Finalize project report"
              {...field}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DescriptionField<T extends FieldValues>({
  control,
  isPending,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={'description' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add more details... (optional)"
              {...field}
              value={field.value || ''}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PriorityField<T extends FieldValues>({
  control,
  isPending,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={'priority' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isPending}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DueDateField<T extends FieldValues>({
  control,
  isPending,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={'dueDate' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Due Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              value={field.value || ''}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
