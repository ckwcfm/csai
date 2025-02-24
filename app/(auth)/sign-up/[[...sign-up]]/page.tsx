'use client'
import { useForm } from 'react-hook-form'
import { SignUp, SignUpSchema } from '@/schemas/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()

  const form = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
  })

  const onSubmit = async (data: SignUp) => {
    try {
      const resp = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!resp.ok) {
        throw new Error('Failed to sign up')
      }

      router.push('/sign-in')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className='flex flex-col gap-4 h-screen w-screen items-center justify-center'>
      <div className='flex w-full flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>Sign Up</h1>
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
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormDescription>
                      Please confirm your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className='flex gap-2'>
        <p className='text-sm text-gray-500'>Already have an account?</p>
        <Link
          href='/sign-in'
          className='text-sm text-gray-500 hover:text-gray-700 hover:underline hover:underline-offset-4 transition-all duration-300 hover:font-medium'
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
