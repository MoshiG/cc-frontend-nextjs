"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Camera, X } from "lucide-react"

interface Props {
  onScan: (tokenId: string, manifestHash?: string) => void
}

export function QRScanner({ onScan }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animRef = useRef<number | null>(null)

  const stopCamera = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setError("Camera access denied or not available")
    }
  }, [])

  useEffect(() => {
    if (!open) {
      stopCamera()
      return
    }
    startCamera()

    return () => stopCamera()
  }, [open, startCamera, stopCamera])

  useEffect(() => {
    if (!open) return

    let active = true

    async function tick() {
      if (!active || !videoRef.current) return

      const video = videoRef.current
      if (video.readyState < 2) {
        animRef.current = requestAnimationFrame(tick)
        return
      }

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(video, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const jsQR = (await import("jsqr")).default
      const code = jsQR(imageData.data, canvas.width, canvas.height)

      if (code?.data) {
        // Try to parse URL params from the QR data
        try {
          const url = new URL(code.data)
          const t = url.searchParams.get("t") ?? ""
          const h = url.searchParams.get("h") ?? undefined
          if (t) {
            onScan(t, h)
            setOpen(false)
            return
          }
        } catch {
          // If it's not a URL, treat as raw token_id
          onScan(code.data.trim())
          setOpen(false)
          return
        }
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      active = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [open, onScan])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Camera className="h-4 w-4 mr-1" />
        Scan QR
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Scan Certificate QR Code
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {error ? (
            <p className="text-destructive text-sm p-4 text-center">{error}</p>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Targeting overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/70 rounded-lg" />
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Point camera at a MyChetiChain certificate QR code
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
