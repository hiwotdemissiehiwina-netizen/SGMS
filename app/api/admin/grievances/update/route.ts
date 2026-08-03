import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Grievance from '@/models/Grievance';

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, status, responseMessage } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ቅሬታ ID እና Status ያስፈልጋል' },
        { status: 400 }
      );
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return NextResponse.json(
        { success: false, message: 'ቅሬታው አልተገኘም' },
        { status: 404 }
      );
    }

    // Status ማስተካከል
    grievance.status = status;

    // ምላሽ ካለ መጨመር
    if (responseMessage && responseMessage.trim() !== '') {
      grievance.responses.push({
        message: responseMessage,
        createdAt: new Date(),
      });
    }

    await grievance.save();

    return NextResponse.json({
      success: true,
      message: 'የቅሬታው ሁኔታ በትክክል ተቀይሯል!',
      data: grievance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'ማስተካከል አልተቻለም', error: error.message },
      { status: 500 }
    );
  }
}