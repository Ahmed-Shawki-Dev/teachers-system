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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field' // تأكد من المسار
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react' // أيقونة التحميل
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changePasswordAction } from '../../../../actions/Password/changePassword'
import { changePasswordSchema, IChangePassword } from '../../../../validation/changePasswordSchema'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<IChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: IChangePassword) {
    try {
      setLoading(true)
      const res = await changePasswordAction(data.currentPassword, data.newPassword)

      if (res?.success) {
        toast.success('تم تغيير كلمة السر بنجاح')

        form.reset()
        setOpen(false)

        await fetch('/api/logout', { method: 'POST' })
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تغيير كلمة المرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>تغيير كلمة المرور</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>تغيير كلمة المرور</DialogTitle>
          <DialogDescription className='text-center'>
            قم بتحديث كلمة المرور الخاصة بحسابك لضمان الأمان.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='form-change-password'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FieldGroup>
              {/* كلمة السر الحالية */}
              <Controller
                name='currentPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='currentPassword'>كلمة المرور الحالية</FieldLabel>
                    <Input
                      {...field}
                      id='currentPassword'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='********'
                      autoComplete='current-password'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* كلمة السر الجديدة */}
              <Controller
                name='newPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='newPassword'>كلمة المرور الجديدة</FieldLabel>
                    <Input
                      {...field}
                      id='newPassword'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='********'
                      autoComplete='new-password'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* تأكيد كلمة السر */}
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='confirmPassword'>تأكيد كلمة المرور</FieldLabel>
                    <Input
                      {...field}
                      id='confirmPassword'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='********'
                      autoComplete='new-password'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </Form>

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline' type='button'>
              إلغاء
            </Button>
          </DialogClose>

          <Button type='submit' form='form-change-password' disabled={loading}>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                جاري الحفظ...
              </>
            ) : (
              'حفظ التغييرات'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
