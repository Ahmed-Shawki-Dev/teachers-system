import { ITeacher } from '../validation/teacherSchema'

export interface ITeacherDB extends ITeacher {
  id?: string
  avatarUrl:string
}
