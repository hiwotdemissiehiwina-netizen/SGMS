import { NextResponse } from 'next/server';
import { supabase, shapeGrievance } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('grievances')
      .select('*, departments:department_id(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const grievances = (rows || []).map((row) => shapeGrievance(row));

    return NextResponse.json({ success: true, grievances });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}
