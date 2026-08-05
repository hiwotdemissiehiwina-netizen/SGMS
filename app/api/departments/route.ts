import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectToDatabase();
    const departments = await Department.find({}).sort({ name: 1 });
    
    return NextResponse.json({ success: true, data: departments }, { status: 200 });
  } catch (error: any) {
    console.error('Department GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'ዲፓርትመንቶችን ማግኘት አልተቻለም', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, code, description } = body;

    const newDept = await Department.create({ name, code, description });
    return NextResponse.json({ success: true, data: newDept }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'ዲፓርትመንት መፍጠር አልተቻለም', error: error.message },
      { status: 400 }
    );
  }
}