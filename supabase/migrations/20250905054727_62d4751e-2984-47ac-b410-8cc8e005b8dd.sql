-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  career_aspirations TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create skills master table
CREATE TABLE public.skills_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job roles table
CREATE TABLE public.job_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  description TEXT,
  required_skills JSONB DEFAULT '[]',
  preferred_skills JSONB DEFAULT '[]',
  salary_range TEXT,
  location TEXT,
  experience_level TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill gap analysis table
CREATE TABLE public.skill_gap_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_job_role_id UUID REFERENCES public.job_roles(id),
  current_skills JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  skill_gaps JSONB DEFAULT '[]',
  match_percentage DECIMAL(5,2),
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress tracking table
CREATE TABLE public.progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  current_level INTEGER DEFAULT 0,
  target_level INTEGER DEFAULT 100,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  learning_resources JSONB DEFAULT '[]',
  completed_courses JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motivation tracking table
CREATE TABLE public.motivation_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  motivation_score INTEGER CHECK (motivation_score >= 0 AND motivation_score <= 100),
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  heart_rate INTEGER,
  spo2_level INTEGER,
  activity_level INTEGER,
  wearable_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job recommendations table
CREATE TABLE public.job_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_role_id UUID REFERENCES public.job_roles(id),
  match_percentage DECIMAL(5,2),
  matching_skills JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  recommendation_reason TEXT,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  is_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivation_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for skills_master (public read access)
CREATE POLICY "Skills master is viewable by everyone" ON public.skills_master
  FOR SELECT USING (true);

-- Create RLS policies for job_roles (public read, authenticated insert/update)
CREATE POLICY "Job roles are viewable by everyone" ON public.job_roles
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create job roles" ON public.job_roles
  FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update their own job postings" ON public.job_roles
  FOR UPDATE USING (auth.uid() = posted_by);

-- Create RLS policies for skill_gap_analysis
CREATE POLICY "Users can view their own skill gap analysis" ON public.skill_gap_analysis
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own skill gap analysis" ON public.skill_gap_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skill gap analysis" ON public.skill_gap_analysis
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for progress_tracking
CREATE POLICY "Users can view their own progress" ON public.progress_tracking
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress records" ON public.progress_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.progress_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for motivation_tracking
CREATE POLICY "Users can view their own motivation data" ON public.motivation_tracking
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own motivation records" ON public.motivation_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own motivation data" ON public.motivation_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for job_recommendations
CREATE POLICY "Users can view their own job recommendations" ON public.job_recommendations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own job recommendations" ON public.job_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job recommendations" ON public.job_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_roles_updated_at
  BEFORE UPDATE ON public.job_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_gap_analysis_updated_at
  BEFORE UPDATE ON public.skill_gap_analysis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample skills data
INSERT INTO public.skills_master (name, category, description) VALUES
('React', 'Frontend Development', 'JavaScript library for building user interfaces'),
('Node.js', 'Backend Development', 'JavaScript runtime for server-side development'),
('Python', 'Programming Languages', 'High-level programming language'),
('SQL', 'Database', 'Structured Query Language for database management'),
('AWS', 'Cloud Computing', 'Amazon Web Services cloud platform'),
('Docker', 'DevOps', 'Container platform for application deployment'),
('Project Management', 'Management', 'Planning and managing projects effectively'),
('Data Analysis', 'Analytics', 'Analyzing and interpreting data'),
('Machine Learning', 'AI/ML', 'Algorithms that learn from data'),
('UI/UX Design', 'Design', 'User interface and experience design');

-- Create storage bucket for resumes and profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('resumes', 'resumes', false),
  ('avatars', 'avatars', true);

-- Create storage policies for resumes
CREATE POLICY "Users can view their own resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resumes" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes" ON storage.objects
  FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);