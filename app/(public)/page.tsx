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
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=السلام عليكم، أنا مدرس ومهتم بنظام الإدارة وعايز أعرف التفاصيل`

  return (
    <div className='flex flex-col min-h-screen bg-background overflow-hidden'>
      {/* --- HERO SECTION --- */}
      <section className='relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-40 min-h-[85vh]'>
        {/* Animated Gradient Background */}
        <div className='absolute inset-0 bg-linear-to-b from-accent/20 via-background to-background'>
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent animate-pulse' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent animate-pulse [animation-delay:1s]' />
        </div>

        {/* Mesh Pattern Overlay */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className='max-w-5xl space-y-8 z-10 relative'>
          <Badge
            variant='outline'
            className='px-4 py-1.5 text-sm font-medium text-primary border-primary/20 bg-primary/10 backdrop-blur-sm rounded-full shadow-sm'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 inline-block' />
            النظام الأذكى للمدرس المصري 🇪🇬
          </Badge>

          <h1 className='text-5xl md:text-8xl font-black tracking-tight text-foreground leading-tight'>
            نظم مجموعاتك وطلابك <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-primary via-primary to-accent'>
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
              className='text-lg h-14 px-8 rounded-full  hover:opacity-90 transition-opacity shadow-lg shadow-primary/25'
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
              className='text-lg h-14 px-8 rounded-full border-2 border-primary/20 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all'
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
      <section className='relative py-16'>
        <div className='absolute inset-0 bg-background' />
        <div className='container mx-auto px-4 relative z-10'>
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
      <section id='features' className='container mx-auto px-4 py-24 relative'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50' />

        <div className='text-center mb-16 space-y-4 relative z-10'>
          <h2 className='text-3xl md:text-5xl font-black'>ليه تشترك معانا؟ 🤔</h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            أدوات مصممة خصيصاً لاحتياجات المدرس، مش مجرد برنامج محاسبة.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className='relative py-24'>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-16'>
            <Badge variant='secondary' className='mb-4 backdrop-blur-sm bg-primary/10'>
              ابدأ في 3 خطوات
            </Badge>
            <h2 className='text-3xl md:text-5xl font-black mb-4'>رحلة الانضمام ⚡</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
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
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                />
                <div className='relative p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/10 h-full flex flex-col items-center text-center hover:border-primary/30 transition-all'>
                  <div className='w-16 h-16 mb-6 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl shadow-lg'>
                    {step.emoji}
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{step.title}</h3>
                  <p className='text-muted-foreground'>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className='py-24 px-4 text-center relative overflow-hidden'>
        {/* Animated Gradient Background */}
        <div className='absolute inset-0 bg-linear-to-t from-accent/50 via-background to-background'/>
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className='container mx-auto max-w-3xl relative z-10'>
          <div className='backdrop-blur-xl bg-background/80 p-12 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10'>
            <h2 className='text-4xl md:text-6xl font-black leading-tight mb-6'>
              جاهز تنظم وقتك ومجهودك؟
            </h2>
            <p className='text-xl text-muted-foreground mb-8'>تواصل معنا الآن والحق آخر العروض</p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button
                size='lg'
                className='h-14 px-10 text-xl rounded-full  hover:opacity-90 transition-opacity shadow-xl'
                asChild
              >
                <Link href={WHATSAPP_LINK} target='_blank'>
                  <Phone className='w-5 h-5 ml-2' />
                  تواصل واتساب
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
        </div>
      </section>
    </div>
  )
}
