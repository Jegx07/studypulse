import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  Award, 
  Target,
  BookOpen,
  Plus,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgressData {
  id: string;
  skill_name: string;
  current_level: number;
  target_level: number;
  progress_percentage: number;
  achievements: any;
  completed_courses: any;
  last_updated: string;
}

const ProgressPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState('');

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      const { data, error } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      if (data) setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkillProgress = async () => {
    if (!newSkill || !newLevel) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentLevel = parseInt(newLevel);
      const { error } = await supabase
        .from('progress_tracking')
        .insert({
          user_id: user?.id,
          skill_name: newSkill,
          current_level: currentLevel,
          target_level: 100,
          progress_percentage: currentLevel,
          achievements: [],
          completed_courses: [],
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Skill progress added!",
        description: `Started tracking ${newSkill}`
      });

      setNewSkill('');
      setNewLevel('');
      fetchProgressData();
    } catch (error: any) {
      toast({
        title: "Failed to add skill",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateProgress = async (id: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('progress_tracking')
        .update({
          current_level: newProgress,
          progress_percentage: newProgress,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Progress updated!",
        description: "Your skill progress has been saved"
      });

      fetchProgressData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const totalSkills = progressData.length;
  const averageProgress = totalSkills > 0 
    ? Math.round(progressData.reduce((acc, curr) => acc + curr.progress_percentage, 0) / totalSkills)
    : 0;
  const completedSkills = progressData.filter(skill => skill.progress_percentage >= 80).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
            <p className="text-muted-foreground">
              Monitor your learning journey and celebrate achievements
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Skills Tracked</p>
                    <p className="text-2xl font-bold">{totalSkills}</p>
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
                    <p className="text-2xl font-bold">{averageProgress}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Skills</p>
                    <p className="text-2xl font-bold">{completedSkills}</p>
                  </div>
                  <Award className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-2xl font-bold">
                      {progressData.reduce((acc, curr) => acc + (Array.isArray(curr.achievements) ? curr.achievements.length : 0), 0)}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Skill */}
          <Card className="mb-8 border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Track New Skill
              </CardTitle>
              <CardDescription>
                Add a new skill to track your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., React, Python, Project Management"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLevel">Current Level (0-100)</Label>
                  <Input
                    id="currentLevel"
                    type="number"
                    min="0"
                    max="100"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={addSkillProgress}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    Add Skill
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Progress List */}
          {progressData.length > 0 ? (
            <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Your Skills Progress
                </CardTitle>
                <CardDescription>
                  Track and update your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progressData.map((skill) => (
                    <div key={skill.id} className="space-y-3 p-4 rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{skill.skill_name}</h3>
                          {skill.progress_percentage >= 80 && (
                            <Badge className="bg-green-100 text-green-800">
                              <Trophy className="w-3 h-3 mr-1" />
                              Mastered
                            </Badge>
                          )}
                          {skill.progress_percentage >= 50 && skill.progress_percentage < 80 && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Progressing
                            </Badge>
                          )}
                          {skill.progress_percentage < 50 && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Target className="w-3 h-3 mr-1" />
                              Learning
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(skill.last_updated).toLocaleDateString()}
                          </span>
                          <span className="font-medium">{skill.progress_percentage}%</span>
                        </div>
                      </div>
                      
                      <Progress value={skill.progress_percentage} className="h-3" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Current: {skill.current_level}% / Target: {skill.target_level}%
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProgress(skill.id, Math.min(skill.current_level + 10, 100))}
                          >
                            +10%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProgress(skill.id, Math.min(skill.current_level + 25, 100))}
                          >
                            +25%
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Start Tracking Your Progress</h3>
                <p className="text-muted-foreground mb-6">
                  Add skills you're currently learning or want to improve to start tracking your progress
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>💡 Tip: Regular updates help you stay motivated and see your growth over time</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;