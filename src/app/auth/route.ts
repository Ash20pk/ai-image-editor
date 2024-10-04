import { NextRequest, NextResponse } from 'next/server';
import { login, checkAuthStatus, checkUserExists } from '@/lib/auth';
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
    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  const token = cookies().get('auth_token')?.value;
  const user = await checkAuthStatus(token);
  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json(null, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  cookies().delete('auth_token');
  return NextResponse.json({ message: 'Logged out successfully' });
}

export async function PUT(request: NextRequest) {
  const { email } = await request.json();
  try {
    const userExists = await checkUserExists(email);
    return NextResponse.json({ exists: userExists });
  } catch (error) {
    return NextResponse.json({ error: 'User check failed' }, { status: 500 });
  }
}