import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { randomUUID } from 'crypto';
import User from "../../../models/User";
import db from "../../../utils/db";
import prismadb from '@/lib/prismadb';

export const authOptions: AuthOptions = {
  providers: [
    EmailProvider({
      async generateVerificationToken() {
        return `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      }
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        // Functions Below
        async function sendVerificationRequest(params) {
          const { identifier, url, provider, theme } = params;
          const { host } = new URL(url);
          const transport = createTransport(provider.server);
          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Sign in to ${host}`,
            text: text({ url, host }),
            html: html({ url, host }),
          });
          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
          }
        }
        function html(params: { url: string, host: string ) {
          const { url, host } = params;
        
          const escapedHost = host.replace(/\./g, "&#8203;.");
        
          const color = {
            background: '#6284FF', //Blue
            text: '#1F1F1F', //Black
            mainBackground: '#545454', //Light Gray
            buttonBackground: '#6284FF', //Blue
            buttonBorder: '#6284FF', //Blue
            buttonText: '#545454', //Light Gray
          }
        
          return `
        <body style="background: ${color.background};">
          <table width="100%" border="0" cellspacing="20" cellpadding="0"
            style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
            <tr>
              <td align="center"
                style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
                Sign in to <strong>${escapedHost}</strong>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                        target="_blank"
                        style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                        in</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center"
                style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
                If you did not request this email you can safely ignore it.
              </td>
            </tr>
          </table>
        </body>
        `
        }
        /** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
        function text({ url, host }: { url: string, host: string }) {
          return `Sign in to ${host}\n${url}\n\n`;
        }
        callbacks: {
          async signIn({ user, account, email }) {
            await db.connect();
            const userExists = await User.findOne({
              email: user.email,  //the user object has an email property, which contains the email the user entered.
            });
            if (userExists) {
              return true;   //if the email exists in the User collection, email them a magic login link
            } else {
              return "/register";
            }
          },
        // Functions Above
      },
      from: process.env.EMAIL_FROM
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'text',
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Email does not exist');
        }

        const isCorrectPassword = await compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);