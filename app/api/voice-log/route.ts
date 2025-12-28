// src/app/api/voice-log/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('file') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio detected' }, { status: 400 });
    }

    console.log("🎙️ Transcribing audio...");

    // 1. Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ms',
      prompt: "Nasi lemak, teh tarik, mamak, roti canai, kurang manis, pedas.",
    });

    const text = transcription.text;
    console.log("📝 Transcribed:", text);

    // 2. Generate Image (DALL-E 3)
    console.log("🎨 Generating image...");
    
    const imageGen = await openai.images.generate({
      model: "dall-e-3",
      // REFINED PROMPT: Authentic but Clean
      prompt: `A realistic photo of: ${text}. 
      Style: Authentic Malaysian hawker food photography. 
      Composition: Eye-level close-up, centered on a clean table. 
      Details: Include all standard authentic garnishes for the mentioned dishes (e.g. if Nasi Lemak, show peanuts, anchovies, cucumber, egg). 
      Lighting: Bright, natural, appetizing. 
      Restrictions: No messy background clutter, no random raw ingredients scatter.`,
      
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageBase64 = `data:image/png;base64,${imageGen.data[0].b64_json}`;

    return NextResponse.json({ 
      text, 
      image: imageBase64 
    });

  } catch (error: any) {
    console.error("Voice API Error:", error);
    return NextResponse.json({ error: error.message || 'Voice processing failed' }, { status: 500 });
  }
}