'use client'
import { X } from 'lucide-react'

import Image from 'next/image'
import { Card, CardHeader } from '../../../components/ui/card'
import { ITeacherDB } from '../../../interfaces/teachers'
import { removeTeacherAction } from '../../../actions/Teacher/removeTeacher'

const TeacherCard = ({ name, id,avatarUrl }: Partial<ITeacherDB>) => {
  return (
    <Card>
      <CardHeader>
        <X className='text-red-600 cursor-pointer' onClick={() => removeTeacherAction(id!)} />
      </CardHeader>
      <Image src={avatarUrl!} height={100} width={100} alt='Ahmed'/>
      <div>{name}</div>
    </Card>
  )
}

export default TeacherCard
