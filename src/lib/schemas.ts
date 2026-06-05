import { z } from 'zod'

export const waitlistSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  storeName: z.string().refine(
    (val) => val === '' || (val.length >= 2 && val.length <= 50 && /^[a-zA-Z0-9-]+$/.test(val)),
    {
      message:
        'Store name must be 2–50 characters and can only contain letters, numbers, and hyphens',
    },
  ),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>
