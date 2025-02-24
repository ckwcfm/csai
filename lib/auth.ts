import { SignInSchema } from '@/schemas/user'
import { NextAuthOptions } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import { db } from './db'
import { compare } from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          console.log(credentials)
          const { email, password } = SignInSchema.parse(credentials)
          console.log(email, password)
          const user = await db.user.findUnique({
            where: { email: email },
          })

          if (!user) {
            throw new Error('User not found')
          }

          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }
          console.log('DEBUG: auth.ts user', user)
          return user
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user.id) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.user.id,
          },
        }
      }
      return session
    },
  },
}
