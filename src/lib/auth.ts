import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function signUp(email: string, password: string) {
  const { db } = await connectToDatabase();
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await hash(password, 10);
  const result = await db.collection('users').insertOne({ email, password: hashedPassword });
  const token = sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '1h' });
  return { token, userId: result.insertedId };
}

export async function login(email: string, password: string) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  const token = sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  return { 
    token, 
    user: {
      id: user._id.toString(), // Convert ObjectId to string
      email: user.email
    }
  };
}

export async function verifyToken(token: string) {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    return new ObjectId(decoded.userId);
  } catch (error) {
    return null;
  }
}

export async function getUser(userId: ObjectId) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) {
    return null;
  }
  return {
    id: user._id,
    email: user.email
    // Add any other user fields you want to return, but exclude sensitive info like password
  };
}

// New function to handle authentication check
export async function checkAuthStatus(token: string) {
  if (!token) {
    return null;
  }
  const userId = await verifyToken(token);
  if (!userId) {
    return null;
  }
  return getUser(userId);
}

// New function to check if a user exists
export async function checkUserExists(email: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  return !!user;
}