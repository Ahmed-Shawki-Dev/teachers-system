import { getLandingStats } from '@/actions/Public/getLandingStats'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  LogIn,
  Phone,
  PhoneCall,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import StudentSearchCode from '../../components/home/StudentSearchCode'
import { features } from '../../data/features'
import FeatureCard from './FeatureCard'
import StatItem from './StatItem'

export default async function Home() {
  const stats = await getLandingStats()

  const WHATSAPP_NUMBER = '201098786468'
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=السلام عليكم، أنا مدرس ومهتم بنظام الدفتر وعايز أعرف التفاصيل`

  return (
    <div className='font-serif relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-primary/10'>
      {/* الخلفية الهادئة */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] z-0 pointer-events-none' />

      {/* --- HERO WRAPPER --- */}
      <section className='relative z-10 pt-24 pb-16 md:pt-32 md:pb-24 px-4'>
        {/* ========================================= */}
        {/* PART 1: THE HERO (Marketing Message)      */}
        {/* ========================================= */}
        {/* min-h-[60vh] دي اللي بتخلي الهيرو واخد راحته في الطول */}
        <div className='container mx-auto max-w-6xl text-center flex flex-col justify-center min-h-[50vh] md:min-h-[60vh]'>
          <div className='flex flex-col items-center mb-8'>
            <div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700'>
              <Sparkles className='w-3 h-3 mr-2' />
              النظام الأذكى للمدرس المصري 🇪🇬
            </div>

            <h1 className='text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
              نظم مجموعاتك وطلابك <br className='hidden md:block' />
              <span className='text-primary'>بذكاء ومن موبايلك</span>
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200'>
              وداعاً للورقة والقلم. ركز في الشرح وسيب الغياب، الامتحانات، والماليات علينا.
            </p>

            <div className='flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300'>
              <Button
                size='lg'
                className='h-14 px-10 text-lg rounded-full w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-transform hover:scale-105'
                asChild
              >
                <Link href={WHATSAPP_LINK} target='_blank'>
                  <PhoneCall className='w-5 h-5 ml-2' />
                  اطلب نسختك الآن
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='h-14 px-10 text-lg rounded-full w-full sm:w-auto border-2 hover:bg-muted/50'
                asChild
              >
                <Link href='/login'>
                  <LogIn className='w-5 h-5 ml-2' />
                  دخول المشتركين
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* PART 2: THE CARD (Search + Stats)         */}
        {/* ========================================= */}
        {/* فصلناه بـ mt-12 md:mt-24 عشان ينزل تحت الهيرو بمسافة محترمة */}
        <div className='container mx-auto max-w-6xl mt-12 md:mt-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500'>
          {/* The Big Integrated Card */}
          <div className='relative mx-auto max-w-5xl'>
            {/* الخلفية الموحدة */}
            <div className='absolute inset-0 bg-linear-to-b from-primary/5 to-transparent rounded-[3rem] -z-10 blur-2xl opacity-60' />

            <div className='bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p- md:p-8 overflow-hidden relative shadow-lg'>
              {/* A. Search Component */}
              <div className='mb-14 relative z-10'>
                <StudentSearchCode />
              </div>

              {/* Separator */}
              <div className='flex items-center gap-6 mb-10 opacity-40'>
                <div className='h-px bg-border flex-1' />
                <span className='text-sm font-semibold text-muted-foreground tracking-widest uppercase'>
                  أرقام نفخر بها
                </span>
                <div className='h-px bg-border flex-1' />
              </div>

              {/* B. Stats Grid */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
                <StatItem
                  value={stats.teachers || 0}
                  label='مدرس'
                  icon={Users}
                  color='text-blue-500'
                />
                <StatItem
                  value={stats.students || 0}
                  label='طالب'
                  icon={TrendingUp}
                  color='text-green-500'
                />
                <StatItem
                  value={stats.groups || 0}
                  label='مجموعة'
                  icon={PieChart}
                  color='text-orange-500'
                />
                <StatItem
                  value={100}
                  label='دعم فني'
                  suffix='%'
                  icon={Zap}
                  color='text-yellow-500'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id='features' className='container mx-auto px-4 py-16 md:py-24'>
        <div className='text-center mb-10 md:mb-16 space-y-3'>
          <h2 className='text-2xl md:text-5xl font-bold'>ليه تشترك معانا؟ 🤔</h2>
          <p className='text-base md:text-xl text-muted-foreground'>
            أدوات مصممة خصيصاً لاحتياجات المدرس.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className='py-24 relative z-10 '>
        <div className='container mx-auto px-4 text-center'>
          <Badge variant='outline' className='mb-4 bg-background'>
            كيف تبدأ؟
          </Badge>
          <h2 className='text-3xl md:text-5xl font-bold mb-16'>ابدأ رحلتك في 3 خطوات</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
            <div className='hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent z-0' />

            {[
              { title: 'تواصل معنا', icon: '📞', desc: 'كلمنا واتساب وهنجهزلك حسابك فوراً' },
              { title: 'استلم مفاتيحك', icon: '🔑', desc: 'اسم مستخدم وكلمة مرور وفيديو شرح' },
              { title: 'انطلق بشغلك', icon: '🚀', desc: 'ضيف طلابك وابدأ شغل فوراً' },
            ].map((step, i) => (
              <div key={i} className='relative z-10 flex flex-col items-center '>
                <div className='w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center text-4xl mb-6 shadow-xl relative group transition-transform hover:scale-110'>
                  <span className='relative z-10'>{step.icon}</span>
                  <div className='absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors' />
                </div>
                <h3 className='text-xl font-bold mb-2'>{step.title}</h3>
                <p className='text-muted-foreground max-w-xs'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className='py-16 md:py-24 px-4'>
        <div className='container mx-auto max-w-5xl'>
          <div className='bg-card/80 border border-primary/10 rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-xl md:shadow-2xl shadow-primary/5'>
            <div className='absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none' />

            <h2 className='text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight'>
              جاهز تنظم وقتك ومجهودك؟
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto'>
              تواصل معنا الآن والحق آخر العروض
            </p>

            <div className='flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center'>
              <Button
                size='lg'
                className='w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full shadow-lg'
                asChild
              >
                <Link href={WHATSAPP_LINK} target='_blank'>
                  <Phone className='w-4 h-4 md:w-5 md:h-5 ml-2' />
                  تواصل واتساب
                </Link>
              </Button>

              <div className='flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground font-medium'>
                <span className='flex items-center gap-2'>
                  <CheckCircle2 className='w-4 h-4 md:w-5 md:h-5 text-green-500' /> دعم فني
                </span>
                <span className='flex items-center gap-2'>
                  <CheckCircle2 className='w-4 h-4 md:w-5 md:h-5 text-green-500' /> تحديثات
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
