import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Grievance from '@/models/Grievance';

export async function PATCH(request: Request) {
  try {
    await connectMongo();

    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, message: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const updatedRequest = await Grievance.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error('UPDATE STATUS ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}