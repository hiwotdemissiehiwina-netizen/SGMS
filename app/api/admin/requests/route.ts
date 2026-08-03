import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import Department from '@/models/Department';

export async function GET(request: Request) {
  try {
    await connectMongo();

    if (!Department) {
      console.log('Department model loaded');
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    console.log('-----------------------------------------');
    console.log('FETCH REQUEST FOR DEPT ID:', departmentId);

    if (!departmentId) {
      return NextResponse.json(
        { success: false, message: 'Department ID is required' },
        { status: 400 }
      );
    }

    const requests = await Grievance.find({ departmentId }).sort({ createdAt: -1 });

    console.log('FOUND REQUESTS COUNT:', requests.length);
    console.log('-----------------------------------------');

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