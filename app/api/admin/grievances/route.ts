import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';// ወይም የራስህ dbConnect ያለበት path (ለምሳሌ '../../../lib/dbConnect')
import Grievance from '@/models/Grievance'; // ወይም የራስህ model path

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectMongo();
    
    // Grievances fetch የማድረግ ስራ
    const grievances = await Grievance.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, grievances });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}