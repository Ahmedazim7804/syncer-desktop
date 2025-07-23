import z from "zod"

export const loginSchema = z.object({
  device: z
    .string()
    .min(3, 'Device Name is required')
    .max(20, 'Device Name must be less than 20 characters'),
  serverUrl: z
    .string()
    .min(1, 'Server URL is required')
    .url('Please enter a valid URL')
    .max(200, 'Server URL must be less than 200 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
})

export type LoginFormData = z.infer<typeof loginSchema>