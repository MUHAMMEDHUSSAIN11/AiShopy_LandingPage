import { z } from 'zod'

export const phoneSchema = z.object({
  phone_number: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .regex(/^\d{10}$/, 'Phone must be 10 digits'),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_number: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  state: z.string().min(2, 'State is required'),
  postcode: z
    .string()
    .length(6, 'Postcode must be 6 digits')
    .regex(/^\d{6}$/, 'Postcode must be 6 digits'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
