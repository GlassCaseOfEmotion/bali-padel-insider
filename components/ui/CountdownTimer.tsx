'use client'

import { useState, useEffect, useCallback } from 'react'

interface Props {
  deadline: string
}

export function CountdownTimer({ deadline }: Props) {
  const calculate = useCallback(() => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
    const total = Math.floor(diff / 1000)
    return {
      hours: Math.floor(total / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    }
  }, [deadline])

  const [time, setTime] = useState(calculate)

  useEffect(() => {
    const id = setInterval(() => setTime(calculate()), 1000)
    return () => clearInterval(id)
  }, [calculate])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <span className="font-headline font-black tabular-nums tracking-tighter text-4xl">
      {pad(time.hours)} : {pad(time.minutes)} : {pad(time.seconds)}
    </span>
  )
}
