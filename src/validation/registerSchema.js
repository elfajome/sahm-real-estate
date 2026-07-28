import { z } from 'zod'

export function buildRegisterSchema(requiresConstruction) {
  return z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      type: z.string().min(1),
      area_id: z.string().min(1),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
      construction_type: requiresConstruction
        ? z.string().min(1)
        : z.string().optional(),
    })
    .refine((d) => d.password === d.password_confirmation, {
      message: 'Passwords must match',
      path: ['password_confirmation'],
    })
}
