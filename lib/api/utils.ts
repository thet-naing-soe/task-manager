export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('An unexpected network error occurred');
    }
  }
  return response.json();
}

export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

export function convertToDate(
  dateValue: string | Date | null | undefined
): Date | null {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;

  try {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
