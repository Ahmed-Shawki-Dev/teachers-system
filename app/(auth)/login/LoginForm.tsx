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
import { ILogin, LoginSchema } from '../../../validation/loginSchema'

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
      router.refresh()
    } catch (error) {
      toast.error('الإيميل أو الباسورد غلط')
    }
  }

  return (
    // Container Animation (Fade In + Slide Up)
    <div className='relative z-10 flex min-h-[760px] w-full items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none xl:px-24'>
        {/* Card Animation (Zoom In slightly) */}
        <div className='mx-auto w-full max-w-sm lg:w-96 animate-in zoom-in-95 duration-500 delay-150 fill-mode-both'>
          {/* Glass Card */}
          <div className='relative backdrop-blur-xl bg-background/80 p-8 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10'>
            {/* Gradient Border Effect */}
            <div className='absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-accent/20 opacity-80 blur-2xl -z-10' />

            {/* العنوان */}
            <div className='text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both'>
              <h2 className='text-3xl font-bold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent'>
                أهلاً بعودتك
              </h2>
              <p className='text-sm text-muted-foreground'>ادخل بياناتك لتسجيل الدخول</p>
            </div>

            {/* الفورم */}
            <div className='mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both'>
              <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                  {/* حقل الإيميل */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            className='mt-1 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                            placeholder='you@example.com'
                            type='email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* حقل الباسورد */}
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input
                            className='mt-1 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                            placeholder='اكتب الباسورد بتاعك'
                            type='password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* زر الدخول */}
                  <div>
                    <Button
                      type='submit'
                      className='w-full  hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/25 hover:scale-[1.02]'
                    >
                      سجل الدخول
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
