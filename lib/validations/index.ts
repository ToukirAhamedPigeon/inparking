import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

export type SignInSchemaType = z.infer<typeof signInSchema>

// Future schemas can be added below
// export const registerSchema = z.object({ ... })
// export type RegisterSchemaType = z.infer<typeof registerSchema>
