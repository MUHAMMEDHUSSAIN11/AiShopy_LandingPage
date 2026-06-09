import { z } from 'zod'

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .regex(/^\d{10}$/, 'Phone must be 10 digits'),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .regex(/^\d{10}$/, 'Phone must be 10 digits'),
  addressLine1: z.string().min(3, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z
    .string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
