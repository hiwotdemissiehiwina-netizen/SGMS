import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Grievance from '@/models/Grievance';

function generateTicketId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TMPC-${randomStr}`;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { departmentId, category, description, isAnonymous, studentId } = body;

    if (!departmentId || !category || !description) {
      return NextResponse.json(
        { success: false, message: 'እባክዎን ሁሉንም አስፈላጊ መረጃዎች ይሙሉ' },
        { status: 400 }
      );
    }

    const ticketId = generateTicketId();

    const grievance = await Grievance.create({
      ticketId,
      departmentId,
      category,
      description,
      isAnonymous: Boolean(isAnonymous),
      studentId: isAnonymous ? null : studentId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'ቅሬታዎ በተሳካ ሁኔታ ተልኳል!',
        ticketId: grievance.ticketId,
        data: grievance,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'ቅሬታውን መላክ አልተቻለም', error: error.message },
      { status: 500 }
    );
  }
}