import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // የትክክለኛ አድራሻህን ተጠቀም
import Grievance from '@/models/Grievance';

// 1. POST: አዲስ Ticket ID ፈጥሮ ቅሬታ ማስገባት
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 5-digit ራንደም ኮድ ማመንጨት (ለምሳሌ TMPC-8F32A)
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `TMPC-${randomCode}`;

    const newGrievance = await Grievance.create({
      ...body,
      ticketId,
    });

    return NextResponse.json({ 
      success: true, 
      ticketId: newGrievance.ticketId 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. GET: በ Ticket ID መፈለግ
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ success: false, message: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await Grievance.findOne({ ticketId });

    if (!ticket) {
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}