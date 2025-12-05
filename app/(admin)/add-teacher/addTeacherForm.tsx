'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { addTeacherAction } from '../../../actions/Teacher/addTeacher'
import { Textarea } from '../../../components/ui/textarea'
import { useEdgeStore } from '../../../lib/edgestore'
import { ITeacher, teacherSchema } from '../../../validation/teacherSchema'

export default function AddTeacherForm() {
  const { edgestore } = useEdgeStore()
  const [file, setFile] = useState<File | null>()

  const form = useForm<ITeacher>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      phone: '',
    },
  })

  async function onSubmit(data: ITeacher) { 
    try {
      let avatarUrl = ''
      if (file) {
        const res = await edgestore.publicFiles.upload({ file })
        avatarUrl = res.url
      }

      const { name, email, password, phone, bio } = data
      form.reset()
      await addTeacherAction({ name, email, password, avatarUrl, phone, bio })
      toast.success('Teacher added successfully!')
    } catch (err) {
      toast.error('Failed to add teacher')
    }
  }
  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <CardTitle>إضافة مدرس جديد</CardTitle>
        <CardDescription>اكتب بيانات المدرس المطلوبة.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form id='form-add-teacher' onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='grid gap-4'>
            {/* --- Name Field --- */}
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

            {/* --- Email Field --- */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الإيميل</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Password Field --- */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الباسورد</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الموبايل</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نبذة عن المدرس </FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload (state-based, not RHF) */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium'>صورة المدرس</label>
              <Input
                type='file'
                accept='image/*'
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </CardContent>
        </form>
      </Form>

      <CardFooter className='flex justify-between'>
        <Button type='button' variant='outline' onClick={() => form.reset()}>
          مسح
        </Button>
        <Button
          type='submit'
          form='form-add-teacher'
          disabled={form.formState.isSubmitting || form.formState.isLoading}
          className=' relative'
        >
          {form.formState.isSubmitting ? <LoaderIcon className='animate-spin' /> : 'إضافة'}
        </Button>
      </CardFooter>
    </Card>
  )
}
