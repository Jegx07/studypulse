import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Brain,
  User,
  FileText,
  Briefcase,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Profile {
  full_name: string;
  skills: any;
  career_aspirations: string;
}

interface ProgressData {
  skill_name: string;
  progress_percentage: number;
}

interface MotivationData {
  date: string;
  motivation_score: number;
  engagement_score: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [motivationData, setMotivationData] = useState<MotivationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch progress data
      const { data: progressData } = await supabase
        .from('progress_tracking')
        .select('skill_name, progress_percentage')
        .eq('user_id', user?.id)
        .limit(5);

      if (progressData) {
        setProgressData(progressData);
      }

      // Fetch recent motivation data
      const { data: motivationData } = await supabase
        .from('motivation_tracking')
        .select('date, motivation_score, engagement_score')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(7);

      if (motivationData) {
        setMotivationData(motivationData.reverse());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = motivationData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    motivation: item.motivation_score,
    engagement: item.engagement_score
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile?.full_name || user?.email}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your career development progress
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Target className="w-3 h-3 mr-1" />
                Active Learner
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills Tracked</p>
                  <p className="text-2xl font-bold">{progressData.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {progressData.length > 0 
                      ? Math.round(progressData.reduce((acc, curr) => acc + curr.progress_percentage, 0) / progressData.length)
                      : 0
                    }%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Skills</p>
                  <p className="text-2xl font-bold">{Array.isArray(profile?.skills) ? profile.skills.length : 0}</p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-card to-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Motivation</p>
                  <p className="text-2xl font-bold">
                    {motivationData.length > 0 
                      ? motivationData[motivationData.length - 1]?.motivation_score || 0
                      : 0
                    }%
                  </p>
                </div>
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Overview */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Skill Progress Overview
              </CardTitle>
              <CardDescription>
                Track your learning progress across different skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.length > 0 ? (
                  progressData.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.skill_name}</span>
                        <span className="text-muted-foreground">{skill.progress_percentage}%</span>
                      </div>
                      <Progress value={skill.progress_percentage} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No skills being tracked yet</p>
                    <p className="text-sm">Complete your profile to start tracking</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="ghost">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Skills
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Heart className="w-4 h-4 mr-2" />
                  Log Motivation
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
              <CardHeader>
                <CardTitle className="text-lg">Career Goal</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.career_aspirations ? (
                  <p className="text-sm text-muted-foreground">
                    {profile.career_aspirations}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Set your career aspirations in your profile
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Motivation Chart */}
        <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Motivation & Engagement Trends
            </CardTitle>
            <CardDescription>
              Your motivation and engagement levels over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="motivation" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Motivation"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Engagement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No motivation data yet</p>
                <p className="text-sm">Start tracking your daily motivation levels</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;