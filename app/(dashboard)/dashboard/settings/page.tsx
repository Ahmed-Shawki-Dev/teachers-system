import { AlertTriangle, Settings, ShieldCheck } from 'lucide-react'
import {
  deleteAllGroupsAction,
  deleteAllStudentsAction,
  resetEventsAction,
} from '../../../../actions/Settings/dangerActions'
import ChangePasswordForm from './ChangePasswordForm'
import DeleteZoneItem from './DeleteZoneItem'

const SettingsPage = () => {
  return (
    <div className='container mx-auto p-4 space-y-8 max-w-5xl'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between  gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Settings className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الإعدادات</h1>
            <p className='text-sm text-muted-foreground'>التحكم في الحساب والنظام</p>
          </div>
        </div>
      </div>

      {/* 1. قسم الأمان وكلمة المرور */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 pb-2 border-b'>
          <ShieldCheck className='w-5 h-5 text-green-600' />
          <h2 className='text-lg font-bold'>الأمان وتسجيل الدخول</h2>
        </div>
        <div className='bg-card p-6 rounded-lg border shadow-sm'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div>
              <h3 className='font-medium'>كلمة المرور</h3>
              <p className='text-sm text-muted-foreground'>
                يفضل تغيير كلمة المرور بشكل دوري للحفاظ على أمان حسابك.
              </p>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      {/* 2. منطقة الخطر (Danger Zone) */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 pb-2 border-b border-red-200 dark:border-red-900'>
          <AlertTriangle className='w-5 h-5 text-red-600' />
          <h2 className='text-lg font-bold text-red-600'>منطقة الخطر</h2>
        </div>

        <div className='bg-card p-6 rounded-lg border border-red-100 shadow-sm space-y-4'>
          <p className='text-sm text-muted-foreground mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded'>
            ⚠️ تنبيه: الإجراءات التالية تحذف البيانات نهائياً ولا يمكن استعادتها. يرجى الحذر.
          </p>

          <DeleteZoneItem
            title='تصفير الأحداث والماليات'
            description='حذف جميع الحصص، الغياب، الامتحانات، والمدفوعات (مع الإبقاء على الطلاب والمجموعات).'
            buttonText='تصفير الأحداث'
            action={resetEventsAction}
          />

          <DeleteZoneItem
            title='حذف جميع الطلاب'
            description='سيتم حذف جميع الطلاب المسجلين لديك نهائياً.'
            buttonText='حذف كل الطلاب'
            action={deleteAllStudentsAction}
          />

          <DeleteZoneItem
            title='حذف جميع المجموعات'
            description='سيتم حذف المجموعات (سيؤدي ذلك لحذف الطلاب والأحداث المرتبطة بها).'
            buttonText='حذف كل المجموعات'
            action={deleteAllGroupsAction}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
