import { NextResponse } from 'next/server';
import { supabase, shapeDepartment } from '@/lib/supabase';

export async function GET() {
  try {
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

    const createdDepts: any[] = [];

    for (const dept of updatedDepartments) {
      const { data: existing } = await supabase
        .from('departments')
        .select('id')
        .eq('code', dept.code)
        .maybeSingle();

      if (existing) {
        const { data: updated } = await supabase
          .from('departments')
          .update({ name: dept.name, description: dept.description })
          .eq('id', existing.id)
          .select('*')
          .maybeSingle();
        if (updated) createdDepts.push(shapeDepartment(updated));
      } else {
        const { data: inserted } = await supabase
          .from('departments')
          .insert(dept)
          .select('*')
          .maybeSingle();
        if (inserted) createdDepts.push(shapeDepartment(inserted));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Departments synced successfully!',
      data: createdDepts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
