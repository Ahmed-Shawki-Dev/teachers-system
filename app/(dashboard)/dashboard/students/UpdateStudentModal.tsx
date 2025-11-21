'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateStudentAndEnrollAction } from '../../../../actions/Enrollment/updateStudentToGroup'
import { getAllGroupsAction } from '../../../../actions/Group/getGroups'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { IGroupDB } from '../../../../interfaces/groups'
import { IStudent, studentSchema } from '../../../../validation/studentSchema'

export default function UpdateStudentModal({ studentId }: { studentId: string }) {
  const [groups, setGroups] = useState<IGroupDB[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<IStudent>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      parentPhone: '',
      groupId: '',
    },
  })

  useEffect(() => {
    if (open && !hasFetched) {
      getAllGroupsAction().then((data) => {
        setGroups(data)
        setHasFetched(true)
      })
    }
  }, [open, hasFetched])

  async function onSubmit(data: IStudent) {
    try {
      setLoading(true)
      await updateStudentAndEnrollAction(studentId, data)
      toast.success('تم تعديل الطالب بنجاح')
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error('Failed')
      throw new Error('Error', error!)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form id={`form-update-student-${studentId}`} onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant={'outline'}>تعديل</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] '>
            <DialogHeader>
              <DialogTitle className='text-center'>تعديل الطالب</DialogTitle>
              <DialogDescription className='text-center'>قم بتعديل بيانات الطالب</DialogDescription>
            </DialogHeader>
            <div className='space-y-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentPhone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم ولي الأمر</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='groupId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصف الدراسي</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الصف الدراسي' />
                        </SelectTrigger>

                        <SelectContent className='max-h-60 overflow-auto'>
                          {groups.map((group) => (
                            <div key={group.name} className='py-2'>
                              <SelectItem value={group.id}>{group.name}</SelectItem>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>إلغاء</Button>
              </DialogClose>
              <Button type='submit' form={`form-update-student-${studentId}`} disabled={loading}>
                {loading ? (
                  <span className='animate-spin'>
                    <Loader />
                  </span>
                ) : (
                  'تعديل الطالب'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
