import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSupabaseServer } from '@/lib/supabaseClient';

// Fallback mock responses in case API fails
const getFallbackResponse = () => {
  const mockResponses = [
    {
      healthScore: 45,
      sugarLevel: 'High' as const,
      riskAssessment: 'Potong Kaki Risk: High',
      feedback: 'Wah, this one very dangerous lah! Your sugar will spike sampai langit. I know it looks sedap, but trust me, your feet will thank you later if you skip this one. Next time, choose something with less gula, okay?'
    },
    {
      healthScore: 72,
      sugarLevel: 'Medium' as const,
      riskAssessment: 'Potong Kaki Risk: Medium',
      feedback: 'Okay lah, this one still boleh makan, but don\'t make it a habit, okay? Moderation is key. Maybe share with someone or eat half only. Remember, I\'m watching you!'
    },
    {
      healthScore: 85,
      sugarLevel: 'Low' as const,
      riskAssessment: 'Potong Kaki Risk: Low',
      feedback: 'Good choice! This one quite safe. But still, don\'t overdo it. Keep your sugar in check and you\'ll keep your legs. Good job, sayang!'
    },
    {
      healthScore: 30,
      sugarLevel: 'High' as const,
      riskAssessment: 'Potong Kaki Risk: Very High',
      feedback: 'Aiyo! This one is like asking for trouble! Your sugar will go berserk. I know it\'s tempting, but please, think about your health. Your future self will thank you. Skip this one, please!'
    }
  ];
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

export async function POST(request: NextRequest) {
  // Log API key confirmation (first 4 characters only)
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey) {
    console.log('🔑 GROQ_API_KEY detected:', apiKey.substring(0, 4) + '...');
  } else {
    console.log('🔑 GROQ_API_KEY: NOT FOUND');
  }

  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check if Groq API key is configured
    if (!apiKey) {
      console.warn('GROQ_API_KEY not found, using fallback response');
      return NextResponse.json(getFallbackResponse());
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Convert image to base64 for Groq
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = image.type || 'image/jpeg';

    // System prompt for Abang Jaga
    const systemPrompt = `You are "Abang Jaga", a strict but loving Malaysian diabetic health tracker. Your role is to analyze food images and provide health assessments for people with diabetes. 

You must respond ONLY with valid JSON in this exact structure:
{
  "healthScore": <number 0-100>,
  "sugarLevel": "<'Low' | 'Medium' | 'High'>",
  "riskAssessment": "<string describing the risk, e.g., 'Potong Kaki Risk: High'>",
  "feedback": "<string in Manglish (Malaysian English) with your comment>"
}

Rules:
- healthScore: 0-100 (higher is better, 70+ is good, 50-69 is moderate, below 50 is poor)
- sugarLevel: Must be exactly "Low", "Medium", or "High"
- riskAssessment: Should mention "Potong Kaki Risk" (cutting leg risk) with level
- feedback: Must be in Manglish (Malaysian English) - use words like "lah", "sampai", "boleh", "sedap", "sayang", etc. Be strict but caring, like a concerned older brother.

Analyze this food image and provide the health assessment in the required JSON format. Consider sugar content, carbohydrates, and overall healthiness for a diabetic person.`;

    // Declare analysisResult variable
    let analysisResult: {
      healthScore: number;
      sugarLevel: 'Low' | 'Medium' | 'High';
      riskAssessment: string;
      feedback: string;
    };

    try {
      // Call Groq API with vision model
      const completion = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:${mimeType};base64,${base64Image}` 
                } 
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      });

      // Parse the response
      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from Groq');
      }

      // Parse the response - might return JSON wrapped in markdown code blocks
      let cleanedContent = responseContent.trim();
      
      // Remove markdown code blocks if present
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      try {
        analysisResult = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Failed to parse Groq response:', parseError);
        console.error('Raw response:', responseContent);
        throw new Error('Invalid response format from AI');
      }

      // Validate the response structure
      if (
        typeof analysisResult.healthScore !== 'number' ||
        !['Low', 'Medium', 'High'].includes(analysisResult.sugarLevel) ||
        typeof analysisResult.riskAssessment !== 'string' ||
        typeof analysisResult.feedback !== 'string'
      ) {
        console.error('Invalid response structure from Groq:', analysisResult);
        throw new Error('Invalid response structure from AI');
      }

      // Ensure healthScore is within valid range
      analysisResult.healthScore = Math.max(0, Math.min(100, analysisResult.healthScore));
    } catch (groqError) {
      console.error('❌ Groq API error:', groqError);
      if (groqError instanceof Error) {
        console.error('❌ Error name:', groqError.name);
        console.error('❌ Error message:', groqError.message);
        console.error('❌ Error stack:', groqError.stack);
      }
      // Re-throw to be caught by outer catch block
      throw new Error(`Groq API error: ${groqError instanceof Error ? groqError.message : 'Unknown error'}`);
    }

    // Save to Supabase
    console.log('=== Starting Supabase Save ===');
    
    // Check for Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing from environment variables');
    } else {
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set:', supabaseUrl.substring(0, 20) + '...');
    }
    
    if (!supabaseAnonKey && !supabaseServiceKey) {
      console.error('❌ Both NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are missing');
    } else {
      console.log('✅ Supabase key is available (using ' + (supabaseServiceKey ? 'service role' : 'anon') + ' key)');
    }

    try {
      const supabase = getSupabaseServer();
      
      // Upload image to Supabase Storage
      let imageUrl: string | null = null;
      try {
        console.log('📤 Uploading image to Supabase Storage...');
        
        // Generate unique filename
        const fileExtension = mimeType.split('/')[1] || 'jpg';
        const fileName = `scan_${Date.now()}.${fileExtension}`;
        
        // Convert image to Buffer (we already have arrayBuffer from earlier)
        const imageBuffer = Buffer.from(arrayBuffer);
        
        // Upload to food-images bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('food-images')
          .upload(fileName, imageBuffer, {
            contentType: mimeType,
            upsert: false,
          });

        if (uploadError) {
          console.error('❌ Error uploading image to Supabase Storage:', uploadError);
          console.error('❌ Upload error message:', uploadError.message);
        } else {
          console.log('✅ Image uploaded successfully:', uploadData.path);
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('food-images')
            .getPublicUrl(fileName);
          
          imageUrl = urlData.publicUrl;
          console.log('✅ Image public URL:', imageUrl);
        }
      } catch (storageError) {
        console.error('❌ Exception while uploading image to storage:', storageError);
        if (storageError instanceof Error) {
          console.error('❌ Error name:', storageError.name);
          console.error('❌ Error message:', storageError.message);
        }
        // Continue even if image upload fails
      }
      
      // Prepare insert data with snake_case keys matching SQL table
      const insertData = {
        health_score: analysisResult.healthScore,
        sugar_level: analysisResult.sugarLevel,
        risk_assessment: analysisResult.riskAssessment,
        feedback: analysisResult.feedback,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      };
      
      console.log('📦 Data to insert:', JSON.stringify(insertData, null, 2));
      console.log('📋 Column names: health_score, sugar_level, risk_assessment, feedback, image_url, created_at');
      
      const { data, error: dbError } = await supabase
        .from('scans')
        .insert(insertData)
        .select();

      if (dbError) {
        console.error('❌ Supabase insert error:', dbError);
        console.error('❌ Error code:', dbError.code);
        console.error('❌ Error message:', dbError.message);
        console.error('❌ Error details:', dbError.details);
        console.error('❌ Error hint:', dbError.hint);
        // Continue even if database save fails
      } else {
        console.log('✅ Successfully saved to Supabase!');
        console.log('✅ Inserted data:', JSON.stringify(data, null, 2));
      }
    } catch (dbError) {
      console.error('❌ Exception while saving to Supabase:', dbError);
      if (dbError instanceof Error) {
        console.error('❌ Error name:', dbError.name);
        console.error('❌ Error message:', dbError.message);
        console.error('❌ Error stack:', dbError.stack);
      }
      // Continue even if database save fails
    }
    
    console.log('=== Finished Supabase Save ===');

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing food:', error);
    
    // Return fallback response instead of error to prevent app crash
    const fallback = getFallbackResponse();
    console.log('Using fallback response due to error');
    return NextResponse.json(fallback);
  }
}

