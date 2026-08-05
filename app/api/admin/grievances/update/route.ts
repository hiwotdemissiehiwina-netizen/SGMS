import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Grievance from '../../../../../models/Grievance';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { grievanceId, status } = body;

    if (!grievanceId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      grievanceId,
      { status },
      { new: true }
    );

    if (!updatedGrievance) {
      return NextResponse.json(
        { success: false, message: 'Grievance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      grievance: updatedGrievance,
    });
  } catch (error) {
    console.error('Update Grievance Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}