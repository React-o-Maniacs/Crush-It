import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  try {
    const { email, password, confirmPassword } = req.body;

    if(!email || !password){
      throw new Error('Email and password required');
    }

    if(!password || !confirmPassword){
      throw new Error('Password must match in both fields');
    }

    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        firstName: '',
        lastName: '',
        hashedPassword,
        image: '',
        emailVerified: new Date(),
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}