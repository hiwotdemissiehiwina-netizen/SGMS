import { NextResponse } from 'next/server';
import { supabase, shapeGrievance } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    if (!departmentId) {
      return NextResponse.json(
        { success: false, message: 'Department ID is required' },
        { status: 400 }
      );
    }

    const { data: rows, error } = await supabase
      .from('grievances')
      .select('*, departments:department_id(*)')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const requests = (rows || []).map((row) => shapeGrievance(row));

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error: any) {
    console.error('FETCH REQUESTS ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
