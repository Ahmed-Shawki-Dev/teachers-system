import { z } from 'zod'

export const sessionSchema = z.object({
  groupId: z.string().min(1, 'لازم تختار المجموعة'),

  sessionDate: z.preprocess((val) => {
    if (typeof val !== 'string' || !val) {
      throw new Error('يرجى تحديد تاريخ ووقت الحصة')
    }
    return new Date(val)
  }, z.date()),

  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']).optional(),
  note: z.string().optional(),
})

export type ISession = z.infer<typeof sessionSchema>
