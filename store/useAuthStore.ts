// store/teacherStore.ts
import { create } from 'zustand'

interface Teacher {
  id: string
  name: string
  avatarUrl?: string | null
  bio?: string
  phone?: string
}

interface TeacherState {
  teacher: Teacher | null
  setTeacher: (teacher: Teacher | null) => void
}

export const useTeacherStore = create<TeacherState>((set) => ({
  teacher: null,
  setTeacher: (teacher) => set({ teacher }),
}))
