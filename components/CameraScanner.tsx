'use client'

import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useEffect, useRef } from 'react'

export default function CameraScanner({ onScan }: { onScan: (code: string) => void }) {
  // بنستخدم Ref عشان نحتفظ بنسخة السكانر ونعرف نتحكم فيها
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = 'reader'

  // Ref عشان نمنع تكرار القراءة لنفس الكود في وقت قصير (Debounce)
  const lastScannedCode = useRef<string | null>(null)
  const lastScannedTime = useRef<number>(0)

  useEffect(() => {
    // 1. تعريف دالة الصوت
    const playBeep = () => {
      const audio = new Audio(
        'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
      )
      audio.volume = 0.5
      audio.play().catch(() => {})
    }

    // دالة لبدء السكانر
    const startScanner = async () => {
      try {
        // لو مفيش instance، نعمل واحدة جديدة
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerContainerId)
        }

        const scanner = scannerRef.current

        // لو السكانر شغال أو بيحمل، منعملش حاجة
        if (
          scanner.getState() === Html5QrcodeScannerState.SCANNING ||
          scanner.getState() === Html5QrcodeScannerState.PAUSED
        ) {
          return
        }

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
          ],
        }

        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            const now = Date.now()
            // Debounce Logic: 2.5 ثانية لنفس الكود
            if (decodedText === lastScannedCode.current && now - lastScannedTime.current < 2500) {
              return
            }

            lastScannedCode.current = decodedText
            lastScannedTime.current = now

            playBeep()
            onScan(decodedText)
          },
          (errorMessage) => {
            // ignore errors
          },
        )
      } catch (err) {
        console.warn('Scanner start warning:', err)
        // منتطلعش ايرور لليوزر لو المشكلة بس في الترانزيشن
      }
    }

    // تأخير بسيط عشان نضمن ان الـ DOM جاهز والـ Strict Mode هدي
    const timer = setTimeout(() => {
      startScanner()
    }, 100)

    // Cleanup Function (أهم حتة)
    return () => {
      clearTimeout(timer)
      if (scannerRef.current) {
        // بنحاول نوقف السكانر وننضف الذاكرة
        scannerRef.current
          .stop()
          .then(() => {
            return scannerRef.current?.clear()
          })
          .catch((err) => {
            console.warn('Error stopping scanner:', err)
          })
          .finally(() => {
            // تفريغ المتغير تماماً
            scannerRef.current = null
          })
      }
    }
  }, [onScan])

  return (
    <div className='bg-black mx-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-primary shadow-lg relative'>
      <div id={scannerContainerId} className='h-[300px] w-full'></div>
      <div className='absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center text-xs text-white z-10'>
        يتم المسح تلقائياً...
      </div>
    </div>
  )
}
