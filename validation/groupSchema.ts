import { z } from 'zod'

export const groupSchema = z.object({
  // 1. اسم المجموعة
  grade: z.string().min(1, 'اختار الصف الدراسي'), // NEW: الصف الدراسي هو المطلوب أساساً

  // 2. اسم المجموعة التفصيلي (اختياري)
  name: z.string().nullish(), // MODIFIED: اختياري وممكن يكون null

  // 2. السعر (بنستخدم coerce عشان يحول النص لرقم)
  price: z.coerce.number().min(0, 'السعر مطلوب'),

  // 3. نظام الدفع
  paymentType: z
    .string()
    .min(1, 'لازم تختار نظام الدفع')
    .refine((val) => val === 'PER_SESSION' || val === 'MONTHLY', 'قيمة نظام الدفع غير صحيحة'),

  // 4. المواعيد (دي اللي كانت ناقصة وعاملة كل المشاكل)
  schedule: z
    .array(
      z.object({
        dayOfWeek: z.string().min(1, 'اختار اليوم'),
        startTime: z.string().min(1, 'اختار وقت البداية'),
        endTime: z.string().min(1, 'اختار وقت النهاية'),
      }),
    )
    .optional()
    .default([]),
})

// تصدير النوع عشان نستخدمه في الفورم
export type IGroupInput = z.infer<typeof groupSchema>
