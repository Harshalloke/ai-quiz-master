import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuizQuestions(
  topic: string,
  difficulty: string,
  numberOfQuestions: number
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions on the topic "${topic}" with ${difficulty} difficulty.

Each question should have:
- Question text
- Four options
- Correct answer
- Brief explanation

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "answer": "Paris",
    "explanation": "Paris is the capital and largest city of France."
  }
]

Make sure the JSON is properly formatted and parseable. Do not include any other text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response text
    text = text.trim();
    
    // Remove markdown code blocks
    const codeBlockPatterns = [
      /^```json\s*/i,
      /^```\s*/,
      /\s*```$/
    ];
    
    codeBlockPatterns.forEach(pattern => {
      text = text.replace(pattern, '');
    });
    
    text = text.trim();
    
    // Extract JSON array more robustly
    const startBracket = text.indexOf('[');
    const endBracket = text.lastIndexOf(']');
    
    if (startBracket === -1 || endBracket === -1 || startBracket >= endBracket) {
      throw new Error('No valid JSON array found in response');
    }
    
    text = text.substring(startBracket, endBracket + 1);
    
    try {
      const questions = JSON.parse(text);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      if (questions.length === 0) {
        throw new Error('No questions found in response');
      }
      
      // Validate and transform questions
      const validatedQuestions: QuizQuestion[] = questions.map((q: any, index: number) => {
        // Validate question
        if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
          throw new Error(`Invalid or empty question at index ${index}`);
        }
        
        // Validate options
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question at index ${index} must have exactly 4 options`);
        }
        
        // Check if all options are valid strings
        const validOptions = q.options.every((opt: any) => 
          opt !== null && opt !== undefined && String(opt).trim() !== ''
        );
        
        if (!validOptions) {
          throw new Error(`Invalid options at index ${index} - all options must be non-empty`);
        }
        
        // Validate answer
        if (!q.answer || typeof q.answer !== 'string' || q.answer.trim() === '') {
          throw new Error(`Invalid or empty answer at index ${index}`);
        }
        
        // Validate explanation
        if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim() === '') {
          throw new Error(`Invalid or empty explanation at index ${index}`);
        }
        
        const cleanOptions = q.options.map((opt: any) => String(opt).trim());
        const cleanAnswer = q.answer.trim();
        
        // Verify that the answer is one of the options
        if (!cleanOptions.includes(cleanAnswer)) {
          throw new Error(`Answer "${cleanAnswer}" at index ${index} is not among the provided options`);
        }
        
        return {
          question: q.question.trim(),
          options: cleanOptions,
          answer: cleanAnswer,
          explanation: q.explanation.trim()
        };
      });
      
      // Final check: ensure we got the requested number of questions
      if (validatedQuestions.length !== numberOfQuestions) {
        console.warn(`Requested ${numberOfQuestions} questions but got ${validatedQuestions.length}`);
      }
      
      return validatedQuestions;
      
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Text attempted to parse:', text);
      throw new Error(`Failed to parse quiz questions: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }
    
  } catch (error: any) {
    console.error('Generation error:', error);
    
    // Handle specific API errors
    if (error.message?.includes('API_KEY') || error.message?.includes('authentication')) {
      throw new Error('Invalid Gemini API key. Please check your environment variables.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new Error('API quota exceeded or rate limited. Please try again later.');
    }
    
    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      throw new Error('Content was blocked by safety filters. Try a different topic or phrasing.');
    }
    
    // Re-throw validation errors as-is
    if (error.message?.includes('Invalid') || error.message?.includes('parse')) {
      throw error;
    }
    
    throw new Error(`Failed to generate quiz questions: ${error.message || 'Unknown error'}`);
  }
}