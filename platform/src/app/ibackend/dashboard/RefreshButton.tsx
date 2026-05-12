'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)

  const handleRefresh = () => {
    setIsFetching(true)
    startTransition(() => {
      router.refresh()
      setTimeout(() => setIsFetching(false), 500)
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending || isFetching}
      className="border-slate-200 hover:bg-slate-50"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
      刷新数据
    </Button>
  )
}