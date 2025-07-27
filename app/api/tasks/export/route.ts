import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import papaparse from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // ========== CSV EXPORT LOGIC ==========
    if (type === 'csv') {
      const formattedTasks = tasks.map((task) => ({
        Title: task.title,
        Description: task.description || '',
        Status: task.completed ? 'Completed' : 'Pending',
        Priority: task.priority,
        DueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : 'N/A',
      }));

      const csv = papaparse.unparse(formattedTasks);
      const headers = new Headers();
      headers.set('Content-Type', 'text/csv');
      headers.set('Content-Disposition', 'attachment; filename="tasks.csv"');
      return new NextResponse(csv, { headers });
    }

    // ========== PDF EXPORT LOGIC ==========
    if (type === 'pdf') {
      const doc = new jsPDF();

      // Document Title
      doc.setFontSize(18);
      doc.text('Task List', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated for: ${user.name || user.email}`, 14, 29);

      // Table Header
      const tableColumn = ['Title', 'Status', 'Priority', 'Due Date'];

      // Table Rows
      const tableRows: (string | null)[][] = [];
      tasks.forEach((task) => {
        const taskData = [
          task.title,
          task.completed ? 'Completed' : 'Pending',
          task.priority,
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
        ];
        tableRows.push(taskData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'striped', // design (grid, striped, plain)
        styles: { font: 'helvetica', halign: 'center' },
        headStyles: { fillColor: [22, 160, 133] }, // Header color
      });

      const pdfBuffer = doc.output('arraybuffer');

      // Response Headers for PDF
      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', 'attachment; filename="tasks.pdf"');

      return new NextResponse(pdfBuffer, { headers });
    }

    return NextResponse.json(
      { error: 'Invalid export type specified. Use ?type=csv or ?type=pdf' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export tasks' },
      { status: 500 }
    );
  }
}
