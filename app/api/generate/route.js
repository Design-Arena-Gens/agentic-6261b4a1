import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { prompt, style } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY tidak ditemukan. Silakan tambahkan di environment variables.'
      });
    }

    const openai = new OpenAI({ apiKey });

    const stylePrompts = {
      realistic: 'photorealistic, highly detailed, professional photography',
      anime: 'anime style, manga art, Japanese animation style',
      sketch: 'pencil sketch, hand-drawn, black and white sketch art',
      watercolor: 'watercolor painting, soft colors, artistic watercolor style',
      oil: 'oil painting, classical art, rich textures, painted canvas',
      digital: 'digital art, modern illustration, vibrant colors, clean lines',
      portrait: 'classical portrait painting, Renaissance style, fine art',
      abstract: 'abstract modern art, contemporary style, artistic interpretation'
    };

    const enhancedPrompt = `${stylePrompts[style] || stylePrompts.realistic}. ${prompt}. High quality, artistic, beautiful composition, professional artwork.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Gagal membuat gambar'
    }, { status: 500 });
  }
}
