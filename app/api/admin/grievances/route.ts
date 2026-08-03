import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectToDatabase();

    // ሁሉንም ቅሬታዎች ከዲፓርትመንት መረጃቸው ጋር ማምጣት
    const grievances = await Grievance.find({})
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: grievances }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'ቅሬታዎችን ማምጣት አልተቻለም', error: error.message },
      { status: 500 }
    );
  }
}