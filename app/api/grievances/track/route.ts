import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import Department from '@/models/Department'; // Department-ን populate ለማድረግ ይረዳል

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // ከ URL ላይ ticketId-ን መውሰድ (e.g., /api/grievances/track?ticketId=TMPC-123)
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: 'እባክዎ የ Ticket ID ያስገቡ' },
        { status: 400 }
      );
    }

    // ቅሬታውን በ Ticket ID መፈለግ
    const grievance = await Grievance.findOne({ ticketId: ticketId.trim() })
      .populate('departmentId', 'name code');

    if (!grievance) {
      return NextResponse.json(
        { success: false, message: 'በዚህ Ticket ID ምንም አይነት የተመዘገበ ቅሬታ አልተገኘም!' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: grievance }, { status: 200 });
  } catch (error: any) {
    console.error('Track Grievance Error:', error);
    return NextResponse.json(
      { success: false, message: 'ቅሬታውን መፈለግ አልተቻለም', error: error.message },
      { status: 500 }
    );
  }
}