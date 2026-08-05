import { NextResponse } from 'next/server';
import { supabase, shapeDepartment } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const departments = (rows || []).map((row) => shapeDepartment(row));

    return NextResponse.json({ success: true, data: departments }, { status: 200 });
  } catch (error: any) {
    console.error('Department GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load departments', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, message: 'Name and code are required' },
        { status: 400 }
      );
    }

    const { data: row, error } = await supabase
      .from('departments')
      .insert({ name, code, description })
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: shapeDepartment(row) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create department', error: error.message },
      { status: 400 }
    );
  }
}
