import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectMongo from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import Admin from '@/models/Admin';

export async function GET(request: Request) {
  try {
    await connectMongo();

    // 1. የገባውን Admin Username ከ URL Query ወይም ከ Cookie ማግኘት
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required to fetch department data.' },
        { status: 400 }
      );
    }

    // 2. የዲኑን አካውንት መፈለግ እና Department መረጃውን ማምጣት
    const admin = await Admin.findOne({ username }).populate('departmentId');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin account not found.' },
        { status: 404 }
      );
    }

    // 3. የዚህ ዲን ዲፓርትመንት የሆኑ ቅሬታዎችን ብቻ (Filtering) ማምጣት
    const grievances = await Grievance.find({ departmentId: admin.departmentId?._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      adminName: admin.fullName,
      department: admin.departmentId,
      grievances,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}