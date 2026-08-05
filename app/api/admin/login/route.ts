import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase, shapeAdmin, shapeDepartment } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide username and password' },
        { status: 400 }
      );
    }

    const { data: adminRow, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;

    if (!adminRow) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, adminRow.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    let department = null;
    if (adminRow.department_id) {
      const { data: deptRow } = await supabase
        .from('departments')
        .select('*')
        .eq('id', adminRow.department_id)
        .maybeSingle();
      if (deptRow) department = shapeDepartment(deptRow);
    }

    const admin = shapeAdmin(adminRow, department);

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      token: 'mock_secure_token_session',
      admin: {
        username: admin.username,
        role: admin.role,
        department: admin.department,
      },
    });

    // Set cookies so server-side middleware can authenticate/authorize admin routes
    res.cookies.set('adminToken', 'mock_secure_token_session', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set('adminRole', admin.role, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    console.error('Admin Login Server Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
