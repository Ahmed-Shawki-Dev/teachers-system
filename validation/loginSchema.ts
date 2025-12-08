import z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'أكتب الإيميل صح',
  }),
  password: z.string().min(8, {
    message: 'أكتب كلمة السر الصحيحة',
  }),
})

export type ILogin = z.infer<typeof LoginSchema>
