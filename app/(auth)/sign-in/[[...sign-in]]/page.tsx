'use client'
import { useForm } from 'react-hook-form'
import { TSignIn, SignInSchema } from '@/schemas/user'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Logo from '@/components/Logo'
import { toast } from 'sonner'
export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const form = useForm<TSignIn>({
    resolver: zodResolver(SignInSchema),
  })

  const onSubmit = async (data: TSignIn) => {
    try {
      console.log(data)
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: '/',
      })
      if (result?.error) {
        throw new Error(result.error)
      }
      console.log('result', result)
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast.error('Invalid credentials')
    }
  }, [error])

  return (
    <div className='flex flex-col gap-4 h-screen w-screen items-center justify-center'>
      <div className='flex w-full flex-col items-center justify-center gap-4'>
        <Logo fontSize='text-4xl' iconSize={40} />
        <h1 className='text-2xl font-bold'>Sign In</h1>
        <div className='flex flex-col gap-4 w-full max-w-md border border-gray-200 rounded-md p-6'>
          <Form {...form}>
            <form
              className='flex flex-col gap-4'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className='text-red-500 text-sm'>
                  {error === 'CredentialsSignin'
                    ? 'Invalid credentials'
                    : 'Something went wrong'}
                </p>
              )}
              <Button
                type='submit'
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className='flex gap-2'>
        <p className='text-sm text-gray-500'>Don&apos;t have an account?</p>
        <Link
          href='/sign-up'
          className='text-sm text-gray-500 hover:text-gray-700 hover:underline hover:underline-offset-4 transition-all duration-300 hover:font-medium'
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
