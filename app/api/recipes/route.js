import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request) {
  const { ingredients } = await request.json();

  const prompt = `Suggest recipes using the following ingredients: ${ingredients.join(', ')} Response format: 1.<Title of recipe> | <URL of recipe>\n2.<Title of recipe>| <URL of recipe> Note: In case of no suggestions, just respond: No suggestions, In case of more ingredients required repond <Title of recipe> | <URL of recipe>\nMissing Ingredients: <Mising ingredients>`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    
    const suggestions = text.split('\n').map(line => {
        const [recipe, url] = line.split('|');
        return { recipe, url };
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    return NextResponse.json({ error: 'Unable to fetch recipe suggestions.' });
  }
}
