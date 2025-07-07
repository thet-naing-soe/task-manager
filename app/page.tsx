export default function Home() {
  const title = 'Task Manager';
  const unused = 'This should show ESLint warning';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome to your task management system
      </p>
    </main>
  );
}
