import { PrismaClient, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Complete project setup',
        description: 'Setup database, authentication, and UI',
        priority: Priority.HIGH,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write documentation',
        description: 'Create README and API docs',
        priority: Priority.MEDIUM,
        userId: user.id,
      },
    }),
  ]);

  console.log('Seed data created:', { user, tasks });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
