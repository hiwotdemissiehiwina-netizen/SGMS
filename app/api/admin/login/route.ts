import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb'; // የዳታቤዝ ግንኙነት ማስተካከያ (እንደ ፕሮጀክት አወቃቀርዎ ሊለያይ ይችላል)
import Admin from '@/models/Admin';   // የ Mongoose Admin Model

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide username and password' },
        { status: 400 }
      );
    }

    // አድሚኑን በዩዘርናም መፈለግ
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // ፓስወርድ ማወዳደር (bcrypt ተጠቅመን)
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // የተሳካ ሎጊን ሪስፖንስ መመለስ
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: 'mock_secure_token_session', // ቶከን የሚጠቀሙ ከሆነ እዚህ ማስገባት ይቻላል
      admin: {
        username: admin.username,
        role: admin.role, // 'super-admin' ወይም 'admin' መሆኑን ዳታቤዙ ያመጣል
        department: admin.department || null,
      },
    });

  } catch (error: any) {
    console.error('Admin Login Server Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}