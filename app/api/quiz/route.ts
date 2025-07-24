import { NextRequest, NextResponse } from 'next/server';
import { generateQuizQuestions } from '../../../lib/geminiClient';

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, numberOfQuestions } = await request.json();

    if (!topic || !difficulty || !numberOfQuestions) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const questions = await generateQuizQuestions(topic, difficulty, numberOfQuestions);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}
