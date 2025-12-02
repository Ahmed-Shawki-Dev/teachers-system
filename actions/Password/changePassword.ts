'use server'
import * as bcrypt from 'bcrypt'
import { Prisma } from '../../lib/prisma'
import { getTeacherByTokenAction } from '../Teacher/getTeacherByToken'

export const changePasswordAction = async (currentPassword: string, newPassword: string) => {
  const teacher = await getTeacherByTokenAction()
  if (!teacher) throw Error('مش مسموحلك تغير الباسورد')

  const valid = await bcrypt.compare(currentPassword, teacher.password)
  if (!valid) throw Error('اكتب االباسورد القديم صح')

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await Prisma.teacher.update({
    where: {
      id: teacher.id,
    },
    data: {
      password: hashedPassword,
    },
  })
  return { success: true, message: 'تم تغيير كلمة المرور بنجاح' }
}
