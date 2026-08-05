import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    await connectMongo();
    const { username, password, fullName, departmentId } = await request.json();

    if (!username || !password || !fullName || !departmentId) {
      return NextResponse.json(
        { success: false, message: 'All fields are required!' },
        { status: 400 }
      );
    }

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already exists!' },
        { status: 400 }
      );
    }

    const newAdmin = await Admin.create({
      username,
      password,
      fullName,
      role: 'ADMIN',
      departmentId,
    });

    return NextResponse.json({
      success: true,
      message: `Account created for ${fullName}!`,
      admin: newAdmin,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}