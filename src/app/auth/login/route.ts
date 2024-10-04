import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  try {
    const { token, user } = await login(email, password);
    cookies().set('auth_token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });
    console.log('Login route - user data:', user);
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 401 });
  }
}