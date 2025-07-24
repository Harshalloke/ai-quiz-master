import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const dbOperations = {
  // Save quiz result
  async saveQuizResult(quizData: {
    topic: string;
    difficulty: string;
    questions: any[];
    score: number;
    totalQuestions: number;
    timeTaken: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        topic: quizData.topic,
        difficulty: quizData.difficulty,
        questions: quizData.questions,
        score: quizData.score,
        total_questions: quizData.totalQuestions,
        time_taken: quizData.timeTaken,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's quiz history
  async getUserQuizzes(limit = 10) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get user profile
  async getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(updates: {
    full_name?: string;
    avatar_url?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
