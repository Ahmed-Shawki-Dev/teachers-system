'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '../ui/button'

const LogoutButton = () => {
  const router = useRouter()
  const Logout = async () => {
    const req = await fetch('/api/logout', { method: 'POST' })
    const message = await req.json()
    toast.success(message.message)
    router.push('/')
    window.location.reload()
  }

  return (
    <Button type='submit' variant={'destructive'} onClick={Logout}>
      هخرج
    </Button>
  )
}

export default LogoutButton
