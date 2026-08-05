import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, responseMessage } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch current responses
    const { data: current, error: fetchError } = await supabase
      .from('grievances')
      .select('responses')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!current) {
      return NextResponse.json(
        { success: false, message: 'Grievance not found' },
        { status: 404 }
      );
    }

    const existingResponses: any[] = Array.isArray(current.responses) ? current.responses : [];

    let update: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (responseMessage) {
      update.responses = [
        ...existingResponses,
        {
          responderName: 'Super Admin',
          message: responseMessage,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    if (status === 'Resolved') {
      update.is_escalated = false;
    }

    const { data: updated, error } = await supabase
      .from('grievances')
      .update(update)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      grievance: updated,
    });
  } catch (error: any) {
    console.error('Update Grievance Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { grievanceId, status } = body;

    if (!grievanceId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabase
      .from('grievances')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', grievanceId)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Grievance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      grievance: updated,
    });
  } catch (error: any) {
    console.error('Update Grievance Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
