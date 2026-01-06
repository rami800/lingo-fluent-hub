-- Create enum for German levels
CREATE TYPE public.german_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- Create enum for supported UI languages
CREATE TYPE public.ui_language AS ENUM ('en', 'ar', 'tr', 'uk');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'premium');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_language ui_language DEFAULT 'en',
  current_level german_level DEFAULT 'A1',
  streak_days INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create scenarios table (learning scenarios like "at the bakery")
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level german_level NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create scenario translations
CREATE TABLE public.scenario_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE NOT NULL,
  language ui_language NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE (scenario_id, language)
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lesson translations
CREATE TABLE public.lesson_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  language ui_language NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  UNIQUE (lesson_id, language)
);

-- Create vocabulary table
CREATE TABLE public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  german_word TEXT NOT NULL,
  article TEXT,
  plural TEXT,
  pronunciation_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- Create vocabulary translations
CREATE TABLE public.vocabulary_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE NOT NULL,
  language ui_language NOT NULL,
  translation TEXT NOT NULL,
  example_sentence TEXT,
  UNIQUE (vocabulary_id, language)
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, lesson_id)
);

-- Create AI corrections history table
CREATE TABLE public.ai_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('pronunciation', 'writing')),
  user_input TEXT NOT NULL,
  expected_text TEXT,
  ai_feedback TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_corrections ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Public content policies (scenarios, lessons, vocabulary are readable by all authenticated users)
CREATE POLICY "Authenticated users can view scenarios" ON public.scenarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view scenario translations" ON public.scenario_translations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view lessons" ON public.lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view lesson translations" ON public.lesson_translations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view vocabulary" ON public.vocabulary
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view vocabulary translations" ON public.vocabulary_translations
  FOR SELECT TO authenticated USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- AI corrections policies
CREATE POLICY "Users can view their own corrections" ON public.ai_corrections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own corrections" ON public.ai_corrections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();