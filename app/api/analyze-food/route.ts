import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSupabaseServer } from '@/lib/supabaseClient';

// Fallback mock responses in case API fails
const getFallbackResponse = () => {
  const mockResponses = [
    {
      ingredients: ['Rice', 'Coconut milk', 'Sambal', 'Anchovies'],
      macros: {
        carbs: { value: '65g', status: 'High' },
        protein: { value: '12g', status: 'Low' },
        fat: { value: '28g', status: 'High' },
        calories: { value: '550', status: 'High' }
      },
      glycemic_index: 'High',
      health_score: 45,
      analysis_points: [
        'High glycemic index carbohydrates from white rice will cause rapid glucose elevation.',
        'Coconut milk adds significant saturated fat, increasing cardiovascular risk for diabetics.',
        'Estimated carbohydrate load exceeds recommended portions for diabetic management.'
      ],
      actionable_advice: [
        'Reduce portion size by 50% to manage carbohydrate intake.',
        'Pair with lean protein source to slow glucose absorption.',
        'Monitor blood glucose 2 hours post-meal to assess individual response.'
      ]
    },
    {
      ingredients: ['Grilled chicken', 'Mixed vegetables', 'Brown rice'],
      macros: {
        carbs: { value: '35g', status: 'Moderate' },
        protein: { value: '28g', status: 'Good' },
        fat: { value: '12g', status: 'Moderate' },
        calories: { value: '380', status: 'Moderate' }
      },
      glycemic_index: 'Medium',
      health_score: 75,
      analysis_points: [
        'Balanced macronutrient profile with moderate carbohydrate content.',
        'Fiber from vegetables and whole grain rice supports stable glucose response.',
        'Adequate protein supports satiety and metabolic health.'
      ],
      actionable_advice: [
        'This meal is appropriate for diabetic management with proper portion control.',
        'Consume vegetables first, followed by protein, then carbohydrates to optimize glucose response.',
        'Maintain consistent meal timing to support glycemic stability.'
      ]
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

    // System prompt for Professional Malaysian Clinical Dietitian
    const systemPrompt = `You are a Professional Malaysian Clinical Dietitian (Dr. Reza style). You are highly educated, a medical authority, but culturally grounded and warm. Your approach is to acknowledge the cultural love for Malaysian food first, then deliver the hard medical truth with empathy.

CRITICAL: You must respond ONLY with valid JSON (no markdown, no code blocks, just pure JSON) in this exact structure:
{
  "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
  "macros": {
    "carbs": { "value": "45g", "status": "High" },
    "protein": { "value": "25g", "status": "Good" },
    "fat": { "value": "15g", "status": "Moderate" },
    "calories": { "value": "450", "status": "High" }
  },
  "glycemic_index": "High",
  "health_score": 65,
  "analysis_points": [
    "Short, punchy bullet point about the food's impact.",
    "Second point about the ingredients."
  ],
  "actionable_advice": [
    "Specific advice on how to eat this safely.",
    "Another tip regarding portion control."
  ]
}

Rules:
- ingredients: Array of identifiable food components from the image
- macros: Each macro (carbs, protein, fat, calories) must have "value" (string with unit) and "status" (one of: "Low", "Moderate", "High", "Good")
- glycemic_index: Must be exactly "Low", "Medium", or "High" based on carbohydrate type and processing
- health_score: 0-100 (higher is better, 70+ is good, 50-69 is moderate, below 50 is poor)
- analysis_points: Array of short, punchy bullet points explaining the food's impact on glucose and health
- actionable_advice: Array of specific, practical recommendations for diabetic management

Tone and Language:
- Use Standard Professional English with refined Manglish (e.g., 'kaw', 'potong kaki', 'cheat day') naturally, but NOT crude slang
- Acknowledge the cultural love for the food first, then deliver the hard medical truth
- Be warm, empathetic, but authoritative and medically precise
- Example: "I understand this nasi lemak is sedap kaw, but from a clinical perspective, the white rice and coconut milk combination will spike your glucose significantly. The risk of potong kaki is real if we don't manage this properly."

Return ONLY the JSON object, nothing else.`;

    // Declare analysisResult variable
    let analysisResult: {
      ingredients: string[];
      macros: {
        carbs: { value: string; status: string };
        protein: { value: string; status: string };
        fat: { value: string; status: string };
        calories: { value: string; status: string };
      };
      glycemic_index: 'Low' | 'Medium' | 'High';
      health_score: number;
      analysis_points: string[];
      actionable_advice: string[];
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
        max_tokens: 800,
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
        !Array.isArray(analysisResult.ingredients) ||
        typeof analysisResult.macros !== 'object' ||
        typeof analysisResult.macros.carbs !== 'object' ||
        typeof analysisResult.macros.carbs.value !== 'string' ||
        typeof analysisResult.macros.carbs.status !== 'string' ||
        typeof analysisResult.macros.protein !== 'object' ||
        typeof analysisResult.macros.protein.value !== 'string' ||
        typeof analysisResult.macros.protein.status !== 'string' ||
        typeof analysisResult.macros.fat !== 'object' ||
        typeof analysisResult.macros.fat.value !== 'string' ||
        typeof analysisResult.macros.fat.status !== 'string' ||
        typeof analysisResult.macros.calories !== 'object' ||
        typeof analysisResult.macros.calories.value !== 'string' ||
        typeof analysisResult.macros.calories.status !== 'string' ||
        !['Low', 'Medium', 'High'].includes(analysisResult.glycemic_index) ||
        typeof analysisResult.health_score !== 'number' ||
        !Array.isArray(analysisResult.analysis_points) ||
        !Array.isArray(analysisResult.actionable_advice)
      ) {
        console.error('Invalid response structure from Groq:', analysisResult);
        throw new Error('Invalid response structure from AI');
      }

      // Ensure health_score is within valid range
      analysisResult.health_score = Math.max(0, Math.min(100, analysisResult.health_score));
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
        ingredients: JSON.stringify(analysisResult.ingredients),
        macros: JSON.stringify(analysisResult.macros),
        glycemic_index: analysisResult.glycemic_index,
        health_score: analysisResult.health_score,
        analysis_points: JSON.stringify(analysisResult.analysis_points),
        actionable_advice: JSON.stringify(analysisResult.actionable_advice),
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      };
      
      console.log('📦 Data to insert:', JSON.stringify(insertData, null, 2));
      console.log('📋 Column names: ingredients, macros, glycemic_index, health_score, analysis_points, actionable_advice, image_url, created_at');
      
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

