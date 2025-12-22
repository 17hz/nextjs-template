import * as z from "zod";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { authorized } from "../builders/authorized";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateImage = authorized
  .input(
    z.object({
      prompt: z.string().min(1, "Prompt is required").max(1000),
    })
  )
  .handler(async ({ input }) => {

    const tools = [
      {
        googleSearch: {
        }
      },
    ];
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
      imageConfig: {
        imageSize: '1K',
      },
      tools,
    };
    const model = 'gemini-3-pro-image-preview';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: input.prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model, 
      config,
      contents
    });

    const images: string[] = [];

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const base64 = part.inlineData.data;
        const mimeType = part.inlineData.mimeType ?? "image/png";
        const extension = mimeType.split("/")[1] ?? "png";
        
        // Upload to Vercel Blob
        const buffer = Buffer.from(base64, "base64");
        const { url } = await put(`images/${nanoid()}.${extension}`, buffer, {
          access: "public",
          contentType: mimeType,
        });
        
        images.push(url);
      }
    }

    if (images.length === 0) {
      throw new Error("No image was generated");
    }

    return { images };
  });

