import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Department from '@/models/Department';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    await connectMongo();

    // Safety check to make sure Department schema is explicitly registered before populate
    if (!Department) {
      console.log('Department model initialized.');
    }

    const body = await request.json();
    const username = body.username ? String(body.username).trim() : '';
    const password = body.password ? String(body.password).trim() : '';

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'እባክዎን ዩዘርኔም እና ፓስወርድ ያስገቡ!' },
        { status: 400 }
      );
    }

    // 1. Find Admin and populate Department
    const admin = await Admin.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    }).populate('departmentId');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password!' },
        { status: 401 }
      );
    }

    // 2. Direct Plain Text Password Match
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password!' },
        { status: 401 }
      );
    }

    // 3. Success Response
    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
        department: admin.departmentId || null,
      },
    });

  } catch (error: any) {
    console.error('LOGIN API ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}