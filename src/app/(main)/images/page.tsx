"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/orpc/client";
import { Loader2, Sparkles, ImageIcon } from "lucide-react";

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.image.generateImage({ prompt });
      setImages(result.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Image display area */}
      <div className="flex-1 overflow-auto p-4">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <img
                  src={src}
                  alt={`Generated image ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="mb-4 size-16 opacity-20" />
            <p className="text-lg">Enter a prompt to generate images</p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="mx-auto flex max-w-2xl gap-2"
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles />
                Generate
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}