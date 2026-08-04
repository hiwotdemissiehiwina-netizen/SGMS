import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb'; // ወይም እንደ ፎልደርህ ርቀት መጠን (../../../)
import Admin from '../../../../models/Admin'; // ወይም እንደ modelህ ቦታ

// 1. Next.js በ Build ወቅት Static Render እንዳያደርገው ይከላከላል
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Login Logic
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) { // ማስታወሻ: Password hashing (bcrypt) መጠቀም ይመረጣል
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        departmentId: admin.departmentId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}