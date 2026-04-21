'use client'

import MuxPlayer from '@mux/mux-player-react'

interface Props {
  playbackId: string
  title?: string
}

export function MuxVideoPlayer({ playbackId, title }: Props) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title ?? 'Interview' }}
      className="w-full aspect-video rounded-[1rem] overflow-hidden"
    />
  )
}
