import { NextResponse } from 'next/server';
import { supabase, generateTicketId, shapeGrievance } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      studentName,
      studentId,
      department,
      subject,
      message,
      isAnonymous,
    } = body;

    if (!department || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Department, subject and message are required' },
        { status: 400 }
      );
    }

    let departmentId: string | null = null;
    const { data: deptRow } = await supabase
      .from('departments')
      .select('id')
      .eq('name', department)
      .maybeSingle();
    if (deptRow) departmentId = deptRow.id;

    const ticketId = generateTicketId();

    const insertRow: any = {
      ticket_id: ticketId,
      student_name: studentName || 'Anonymous',
      student_id: studentId || 'N/A',
      department,
      department_id: departmentId,
      subject,
      message,
      description: message,
      is_anonymous: Boolean(isAnonymous),
      status: 'Pending',
      responses: [],
    };

    const { data: inserted, error } = await supabase
      .from('grievances')
      .insert(insertRow)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      { success: true, ticketId: inserted.ticket_id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const { data: row, error } = await supabase
      .from('grievances')
      .select('*, departments:department_id(*)')
      .eq('ticket_id', ticketId.trim())
      .maybeSingle();

    if (error) throw error;

    if (!row) {
      return NextResponse.json(
        { success: false, message: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ticket: shapeGrievance(row) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
