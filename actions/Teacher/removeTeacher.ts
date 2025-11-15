'use server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../../lib/prisma'
export const removeTeacherAction = async (id: string) => {
  await Prisma.teacher.delete({
    where: {
      id,
    },
  })
  revalidatePath('/add-todo')
}
