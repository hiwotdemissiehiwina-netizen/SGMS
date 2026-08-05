import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

export function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TMPC-${randomStr}`;
}

export function shapeGrievance(row: any) {
  return {
    _id: row.id,
    ticketId: row.ticket_id,
    studentName: row.student_name,
    studentId: row.student_id,
    department: row.department,
    departmentId: row.department_id ? { id: row.department_id, ...(row.departments || {}) } : null,
    subject: row.subject,
    category: row.category,
    message: row.message,
    description: row.description || row.message,
    details: row.details,
    reason: row.reason,
    isAnonymous: row.is_anonymous,
    isEscalated: row.is_escalated,
    status: row.status,
    responses: row.responses || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function shapeDepartment(row: any) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function shapeAdmin(row: any, department?: any) {
  return {
    _id: row.id,
    id: row.id,
    username: row.username,
    password: row.password,
    fullName: row.full_name,
    role: row.role,
    department: department || null,
    departmentId: row.department_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
