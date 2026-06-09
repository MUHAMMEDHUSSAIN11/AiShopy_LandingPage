import { NextResponse } from 'next/server'
import { findCustomerByPhone } from '@/lib/mock-customers'
import type { CustomerCheckResponse } from '@/types/customer'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string }

    if (!body.phone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 })
    }

    const customer = findCustomerByPhone(body.phone.replace(/\D/g, ''))

    const response: CustomerCheckResponse = customer
      ? { exists: true, customer }
      : { exists: false }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
