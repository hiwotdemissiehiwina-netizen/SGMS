import { NextResponse } from 'next/server';
import { supabase, shapeGrievance } from '@/lib/supabase';

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
        { success: false, message: 'No grievance found with this Ticket ID!' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: shapeGrievance(row) }, { status: 200 });
  } catch (error: any) {
    console.error('Track Grievance Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track grievance', error: error.message },
      { status: 500 }
    );
  }
}
