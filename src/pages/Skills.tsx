import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  BarChart3
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

interface JobRole {
  id: string;
  title: string;
  company: string;
  required_skills: any;
  preferred_skills: any;
}

interface SkillGap {
  skill: string;
  current_level: number;
  required_level: number;
  gap: number;
}

const Skills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [matchPercentage, setMatchPercentage] = useState<number>(0);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobRoles();
    fetchUserSkills();
  }, [user]);

  const fetchJobRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('job_roles')
        .select('*')
        .eq('is_active', true)
        .limit(20);

      if (error) throw error;
      if (data) setJobRoles(data);
    } catch (error) {
      console.error('Error fetching job roles:', error);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('skills')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data && Array.isArray(data.skills)) {
        setUserSkills(data.skills);
      } else if (data && data.skills) {
        setUserSkills([]);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const analyzeSkillGap = async () => {
    if (!selectedJob) {
      toast({
        title: "Please select a job role",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const selectedJobRole = jobRoles.find(job => job.id === selectedJob);
      if (!selectedJobRole) return;

      const requiredSkills = Array.isArray(selectedJobRole.required_skills) 
        ? selectedJobRole.required_skills 
        : [];
      
      const gaps: SkillGap[] = [];
      let totalMatched = 0;

      requiredSkills.forEach(skill => {
        const hasSkill = userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        );
        
        if (hasSkill) {
          totalMatched++;
          gaps.push({
            skill,
            current_level: 80,
            required_level: 80,
            gap: 0
          });
        } else {
          gaps.push({
            skill,
            current_level: 0,
            required_level: 80,
            gap: 80
          });
        }
      });

      const matchPercent = requiredSkills.length > 0 
        ? Math.round((totalMatched / requiredSkills.length) * 100)
        : 0;

      setSkillGaps(gaps);
      setMatchPercentage(matchPercent);

        await supabase
        .from('skill_gap_analysis')
        .upsert({
          user_id: user?.id,
          target_job_role_id: selectedJob,
          current_skills: userSkills as any,
          missing_skills: gaps.filter(g => g.gap > 0).map(g => g.skill) as any,
          skill_gaps: gaps as any,
          match_percentage: matchPercent,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Analysis complete!",
        description: `You match ${matchPercent}% of required skills`
      });
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your skills against target job roles and discover learning opportunities
            </p>
          </div>

          {/* Job Selection */}
          <Card className="mb-8 border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Select Target Job Role
              </CardTitle>
              <CardDescription>
                Choose a job role to analyze your skill match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a job role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={analyzeSkillGap} 
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {loading ? 'Analyzing...' : 'Analyze Skills'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {skillGaps.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Match Overview */}
              <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Match Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {matchPercentage}%
                    </div>
                    <Progress value={matchPercentage} className="mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Skills match for selected role
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Summary */}
              <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
                <CardHeader>
                  <CardTitle>Skills Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Matched Skills
                      </span>
                      <span className="font-semibold">
                        {skillGaps.filter(gap => gap.gap === 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                        Missing Skills
                      </span>
                      <span className="font-semibold">
                        {skillGaps.filter(gap => gap.gap > 0).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card className="border-0 bg-gradient-to-br from-card to-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learning Path
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {skillGaps.filter(gap => gap.gap > 0).length}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Skills to develop
                    </p>
                    <Button variant="outline" size="sm">
                      Create Learning Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Skills Breakdown */}
          {skillGaps.length > 0 && (
            <Card className="border-0 bg-gradient-to-br from-card to-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Detailed Skills Analysis
                </CardTitle>
                <CardDescription>
                  Your current skill levels vs requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillGaps.map((gap, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{gap.skill}</span>
                          {gap.gap === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Matched
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Needs Development
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {gap.current_level}% / {gap.required_level}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={gap.current_level} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current Level</span>
                          <span>Required: {gap.required_level}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {skillGaps.length === 0 && (
            <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze Your Skills?</h3>
                <p className="text-muted-foreground mb-6">
                  Select a target job role above to see how your skills match up and discover areas for improvement
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>💡 Tip: Complete your profile with your current skills for more accurate analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;