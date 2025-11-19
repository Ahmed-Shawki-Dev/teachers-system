// lib/useTeacher.ts
import useSWR from 'swr'

export function useTeacher() {
  const { data, error, isLoading } = useSWR('/api/me', (url) =>
    fetch(url).then((res) => res.json()),
  )
  return {
    teacher: data?.auth ? data : null,
    teacherId: data?.auth ? data.id : null,
    isLoading,
    isError: error || !data?.auth,
  }
}
