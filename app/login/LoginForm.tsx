'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { ILogin, LoginSchema } from '../../validation/loginSchema'

const LoginForm = () => {
  const router = useRouter()

  const form = useForm<ILogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: ILogin) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('خطأ في تسجيل الدخول')
      toast.success('أحلى تحية لأحلى أستاذ❤️')
      router.push('/')
    } catch (error) {
      toast.error('الإيميل أو الباسورد غلط')
    }
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <div className='space-y-2 text-center'>
          <h1 className='font-bold text-2xl'>أهلاً بعودتك</h1>
          <p className='text-muted-foreground text-sm'>ادخل بياناتك لتسجيل الدخول</p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-background'
                      placeholder='you@example.com'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>كلمة المرور</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      className='bg-background'
                      placeholder='اكتب الباسورد بتاعك'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit'>
              سجل الدخول
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm
