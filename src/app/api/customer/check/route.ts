import { NextResponse } from 'next/server'
import { AishopyApiError, fetchCustomerByPhone } from '@/lib/aishopy-api'
import type { CustomerByPhoneResponse } from '@/types/customer'

export async function POST(request: Request) {
  let body: { storeSlug?: string; phone_number?: string; phone?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const storeSlug = body.storeSlug?.trim()
  const phoneNumber = (body.phone_number ?? body.phone ?? '').replace(/\D/g, '')

  if (!storeSlug || phoneNumber.length < 10) {
    return NextResponse.json(
      { error: 'storeSlug and a valid phone_number are required' },
      { status: 400 },
    )
  }

  try {
    const result = await fetchCustomerByPhone(storeSlug, phoneNumber)
    const response: CustomerByPhoneResponse = {
      exists: result.exists,
      name: result.name,
      addresses: result.addresses,
    }
    return NextResponse.json(response)
  } catch (error) {
    // Never block checkout on a lookup failure — fall back to manual entry.
    if (error instanceof AishopyApiError) {
      const empty: CustomerByPhoneResponse = { exists: false, addresses: [] }
      return NextResponse.json(empty)
    }
    throw error
  }
}
