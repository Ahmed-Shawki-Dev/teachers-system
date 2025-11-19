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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addStudentAction } from '../../../../actions/Student/addStudent'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import { IStudent, studentSchema } from '../../../../validation/studentSchema'

export default function AddStudentModal() {
  const form = useForm<IStudent>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      gender: '',
      parentName: '',
      parentPhone: '',
    },
  })

  async function onSubmit(data: IStudent) {
    try {
      await addStudentAction(data)
      toast.success('Student added successfully!')
      form.reset()
    } catch (error) {
      toast.error('Failed')
    }
  }

  return (
    <Dialog>
      <Form {...form}>
        <form id='form-add-student' onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant='outline'>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] '>
            <DialogHeader>
              <DialogTitle className='text-center'>إضافة طالب</DialogTitle>
              <DialogDescription className='text-center'>
                قم بإضافة طالب جديد الى السيستم
              </DialogDescription>
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
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='placeholder:text-right'>الجنس</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full ' dir='rtl'>
                          <SelectValue placeholder='اختر الجنس' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ذكر'>ذكر</SelectItem>
                        <SelectItem value='أنثى'>أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم ولي الأمر</FormLabel>
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit' form='form-add-student'>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
