// src/app/api/voice-log/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic so it doesn't try to cache (which breaks Vercel)
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Transcribe Audio (Voice -> Text)
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    const text = transcription.text;

    // 2. Generate Image from Text (Text -> Image)
    // We ask DALL-E 3 to visualize the food described
    const imageGen = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A delicious, realistic food photography shot of: ${text}. The lighting is natural and appetizing. High resolution.`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json", 
    });

    // 🛡️ SAFETY CHECK (Fixes the Build Error)
    if (!imageGen.data || !imageGen.data[0] || !imageGen.data[0].b64_json) {
       throw new Error("Failed to generate image data from OpenAI");
    }

    const imageBase64 = `data:image/png;base64,${imageGen.data[0].b64_json}`;

    return NextResponse.json({ 
      text, 
      image: imageBase64 
    });

  } catch (error: any) {
    console.error("Voice Log Error:", error);
    return NextResponse.json({ error: error.message || "Processing failed" }, { status: 500 });
  }
}