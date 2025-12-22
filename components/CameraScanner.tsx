'use client'

import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useEffect, useRef } from 'react'

export default function CameraScanner({ onScan }: { onScan: (code: string) => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = 'reader'
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastScannedCode = useRef<string | null>(null)
  const lastScannedTime = useRef<number>(0)
  const isMounted = useRef(true) // ✅ تتبع هل المكون موجود ولا لأ

  useEffect(() => {
    isMounted.current = true
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio(
        'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
      )
      audioRef.current.volume = 0.5
    }
    return () => {
      isMounted.current = false
    }
  }, [])

  const playBeep = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {})
    }
  }

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerContainerId)
        }

        const scanner = scannerRef.current

        // ✅ تجنب البدء لو الحالة مش مناسبة
        try {
          if (
            scanner.getState() === Html5QrcodeScannerState.SCANNING ||
            scanner.getState() === Html5QrcodeScannerState.PAUSED
          ) {
            return
          }
        } catch (e) {
          // getState might throw if not initialized yet, safe to ignore here
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

        if (isMounted.current) {
          await scanner.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              const now = Date.now()
              if (decodedText === lastScannedCode.current && now - lastScannedTime.current < 2500) {
                return
              }
              lastScannedCode.current = decodedText
              lastScannedTime.current = now
              playBeep()
              onScan(decodedText)
            },
            (errorMessage) => {},
          )
        }
      } catch (err) {
        console.warn('Scanner start warning:', err)
      }
    }

    const timer = setTimeout(() => {
      startScanner()
    }, 100)

    // 👇👇👇 التنظيف الآمن جداً 👇👇👇
    return () => {
      clearTimeout(timer)
      if (scannerRef.current) {
        try {
          const scanner = scannerRef.current
          // ✅ أهم سطر: ممنوع تعمل stop إلا لو هو شغال فعلاً
          // المكتبة بتضرب إيرور لو عملت stop وهو مش running
          if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            scanner
              .stop()
              .catch((err) => console.warn('Stop failed:', err))
              .finally(() => {
                scannerRef.current = null
              })
          } else {
            // لو مش شغال، بس فضي الرف
            scannerRef.current = null
          }
        } catch (e) {
          console.warn('Cleanup warning')
        }
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
