import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase, shapeAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password, fullName, departmentId } = await request.json();

    if (!username || !password || !fullName || !departmentId) {
      return NextResponse.json(
        { success: false, message: 'All fields are required!' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Username already exists!' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: row, error } = await supabase
      .from('admins')
      .insert({
        username,
        password: hashedPassword,
        full_name: fullName,
        role: 'department_admin',
        department_id: departmentId,
      })
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Account created for ${fullName}!`,
      admin: shapeAdmin(row),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
