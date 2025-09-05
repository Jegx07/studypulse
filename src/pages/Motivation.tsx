import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  TrendingUp,
  Calendar,
  Plus,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MotivationEntry {
  id: string;
  date: string;
  motivation_score: number;
  engagement_score: number;
  heart_rate?: number;
  spo2_level?: number;
  activity_level?: number;
  notes: string;
}

const Motivation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [motivationData, setMotivationData] = useState<MotivationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    motivation_score: '',
    engagement_score: '',
    heart_rate: '',
    spo2_level: '',
    activity_level: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchMotivationData();
    }
  }, [user]);

  const fetchMotivationData = async () => {
    try {
      const { data, error } = await supabase
        .from('motivation_tracking')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      if (data) setMotivationData(data);
    } catch (error) {
      console.error('Error fetching motivation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMotivationEntry = async () => {
    const { motivation_score, engagement_score } = newEntry;
    
    if (!motivation_score || !engagement_score) {
      toast({
        title: "Please fill in required fields",
        description: "Motivation and engagement scores are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('motivation_tracking')
        .insert({
          user_id: user?.id,
          date: new Date().toISOString().split('T')[0],
          motivation_score: parseInt(motivation_score),
          engagement_score: parseInt(engagement_score),
          heart_rate: newEntry.heart_rate ? parseInt(newEntry.heart_rate) : null,
          spo2_level: newEntry.spo2_level ? parseInt(newEntry.spo2_level) : null,
          activity_level: newEntry.activity_level ? parseInt(newEntry.activity_level) : null,
          notes: newEntry.notes || null
        });

      if (error) throw error;

      toast({
        title: "Motivation logged!",
        description: "Your daily motivation data has been saved"
      });

      setNewEntry({
        motivation_score: '',
        engagement_score: '',
        heart_rate: '',
        spo2_level: '',
        activity_level: '',
        notes: ''
      });

      fetchMotivationData();
    } catch (error: any) {
      toast({
        title: "Failed to log motivation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getMotivationLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading motivation data...</p>
        </div>
      </div>
    );
  }

  const chartData = motivationData.slice(0, 14).reverse().map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    motivation: item.motivation_score,
    engagement: item.engagement_score
  }));

  const averageMotivation = motivationData.length > 0 
    ? Math.round(motivationData.reduce((acc, curr) => acc + curr.motivation_score, 0) / motivationData.length)
    : 0;

  const averageEngagement = motivationData.length > 0 
    ? Math.round(motivationData.reduce((acc, curr) => acc + curr.engagement_score, 0) / motivationData.length)
    : 0;

  const todayEntry = motivationData.find(entry => 
    entry.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Motivation & Engagement Tracking</h1>
            <p className="text-muted-foreground">
              Track your daily motivation levels and integrate wearable data for better insights
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Motivation</p>
                    <p className="text-2xl font-bold">{averageMotivation}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Engagement</p>
                    <p className="text-2xl font-bold">{averageEngagement}%</p>
                  </div>
                  <Zap className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Days Tracked</p>
                    <p className="text-2xl font-bold">{motivationData.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card to-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Status</p>
                    <div className="flex items-center space-x-1">
                      {todayEntry ? (
                        <Badge className={getMotivationLevel(todayEntry.motivation_score).color}>
                          {getMotivationLevel(todayEntry.motivation_score).level}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not logged</span>
                      )}
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Add New Entry */}
            <Card className="border-0 bg-gradient-to-br from-card to-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Log Today's Motivation
                </CardTitle>
                <CardDescription>
                  Record your daily motivation and optional wearable data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivation Score *</Label>
                    <Input
                      id="motivation"
                      type="number"
                      min="0"
                      max="100"
                      value={newEntry.motivation_score}
                      onChange={(e) => setNewEntry({...newEntry, motivation_score: e.target.value})}
                      placeholder="0-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement Score *</Label>
                    <Input
                      id="engagement"
                      type="number"
                      min="0"
                      max="100"
                      value={newEntry.engagement_score}
                      onChange={(e) => setNewEntry({...newEntry, engagement_score: e.target.value})}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={newEntry.heart_rate}
                      onChange={(e) => setNewEntry({...newEntry, heart_rate: e.target.value})}
                      placeholder="BPM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spo2">SpO₂ Level</Label>
                    <Input
                      id="spo2"
                      type="number"
                      min="0"
                      max="100"
                      value={newEntry.spo2_level}
                      onChange={(e) => setNewEntry({...newEntry, spo2_level: e.target.value})}
                      placeholder="%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity">Activity Level</Label>
                    <Input
                      id="activity"
                      type="number"
                      min="0"
                      max="100"
                      value={newEntry.activity_level}
                      onChange={(e) => setNewEntry({...newEntry, activity_level: e.target.value})}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    placeholder="How are you feeling today? Any specific thoughts or observations..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={addMotivationEntry}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Log Entry
                </Button>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {motivationData.length > 0 ? (
                  <div className="space-y-4">
                    {motivationData.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="p-3 rounded-lg bg-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <Badge className={getMotivationLevel(entry.motivation_score).color}>
                            {getMotivationLevel(entry.motivation_score).level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Motivation: {entry.motivation_score}%</span>
                          <span>Engagement: {entry.engagement_score}%</span>
                          {entry.heart_rate && <span>♥ {entry.heart_rate} BPM</span>}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No entries yet. Start logging your daily motivation!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Motivation Chart */}
          {chartData.length > 0 && (
            <Card className="border-0 bg-gradient-to-br from-card to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Motivation & Engagement Trends (Last 14 Days)
                </CardTitle>
                <CardDescription>
                  Track your motivation and engagement levels over time
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Motivation;