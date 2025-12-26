'use client'

import { Download, Image as ImageIcon, Loader2, Maximize2, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { client } from '@/lib/orpc/client'
import { cn } from '@/lib/utils'

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    // Optional: Clear images to show loading state for new generation specifically or keep history.
    // Let's clear for now to focus on the 'generating' experience.
    setImages([])

    try {
      const result = await client.image.generateImage({ prompt })
      setImages(result.images)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Image display area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Animated gradient background */}
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-linear-to-br from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20">
                  {/* Animated shimmer overlay */}
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                    style={{
                      animation: 'shimmer 2s infinite',
                    }}
                  />

                  {/* Center icon with pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Outer ring */}
                      <div
                        className="absolute -inset-8 animate-ping rounded-full border-2 border-primary/30"
                        style={{ animationDuration: '2s' }}
                      />
                      <div className="absolute -inset-4 animate-pulse rounded-full border border-primary/50" />

                      {/* Inner content */}
                      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-background/80 shadow-xl backdrop-blur-sm">
                        <Sparkles className="size-8 animate-pulse text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Floating dots animation */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute size-2 rounded-full bg-primary/40"
                        style={{
                          left: `${20 + i * 12}%`,
                          top: `${30 + (i % 3) * 20}%`,
                          animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p
                    className="inline-block bg-linear-to-r bg-size-[300%_100%] from-primary/30 via-primary to-primary/30 bg-clip-text font-medium text-lg text-transparent"
                    style={{
                      animation: 'text-shimmer 3s ease-in-out infinite alternate',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    Creating your masterpiece
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">This may take a moment...</p>
                </div>
              </div>

              {/* CSS animations */}
              <style jsx>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                  50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
                }
                @keyframes text-shimmer {
                  0% { background-position: 100% center; }
                  100% { background-position: 0% center; }
                }
              `}</style>
            </div>
          ) : images.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="group relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-md transition-all hover:shadow-xl"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-zoom-in">
                        <img
                          src={src}
                          alt={`Generated image ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    </DialogTrigger>

                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                        asChild
                        title="Save Image"
                      >
                        <a
                          href={`${src}${src.includes('?') ? '&' : '?'}download=1`}
                          download={`generated-image-${index + 1}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>

                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                          title="View Fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </div>

                    <DialogContent
                      showCloseButton={false}
                      className="pointer-events-none max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-[90vw]"
                    >
                      <div className="relative flex items-center justify-center">
                        <DialogTitle className="sr-only">View Image</DialogTitle>
                        {/* Action buttons */}
                        <div className="pointer-events-auto absolute -top-2 -right-2 z-10 flex gap-2 sm:-top-4 sm:-right-4">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 rounded-full opacity-90 transition-opacity hover:opacity-100"
                            asChild
                            title="Download Image"
                          >
                            <a
                              href={`${src}${src.includes('?') ? '&' : '?'}download=1`}
                              download={`generated-image-${index + 1}`}
                              target="_blank"
                            >
                              <Download className="h-5 w-5" />
                            </a>
                          </Button>
                          <DialogClose asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-10 w-10 rounded-full opacity-90 transition-opacity hover:opacity-100"
                              title="Close"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </DialogClose>
                        </div>
                        <img
                          src={src}
                          alt={`Generated Fullscreen ${index + 1}`}
                          className="pointer-events-auto max-h-[90vh] w-auto rounded-lg object-contain shadow-2xl"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          ) : (
            <div className="fade-in zoom-in flex h-full min-h-[50vh] animate-in flex-col items-center justify-center text-center text-muted-foreground duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                <div className="relative flex size-24 items-center justify-center rounded-3xl bg-muted/50 backdrop-blur-sm">
                  <ImageIcon className="size-10 opacity-50" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground text-xl">Ready to Create</h3>
              <p className="max-w-sm text-sm">
                Enter a descriptive prompt below to generate unique AI artwork instantly.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              <p className="font-medium">Generation Failed</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="relative z-10 border-t bg-background/80 p-4 backdrop-blur-lg sm:p-6">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleGenerate()
            }}
            className="flex gap-3"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at sunset, vaporwave style..."
              disabled={isLoading}
              className="h-12 flex-1 rounded-full border-muted bg-background/50 px-6 shadow-sm transition-all focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              size="lg"
              className={cn(
                'h-12 rounded-full px-8 font-medium transition-all',
                isLoading ? 'w-32' : 'w-auto',
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="animate-pulse">Working</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-amber-200" />
                  Generate
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
