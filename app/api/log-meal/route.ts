import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { 
      meal_name, 
      calories, 
      protein, 
      carbs, 
      fat,
      sodium,
      sugar,
      portion_size, 
      image_base64,
      user_id,
      components,
      analysis_content,
      health_tags
    } = await req.json();

    let image_url = null;

    // Upload image to Supabase Storage if provided
    if (image_base64) {
      try {
        // Convert base64 to blob
        const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Generate unique filename
        const filename = `meal_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meal-images')
          .upload(filename, buffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('meal-images')
            .getPublicUrl(filename);
          
          image_url = urlData.publicUrl;
        }
      } catch (imgErr) {
        console.error('Image processing error:', imgErr);
      }
    }

    // Insert meal log into database (including sodium_mg and sugar_g)
    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        meal_name,
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        sodium: sodium ? Math.round(sodium) : null,
        sugar: sugar ? Math.round(sugar * 10) / 10 : null, // Keep 1 decimal for sugar
        portion_size: portion_size || 1.0,
        image_url,
        user_id: user_id || null,
        components: components || null,
        analysis_data: analysis_content || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      image_url 
    });

  } catch (err: any) {
    console.error('Log meal error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}

