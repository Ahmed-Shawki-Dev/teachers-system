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

      {/* --- HERO SECTION --- */}
      {/* قللنا الـ py في الموبايل لـ 16 عشان نلم الدنيا */}
      <section className='relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-32 min-h-[90vh]'>
        {/* Glow Effects */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 blur-[60px] md:blur-[90px] rounded-full pointer-events-none' />

        <div className='max-w-5xl space-y-6 z-10 relative'>
          {/* Badge */}
          <div className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
            <Badge
              variant='secondary'
              className='px-4 py-1.5 text-xs md:text-sm font-medium border border-primary/20 bg-background/50 backdrop-blur-md rounded-full shadow-sm'
            >
              <Sparkles className='w-3.5 h-3.5 mr-2 text-amber-500 inline-block' />
              <span className='bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent font-bold'>
                النظام الأذكى للمدرس المصري 🇪🇬
              </span>
            </Badge>
          </div>

          {/* Title: صغرنا الخط في الموبايل لـ 4xl عشان ميتكسرش */}
          <h1 className='text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.2] md:leading-[1.15] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
            نظم مجموعاتك وطلابك <br />
            {/* decoration والخط اتشالوا من الموبايل (hidden block -> inline-block) */}
            <span className='relative block md:inline-block mt-1 md:mt-2'>
              {/* الخط اللي تحت الكلام بيظهر بس في الشاشات الكبيرة */}
              <span className='hidden md:block absolute inset-x-0 bottom-2 md:bottom-4 h-4 md:h-6 bg-primary/10 -rotate-1 rounded-full -z-10' />
              <span className='relative text-primary'>بذكاء ومن موبايلك</span>
            </span>
          </h1>

          {/* Subtitle: خط أصغر وأوضح */}
          <p className='text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 px-2'>
            نظم حصصك وطلابك ومالياتك من الموبايل في ثواني.
            <br className='hidden sm:block' />
            وداعاً للورقة والقلم..{' '}
            <span className='text-foreground font-medium'>ركز في الشرح وسيب الإدارة علينا.</span>
          </p>

          {/* Buttons: زراير كاملة العرض في الموبايل */}
          <div className='flex flex-col sm:flex-row gap-3 md:gap-5 justify-center pt-6 md:pt-8 w-full max-w-sm sm:max-w-none mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300'>
            <Button
              size='lg'
              className='w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300'
              asChild
            >
              <Link href={WHATSAPP_LINK} target='_blank'>
                <PhoneCall className='w-4 h-4 md:w-5 md:h-5 ml-2' />
                اطلب نسختك الآن
              </Link>
            </Button>

            <Button
              size='lg'
              variant='outline'
              className='w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full border-primary/20 hover:bg-muted/50 transition-all'
              asChild
            >
              <Link href='/login'>
                <LogIn className='w-4 h-4 md:w-5 md:h-5 ml-2' />
                دخول المشتركين
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className='relative py-12 md:py-16 border-y border-border/40 bg-muted/30 backdrop-blur-sm'>
        <div className='container mx-auto px-4'>
          {/* gap-y-8 في الموبايل عشان نفصل الأرقام عن بعض */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-10'>
            <StatItem value={stats.teachers || 0} label='مدرس' icon={Users} color='text-primary' />
            <StatItem
              value={stats.students || 0}
              label='طالب'
              icon={TrendingUp}
              color='text-green-600'
            />
            <StatItem
              value={stats.groups || 0}
              label='مجموعة'
              icon={PieChart}
              color='text-orange-500'
            />
            <StatItem value={100} label='دعم فني' suffix='%' icon={Zap} color='text-yellow-500' />
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
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className='relative py-16 md:py-24 '>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-10 md:mb-16'>
            <Badge
              variant='secondary'
              className='mb-3 md:mb-4 backdrop-blur-sm bg-background/50 border border-primary/20'
            >
              ابدأ في 3 خطوات
            </Badge>
            <h2 className='text-2xl md:text-5xl font-bold mb-4'>رحلة الانضمام ⚡</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto'>
            {[
              {
                emoji: '📞',
                title: '1. تواصل معنا',
                desc: 'كلمنا واتساب، هنعرف عدد طلابك ومجموعاتك ونجهزلك حسابك فوراً.',
                color: 'from-blue-500/20 to-blue-600/20',
              },
              {
                emoji: '🔑',
                title: '2. استلم مفاتيحك',
                desc: 'هتستلم اسم المستخدم وكلمة السر، وفيديو شرح بسيط يخليك أستاذ في النظام.',
                color: 'from-emerald-500/20 to-emerald-600/20',
              },
              {
                emoji: '📱',
                title: '3. انطلق بشغلك',
                desc: 'ضيف طلابك وابدأ شغل فوراً، وأي وقت تحتاجنا الدعم الفني معاك.',
                color: 'from-purple-500/20 to-purple-600/20',
              },
            ].map((step, i) => (
              <div key={i} className='relative group'>
                {/* الخلفية بتظهر بس في الكمبيوتر عشان متبقاش تقيلة ع الموبايل */}
                <div
                  className={`hidden md:block absolute inset-0 rounded-3xl bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                />
                <div className='relative p-6 md:p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-primary/10 h-full flex flex-col items-center text-center hover:border-primary/30 transition-all'>
                  <div className='w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-6 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl md:text-3xl shadow-sm'>
                    {step.emoji}
                  </div>
                  <h3 className='text-lg md:text-xl font-bold mb-2 md:mb-3'>{step.title}</h3>
                  <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className='py-16 md:py-24 px-4'>
        <div className='container mx-auto max-w-5xl'>
          <div className='bg-card border border-primary/10 rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-xl md:shadow-2xl shadow-primary/5'>
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
