import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

export const UserInsertSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
  name: true,
})

export type UserInsert = z.infer<typeof UserInsertSchema>

export const SignUpSchema = UserInsertSchema.extend({
  confirmPassword: z.string().min(8, {
    message: 'Confirm password must be at least 8 characters long',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

export type SignUp = z.infer<typeof SignUpSchema>

export const SignInSchema = UserSchema.pick({
  email: true,
  password: true,
})

export type TSignIn = z.infer<typeof SignInSchema>
