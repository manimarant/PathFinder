import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, TrendingUp, DollarSign, BookOpen, Phone, FileCheck, Users } from "lucide-react";
import type { Recommendation } from "@/types/questionnaire";

interface RecommendationResultsProps {
  recommendation: Recommendation;
  onStartOver?: () => void;
}

export function RecommendationResults({ recommendation, onStartOver }: RecommendationResultsProps) {
  const { 
    recommendedProgram, 
    programInsights, 
    careerProjections, 
    financialInfo, 
    alternativePathways 
  } = recommendation;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" data-testid="results-title">Your Personalized Recommendations</h2>
        <p className="text-muted-foreground">Based on your profile, here are the programs that best match your goals</p>
      </div>

      {/* Primary Recommendation */}
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Badge className="mb-3" data-testid="recommended-badge">
                🎓 Recommended Program
              </Badge>
              <h3 className="text-2xl font-bold mb-2" data-testid="program-title">
                {recommendedProgram.title}
              </h3>
              <p className="text-muted-foreground" data-testid="program-description">
                {recommendedProgram.description}
              </p>
            </div>
            <div className="text-right ml-6">
              <div className="text-2xl font-bold text-primary" data-testid="match-score">
                {recommendedProgram.matchScore}%
              </div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>
          </div>

          {/* Program Insights */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="insight-enrolled">
                {programInsights.enrolled.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Current Students</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="insight-graduated">
                {programInsights.graduated.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Graduates (5 years)</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="insight-completion-time">
                {programInsights.completionTime}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Completion</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="insight-success-rate">
                {programInsights.successRate}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Career Projections */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Career Opportunities
              </h4>
              <div className="space-y-3">
                {careerProjections.jobTitles.map((title, index) => (
                  <div key={index} className="text-sm" data-testid={`job-title-${index}`}>
                    <div className="font-medium">{title}</div>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground mt-2">
                  <strong>Salary Range:</strong> {careerProjections.salaryRange}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Market Outlook
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Industry Growth</span>
                  <span className="font-medium text-green-600" data-testid="industry-growth">
                    {careerProjections.industryGrowth}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground" data-testid="alumni-example">
                  <strong>Alumni Success:</strong> {careerProjections.alumniExample}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-t border-border pt-6 mb-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Tuition & Financial Aid
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-lg font-semibold" data-testid="estimated-cost">
                  {financialInfo.estimatedCost}
                </div>
                <div className="text-sm text-muted-foreground">Estimated Program Cost</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {financialInfo.scholarships.length > 0 ? "Available" : "None"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {financialInfo.scholarships.length > 0 
                    ? financialInfo.scholarships[0] 
                    : "No scholarships available"
                  }
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {financialInfo.corporateDiscounts ? "Available" : "Not Available"}
                </div>
                <div className="text-sm text-muted-foreground">Corporate Tuition Benefits</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h4 className="font-semibold mb-4">📌 Next Steps</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-3 h-auto text-left justify-start"
                data-testid="button-schedule-call"
              >
                <div>
                  <div className="font-medium text-sm">Schedule Consultation</div>
                  <div className="text-xs text-muted-foreground">Talk with enrollment counselor</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-3 h-auto text-left justify-start"
                data-testid="button-review-requirements"
              >
                <div>
                  <div className="font-medium text-sm">Review Requirements</div>
                  <div className="text-xs text-muted-foreground">Check admissions checklist</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-3 h-auto text-left justify-start"
                data-testid="button-career-services"
              >
                <div>
                  <div className="font-medium text-sm">Career Services</div>
                  <div className="text-xs text-muted-foreground">Explore support options</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Pathways */}
      {alternativePathways.length > 0 && (
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Alternative Pathways
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {alternativePathways.map((pathway, index) => (
                <div key={index} className="p-4 border border-border rounded-lg" data-testid={`alternative-${index}`}>
                  <h4 className="font-medium mb-2">{pathway.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{pathway.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Match Score:</span>
                    <span className="font-medium">{pathway.matchScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Over Button */}
      {onStartOver && (
        <div className="text-center">
          <Button variant="outline" onClick={onStartOver} data-testid="button-start-over">
            Take Assessment Again
          </Button>
        </div>
      )}
    </div>
  );
}
