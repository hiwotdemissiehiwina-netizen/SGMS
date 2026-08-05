import { NextResponse } from 'next/server';
import { supabase, shapeGrievance } from '@/lib/supabase';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Fetch all grievances with department join
    const { data: rows, error } = await supabase
      .from('grievances')
      .select('*, departments:department_id(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const now = Date.now();
    const threeDaysAgo = new Date(now - THREE_DAYS_MS).toISOString();

    // Auto-escalate overdue Pending grievances (3+ days)
    const overdueIds: string[] = [];
    for (const row of rows || []) {
      const isOverdue =
        row.status === 'Pending' &&
        !row.is_escalated &&
        new Date(row.created_at).getTime() <= now - THREE_DAYS_MS;
      if (isOverdue) overdueIds.push(row.id);
    }

    if (overdueIds.length > 0) {
      await supabase
        .from('grievances')
        .update({ is_escalated: true, status: 'Escalated', updated_at: new Date().toISOString() })
        .in('id', overdueIds);

      // Re-fetch to reflect escalation
      const { data: refreshed } = await supabase
        .from('grievances')
        .select('*, departments:department_id(*)')
        .order('created_at', { ascending: false });
      if (refreshed) rows.splice(0, rows.length, ...refreshed);
    }

    const grievances = (rows || []).map((row) => shapeGrievance(row));

    const stats = {
      total: grievances.length,
      pending: grievances.filter((g) => g.status === 'Pending').length,
      inProgress: grievances.filter((g) => g.status === 'In Progress').length,
      resolved: grievances.filter((g) => g.status === 'Resolved').length,
      escalated: grievances.filter(
        (g) => g.status === 'Escalated' || g.isEscalated
      ).length,
    };

    let adminName = 'Super Admin';
    if (username) {
      const { data: adminRow } = await supabase
        .from('admins')
        .select('full_name')
        .eq('username', username)
        .maybeSingle();
      if (adminRow) adminName = adminRow.full_name;
    }

    return NextResponse.json({
      success: true,
      adminName,
      grievances,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
