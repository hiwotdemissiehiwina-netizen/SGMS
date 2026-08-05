import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request) {
  try {
    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, message: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabase
      .from('grievances')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      request: {
        _id: updated.id,
        status: updated.status,
      },
    });
  } catch (error: any) {
    console.error('UPDATE STATUS ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
