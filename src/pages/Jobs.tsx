import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

const Jobs = () => {
  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$70,000 - $90,000",
      posted: "2 days ago",
      match: 85,
      skills: ["React", "TypeScript", "CSS"]
    },
    {
      id: 2,
      title: "Full Stack Engineer", 
      company: "StartupXYZ",
      location: "San Francisco, CA",
      salary: "$80,000 - $120,000",
      posted: "1 week ago", 
      match: 72,
      skills: ["Node.js", "React", "PostgreSQL"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Job Recommendations</h1>
            <p className="text-muted-foreground">Jobs matched to your skills and aspirations</p>
          </div>

          <div className="space-y-6">
            {mockJobs.map((job) => (
              <Card key={job.id} className="border-0 bg-gradient-to-br from-card to-secondary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-lg">{job.company}</CardDescription>
                    </div>
                    <Badge className={job.match >= 80 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {job.match}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span>
                    <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />{job.salary}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{job.posted}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button>Apply Now</Button>
                    <Button variant="outline">Save Job</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;