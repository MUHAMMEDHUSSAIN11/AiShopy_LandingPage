import { NextResponse } from 'next/server'
import { findCustomerByPhone } from '@/lib/mock-data'
import type { CustomerCheckResponse } from '@/types/customer'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string }

    if (!body.phone || typeof body.phone !== 'string') {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 })
    }

    const phone = body.phone.replace(/\D/g, '')
    if (phone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const customer = findCustomerByPhone(phone)

    const response: CustomerCheckResponse = customer
      ? { exists: true, customer }
      : { exists: false }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
