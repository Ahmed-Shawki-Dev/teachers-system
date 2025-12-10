import type { Metadata } from 'next'
import { Geist_Mono, Cairo } from 'next/font/google'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '../components/ui/sonner'
import { EdgeStoreProvider } from '../lib/edgestore'
import './globals.css'

const cairoSans = Cairo({
  variable: '--font-sans',
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'أستاذ',
  description: 'منصة إدارة المدرسين',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ar' dir='rtl' suppressHydrationWarning>
      <body className={`${cairoSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <EdgeStoreProvider>{children}</EdgeStoreProvider>

          <Toaster position='top-center' richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
