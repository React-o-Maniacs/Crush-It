import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { randomUUID } from 'crypto';

// These are the values for the public and private key for Mailjet
// const MJ_API_PUBLIC = 'e4e080e5208824dc85eb1faa7ea23940';
// const MJ_API_PRIVATE = '7435982b0e895781b8339f150e8b7858';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = req.body;
    
    if(!email || !password){
      throw new Error('Email and password required');
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
      }
    });
    

     /**
      * When user is created, we want to create an account with a token
      * But according to https://next-auth.js.org/providers/email we want to do that in [...nextauth].ts
      * Unsure how to connect the code on that page to teh prismadb or how database adapters work in general
      * Overall, the code for email verification was placed in .env, [...nextauth].ts and register.ts
    const token = await prismadb.VerificationToken.create({
      data: {
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
        identifier: user.id,
      },
    });
    
    const MJ_API_PUBLIC = 'e4e080e5208824dc85eb1faa7ea23940';
    const MJ_API_PRIVATE = '7435982b0e895781b8339f150e8b7858';
    const Mailjet = require('node-mailjet');
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE,
      {
        options: {
          timeout: 100
        }
      }
    );
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [{
          From: {
            Email: "pilot@mailjet.com",
            Name: "Mailjet Pilot"
          },
          To: [{
            Email: "passenger1@mailjet.com",
            Name: "passenger 1"
          }],
            Subject: "Please verify your email address!",
            TextPart: "Dear user, welcome to Crush-It! Bottom Text!",
            HTMLPart: "<h3>Dear user, welcome to <a href=\"http://localhost:3000/\">Crush-It</a>!</h3><br />Bottom Text!"
        }]
      })

      request
      .then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })
      **/

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}