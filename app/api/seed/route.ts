import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectToDatabase();

    // ነባር ዲፓርትመንቶች ካሉ አጽድቶ በአዲሶቹ ለመተካት
    await Department.deleteMany({});

    // አዲሶቹ 10 ዲፓርትመንቶች
    const updatedDepartments = [
      { name: 'Aesthetics', code: 'AES', description: 'Department of Aesthetics & Beauty Therapy' },
      { name: 'Electrical & Electronics', code: 'EEE', description: 'Department of Electrical & Electronics Technology' },
      { name: 'ICT', code: 'ICT', description: 'Department of Information & Communication Technology' },
      { name: 'Textile & Garment', code: 'TEX', description: 'Department of Textile & Garment Technology' },
      { name: 'Hotel & Tourism', code: 'HTM', description: 'Department of Hotel & Tourism Management' },
      { name: 'Automotive Technology', code: 'AUTO', description: 'Department of Automotive Technology' },
      { name: 'Wood Work & Metal Technology', code: 'WMT', description: 'Department of Wood Work & Metal Technology' },
      { name: 'Business & Finance', code: 'BUS', description: 'Department of Business & Finance Services' },
      { name: 'Construction Technology', code: 'CONS', description: 'Department of Building & Construction Technology' },
      { name: 'Urban Agriculture', code: 'AGRI', description: 'Department of Urban Agriculture & Forestry' },
    ];

    const createdDepts = await Department.insertMany(updatedDepartments);

    return NextResponse.json({
      success: true,
      message: 'ዲፓርትመንቶቹ በ10ሩ አዳዲስ ዘርፎች በተሳካ ሁኔታ ተቀይረዋል!',
      data: createdDepts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}