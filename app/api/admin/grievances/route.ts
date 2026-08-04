import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Grievance from '../../../../models/Grievance';
import Department from '../../../../models/Department';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const grievances = await Grievance.find({})
      .populate('departmentId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, grievances });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}