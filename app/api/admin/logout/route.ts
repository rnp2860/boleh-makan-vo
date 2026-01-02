// app/api/admin/logout/route.ts
// 🔐 Admin Logout API Route

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_SESSION_KEY = 'boleh_makan_admin_session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_KEY);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

