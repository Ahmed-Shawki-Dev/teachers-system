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
import { Loader, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addGroupAction } from '../../../../actions/Group/addGroup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { grades } from '../../../../data/grades'
import { groupSchema, IGroup } from '../../../../validation/groupSchema'

export default function AddGroupModal() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<IGroup>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: IGroup) {
    try {
      setLoading(true)
      await addGroupAction(data)
      toast.success('Group added successfully!')
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
        <form id='form-add-group' onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'lg'}>
              <PlusCircle />
              أضف مجموعة
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] '>
            <DialogHeader>
              <DialogTitle className='text-center'>إضافة مجموعة</DialogTitle>
              <DialogDescription className='text-center'>
                قم بإضافة مجموعة جديد الى السيستم
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصف الدراسي</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الصف الدراسي' />
                        </SelectTrigger>

                        <SelectContent className='max-h-60 overflow-auto'>
                          {grades.map((group) => (
                            <div key={group.label} className='py-2'>
                              <div className='px-3 text-sm font-semibold text-muted-foreground'>
                                {group.label}
                              </div>
                              {group.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
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
              <Button type='submit' form='form-add-group' disabled={loading}>
                {loading ? (
                  <span className='animate-spin'>
                    <Loader />
                  </span>
                ) : (
                  'إضافة'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
