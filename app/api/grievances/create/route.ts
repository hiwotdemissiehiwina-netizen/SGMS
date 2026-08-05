import { NextResponse } from 'next/server';
import { supabase, generateTicketId, shapeGrievance } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { departmentId, category, description, isAnonymous, studentId } = body;

    if (!departmentId || !category || !description) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const ticketId = generateTicketId();

    const insertRow: any = {
      ticket_id: ticketId,
      department_id: departmentId,
      category,
      description,
      message: description,
      is_anonymous: Boolean(isAnonymous),
      student_id: isAnonymous ? null : studentId || null,
      student_name: isAnonymous ? 'Anonymous' : 'N/A',
      status: 'Pending',
      responses: [],
    };

    const { data: row, error } = await supabase
      .from('grievances')
      .insert(insertRow)
      .select('*, departments:department_id(*)')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: 'Grievance submitted successfully!',
        ticketId: row.ticket_id,
        data: shapeGrievance(row),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit grievance', error: error.message },
      { status: 500 }
    );
  }
}
