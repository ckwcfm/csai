import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { db } from '@/lib/db'
import { UserInsertSchema } from '@/schemas/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = UserInsertSchema.parse(body)

    const user = await db.user.findUnique({ where: { email } })
    console.log('after findUnique')
    if (user) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({
      data: { email, password: hashedPassword },
    })
    // return NextResponse.json({ user: newUser }, { status: 201 })
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
