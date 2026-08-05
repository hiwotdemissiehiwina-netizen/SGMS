import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { currentUsername, newUsername, currentPassword, newPassword } = await req.json();

    if (!currentUsername || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const finalNewUsername = (newUsername || currentUsername).trim();

    const { data: admin, error: findError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', currentUsername)
      .maybeSingle();

    if (findError) throw findError;

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Current account not found' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    if (finalNewUsername !== currentUsername) {
      const { data: conflict } = await supabase
        .from('admins')
        .select('id')
        .eq('username', finalNewUsername)
        .maybeSingle();
      if (conflict) {
        return NextResponse.json(
          { success: false, message: 'That username is already taken' },
          { status: 400 }
        );
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('admins')
      .update({
        username: finalNewUsername,
        password: hashed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', admin.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Username & Password updated successfully!',
      newUsername: finalNewUsername,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update credentials' },
      { status: 500 }
    );
  }
}
