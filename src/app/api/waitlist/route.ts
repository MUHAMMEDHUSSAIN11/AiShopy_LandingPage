import { NextResponse } from 'next/server'
import { sendWaitlistNotification } from '@/lib/email'
import { waitlistSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = waitlistSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    await sendWaitlistNotification(result.data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist submission failed:', error)
    return NextResponse.json(
      { error: 'Failed to process your signup. Please try again or email us directly.' },
      { status: 500 },
    )
  }
}
