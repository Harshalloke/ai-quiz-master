# Quiz Master AI - Complete README

A modern, AI-powered quiz application built with Next.js that generates personalized quizzes using Google's Gemini AI. Users can create custom quizzes on any topic, track their progress, and improve their knowledge through intelligent question generation.

## 🌟 Features

- **AI-Powered Quiz Generation**: Leverages Google Gemini AI to create custom questions on any topic
- **Adaptive Difficulty Levels**: Choose from Easy, Medium, or Hard difficulty settings
- **User Authentication**: Secure sign-up/sign-in with email and Google OAuth integration
- **Progress Tracking**: Comprehensive profile dashboard with quiz history and performance analytics
- **Real-time Timer**: Timed quizzes with automatic submission
- **Detailed Results**: Instant feedback with explanations for each answer
- **Responsive Design**: Works seamlessly across all devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🚀 Live Demo

**[View Live Application](https://ai-quiz-master-delta.vercel.app/)**

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **AI Integration**: Google Gemini Pro API
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📱 Screenshots

### Landing Page


### Quiz Setup
![Quiz Setup](./docs/screenshots/setupe
![Results](./docs/screenshots/results.pngtart

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Platform account with Gemini API access

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-quiz-master.git
cd ai-quiz-master
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL_NAME=gemini-1.5-pro
```

### 4. Database Setup

Run the following SQL in your Supabase SQL Editor:


Click to view database schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  questions JSONB NOT NULL,
  score INTEGER,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own quizzes" ON public.quizzes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```



### 5. Configure Authentication

#### Supabase Auth Settings:
1. Go to Authentication → Settings in your Supabase dashboard
2. Add your site URL: `http://localhost:3000` (development)
3. Add redirect URLs: `http://localhost:3000/**`

#### Google OAuth (Optional):
1. Create a Google Cloud project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Configure in Supabase Authentication → Providers

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-quiz-master/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── setup/             # Quiz setup page
│   ├── quiz/              # Quiz interface
│   ├── result/            # Results page
│   ├── auth/              # Authentication page
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── Layout.tsx         # Navigation wrapper
│   ├── AuthForm.tsx       # Authentication form
│   ├── QuizQuestion.tsx   # Quiz question component
│   └── Timer.tsx          # Quiz timer
├── lib/                   # Utility libraries
│   ├── supabaseClient.ts  # Supabase configuration
│   ├── geminiClient.ts    # Gemini AI integration
│   └── types.ts           # TypeScript definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 API Endpoints

### Internal API Routes

- `POST /api/quiz` - Generate quiz questions using Gemini AI
- `POST /api/auth` - Handle authentication operations

### External Integrations

- **Supabase**: User management, data storage
- **Google Gemini**: AI question generation

## 📊 Database Schema

### Users & Profiles
- Automatic profile creation on user signup
- Stores user preferences and settings

### Quizzes
- Complete quiz data with questions and answers
- Performance tracking and analytics
- User-specific quiz history

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Supabase Settings:**
   - Add your Vercel domain to Supabase Auth settings
   - Update redirect URLs for production

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL_NAME=gemini-1.5-pro
```

## 📈 Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting with Next.js
- **Caching**: Vercel edge caching for static assets
- **Database Indexing**: Optimized Supabase queries with proper indexes

## 🔒 Security Features

- **Row Level Security**: Supabase RLS policies protect user data
- **Authentication**: Secure JWT-based authentication
- **Environment Variables**: Sensitive keys stored securely
- **CORS Protection**: API routes protected against unauthorized access

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Quiz creation with different topics
- [ ] Quiz completion and scoring
- [ ] Profile page and history
- [ ] Responsive design on mobile
- [ ] Error handling and validation

### Running Tests Locally

```bash
# Build and test locally
npm run build
npm run start

# Lint code
npm run lint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain consistent code formatting
- Add proper error handling
- Test thoroughly before submitting

## 🐛 Troubleshooting

### Common Issues

**CSS not loading:**
- Ensure Tailwind CSS is properly configured
- Check `postcss.config.js` exists
- Restart development server

**Gemini API errors:**
- Verify API key is correct
- Check model name is valid
- Monitor API quotas and limits

**Authentication issues:**
- Confirm Supabase URLs are correct
- Check redirect URLs in Supabase settings
- Verify environment variables

**Database connection errors:**
- Validate Supabase credentials
- Check RLS policies
- Ensure tables exist

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase** - For the backend-as-a-service platform
- **Google** - For the Gemini AI API
- **Vercel** - For the deployment platform
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help:

- 📧 Email: your-lokeharshal2004@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Harshalloke/ai-quiz-master/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Harshalloke/ai-quiz-master/discussions)

## 🗺️ Roadmap

### Upcoming Features

- [ ] Dark mode theme toggle
- [ ] Quiz sharing functionality
- [ ] Leaderboards and competitions
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Offline quiz support
- [ ] Custom quiz templates
- [ ] Integration with learning platforms

**Made with ❤️ by Harshal Loke**

*Star ⭐ this repository if you find it helpful!*
