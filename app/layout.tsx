import type { Metadata } from 'next'
import { Geist_Mono, Cairo, Tajawal } from 'next/font/google' // 👈 1. استيراد Tajawal
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '../components/ui/sonner'
import { EdgeStoreProvider } from '../lib/edgestore'
import './globals.css'

// خط الداشبورد (كايرو - عملي)
const cairoSans = Cairo({
  variable: '--font-sans',
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800'],
})

// 👈 2. خط اللاندنج (تجوال - شيك وهادي)
const tajawalFont = Tajawal({
  variable: '--font-serif', // هنسيب الاسم serif عشان يشتغل في اللاندنج علطول
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'الدفتر',
  description: 'منصة إدارة المدرسين',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ar' dir='rtl' suppressHydrationWarning>
      {/* 👈 3. تفعيل المتغير */}
      <body
        className={`${cairoSans.variable} ${geistMono.variable} ${tajawalFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <EdgeStoreProvider>{children}</EdgeStoreProvider>

          <Toaster position='bottom-right' richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
