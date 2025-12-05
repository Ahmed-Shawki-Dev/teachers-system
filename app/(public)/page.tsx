import { getLandingStats } from '@/actions/Public/getLandingStats'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2, // أيقونة جديدة للاتصال
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
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=السلام عليكم، أنا مدرس ومهتم بنظام الإدارة وعايز أعرف التفاصيل`

  return (
    <div className='flex flex-col min-h-screen bg-background overflow-hidden'>
      {/* --- HERO SECTION --- */}
      <section className='relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-40 min-h-[85vh]'>
        <div className='absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background' />
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]' />

        <div className='max-w-5xl space-y-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both'>
          <Badge
            variant='outline'
            className='px-4 py-1.5 text-sm font-medium text-primary border-primary/20 bg-primary/5 backdrop-blur-sm rounded-full shadow-sm animate-pulse'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 inline-block' />
            النظام الأذكى للمدرس المصري 🇪🇬
          </Badge>

          <h1 className='text-5xl md:text-8xl font-black tracking-tight text-foreground leading-[1.1]'>
            نظم مجموعاتك وطلابك <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-primary/50 via-primary to-primary animate-gradient-x'>
              بذكاء ومن موبايلك
            </span>
          </h1>

          <p className='text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            نظم حصصك وطلابك ومالياتك من الموبايل في ثواني.
            <br className='hidden md:block' />
            وداعاً للورقة والقلم..{' '}
            <span className='text-foreground font-medium'>ركز في الشرح وسيب الإدارة علينا.</span>
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
            <Button
              size='lg'
              className='text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1'
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
              className='text-lg h-14 px-8 rounded-full border-2 hover:bg-muted/50 transition-all'
              asChild
            >
              <Link href='/login'>
                <LogIn className='w-5 h-5 ml-2' />
                دخول المشتركين
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className='border-y bg-muted/30 py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <StatItem
              value={stats.teachers || 0}
              label='مدرس بيستخدم النظام'
              icon={Users}
              color='text-blue-600'
            />
            <StatItem
              value={stats.students || 0}
              label='طالب يتم متابعته'
              icon={TrendingUp}
              color='text-green-600'
            />
            <StatItem
              value={stats.groups || 0}
              label='مجموعة دراسية'
              icon={PieChart}
              color='text-orange-600'
            />
            <StatItem
              value={100}
              label='دعم فني مباشر'
              suffix='%'
              icon={Zap}
              color='text-yellow-600'
            />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id='features' className='container mx-auto px-4 py-24'>
        <div className='text-center mb-16 space-y-4'>
          <h2 className='text-3xl md:text-5xl font-black'>ليه تشترك معانا؟ 🤔</h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            أدوات مصممة خصيصاً لاحتياجات المدرس، مش مجرد برنامج محاسبة.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className='bg-muted/30 py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <Badge variant='secondary' className='mb-4'>
              ابدأ في 3 خطوات
            </Badge>
            <h2 className='text-3xl md:text-5xl font-black mb-4'>رحلة الانضمام ⚡</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            {/* الخطوة 1 */}
            <div className='relative group'>
              <div className='relative p-8 bg-card rounded-xl border h-full flex flex-col items-center text-center'>
                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl shadow-lg`}
                >
                  📞
                </div>
                <h3 className='text-xl font-bold mb-3'>1. تواصل معنا</h3>
                <p className='text-muted-foreground'>
                  كلمنا واتساب، هنعرف عدد طلابك ومجموعاتك ونجهزلك حسابك فوراً.
                </p>
              </div>
            </div>

            {/* الخطوة 2 */}
            <div className='relative group'>
              <div className='relative p-8 bg-card rounded-xl border h-full flex flex-col items-center text-center'>
                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-lg`}
                >
                  🔑
                </div>
                <h3 className='text-xl font-bold mb-3'>2. استلم مفاتيحك</h3>
                <p className='text-muted-foreground'>
                  هتستلم اسم المستخدم وكلمة السر، وفيديو شرح بسيط يخليك أستاذ في النظام.
                </p>
              </div>
            </div>

            {/* الخطوة 3 */}
            <div className='relative group'>
              <div className='relative p-8 bg-card rounded-xl border h-full flex flex-col items-center text-center'>
                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl shadow-lg`}
                >
                  📱
                </div>
                <h3 className='text-xl font-bold mb-3'>3. انطلق بشغلك</h3>
                <p className='text-muted-foreground'>
                  ضيف طلابك وابدأ شغل فوراً، وأي وقت تحتاجنا الدعم الفني معاك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className='py-24 px-4 text-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-muted/30 -skew-y-3 transform origin-bottom-left scale-110 z-0' />
        <div className='container mx-auto max-w-3xl relative z-10 space-y-8'>
          <h2 className='text-4xl md:text-6xl font-black leading-tight'>جاهز تنظم وقتك ومجهودك؟</h2>
          <p className='text-xl text-muted-foreground'>تواصل معنا الآن والحق آخر العروض</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button
              size='lg'
              className='h-12 px-10 text-xl rounded-full shadow-xl hover:scale-105 transition-transform'
              asChild
            >
              <Link href={WHATSAPP_LINK} target='_blank'>
                <span className='border-2 p-1 border-white rounded-full'>
                  <Phone />
                </span>
                <span>تواصل واتساب</span>
              </Link>
            </Button>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <CheckCircle2 className='w-4 h-4 text-green-600' />
              <span>دعم فني متواصل</span>
              <span className='mx-2'>•</span>
              <CheckCircle2 className='w-4 h-4 text-green-600' />
              <span>تحديثات مجانية</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
