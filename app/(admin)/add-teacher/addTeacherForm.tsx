'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { addTeacherAction } from '../../../actions/Teacher/addTeacher'
import { Textarea } from '../../../components/ui/textarea'
import { useEdgeStore } from '../../../lib/edgestore'
import { teacherSchema } from '../../../validation/teacherSchema'

// إعدادات الباقات
const TIER_SETTINGS = {
  BASIC: { students: 200 },
  PRO: { students: 500 },
}

export default function AddTeacherForm() {
  const { edgestore } = useEdgeStore()
  const [file, setFile] = useState<File | null>(null)

  // 1. ✅ شلنا الـ Generic Type <ITeacher> من هنا عشان نمنع الخناقة
  // React Hook Form هيعرف النوع لوحده من الـ schema والـ defaultValues
  const form = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      phone: '',
      hasBarcodeScanner: false,
      maxStudents: 200, // قيمة مبدئية رقمية
      tier: 'BASIC' as const, // as const عشان يفهم إنه Enum
    },
  })

  // مراقبة تغيير الباقة
  const selectedTier = form.watch('tier')

  useEffect(() => {
    if (selectedTier && TIER_SETTINGS[selectedTier]) {
      const settings = TIER_SETTINGS[selectedTier]
      form.setValue('maxStudents', settings.students)
    }
  }, [selectedTier, form])

  // الدالة دي هتستقبل الداتا وهي معمولة ليها Validation وجاهزة
  async function onSubmit(data: z.infer<typeof teacherSchema>) {
    try {
      let avatarUrl = ''
      if (file) {
        const res = await edgestore.publicFiles.upload({ file })
        avatarUrl = res.url
      }

      await addTeacherAction({ ...data, avatarUrl })

      form.reset()
      setFile(null)
      toast.success('تم إضافة المدرس بنجاح!')
    } catch (err) {
      toast.error('فشل إضافة المدرس')
      console.error(err)
    }
  }

  return (
    <Card className='w-full sm:max-w-md my-4'>
      <CardHeader>
        <CardTitle>إضافة مدرس جديد</CardTitle>
        <CardDescription>اكتب بيانات المدرس وصلاحياته.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form id='form-add-teacher' onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='grid gap-4'>
            {/* --- Name --- */}
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

            {/* --- Email --- */}
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

            {/* --- Password --- */}
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

            {/* --- Phone --- */}
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

            <div className='grid grid-cols-2 gap-4'>
              {/* --- Tier --- */}
              <FormField
                control={form.control}
                name='tier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الباقة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الباقة' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='BASIC'>أساسي (Basic)</SelectItem>
                        <SelectItem value='PRO'>محترف (Pro)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Max Students --- */}
              <FormField
                control={form.control}
                name='maxStudents'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحد الأقصى</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        // 1. ✅ الحل السحري: بنعمل Casting صريح ونقوله ده رقم يا غبي
                        value={(field.value as number) ?? ''}
                        // 2. التحويل لرقم عند الكتابة
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- Barcode Scanner --- */}
            <FormField
              control={form.control}
              name='hasBarcodeScanner'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>قارئ الباركود</FormLabel>
                    <FormDescription>تفعيل ميزة سحب الغياب</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* --- Bio --- */}
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نبذة</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- File Upload --- */}
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
        >
          {form.formState.isSubmitting ? <LoaderIcon className='animate-spin' /> : 'إضافة'}
        </Button>
      </CardFooter>
    </Card>
  )
}
