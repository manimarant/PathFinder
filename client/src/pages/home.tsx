import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QuestionnaireStepper } from "@/components/questionnaire-stepper";
import { RecommendationResults } from "@/components/recommendation-results";
import { Lightbulb, BarChart3, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QuestionnaireFormData, Recommendation } from "@/types/questionnaire";

type ViewState = "intro" | "questionnaire" | "results";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("intro");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const { toast } = useToast();

  const assessmentMutation = useMutation({
    mutationFn: async (formData: QuestionnaireFormData) => {
      const response = await apiRequest("POST", "/api/assessment", {
        formData,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendation(data.recommendation);
      setViewState("results");
      toast({
        title: "Assessment Complete",
        description: "Your personalized recommendations are ready!",
      });
    },
    onError: (error) => {
      console.error("Assessment error:", error);
      toast({
        title: "Assessment Failed",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartAssessment = () => {
    setViewState("questionnaire");
  };

  const handleAssessmentComplete = (formData: QuestionnaireFormData) => {
    assessmentMutation.mutate(formData);
  };

  const handleStartOver = () => {
    setViewState("intro");
    setRecommendation(null);
  };

  const scrollToAssessment = () => {
    setViewState("questionnaire");
    // Small delay to ensure the element is rendered
    setTimeout(() => {
      const element = document.getElementById("questionnaire-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {viewState === "intro" && (
          <>
            {/* Intro Section */}
            <section className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" data-testid="main-title">
                Find Your Perfect Study Path
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Our AI-powered tool analyzes your background, preferences, and career goals to recommend 
                the educational programs that best align with your aspirations.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Smart Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalized questionnaire analyzes your unique profile
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Data-Driven Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Real program metrics and career outcomes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Quick Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant AI-powered program matching
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-muted/30 rounded-lg p-12">
              <h2 className="text-2xl font-semibold mb-4" data-testid="cta-title">
                Ready to Find Your Path?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Take our comprehensive assessment to discover the educational programs that align 
                with your career goals and learning preferences.
              </p>
              <Button
                size="lg"
                onClick={handleStartAssessment}
                className="px-8 py-3"
                data-testid="button-start-assessment"
              >
                Start Your Assessment
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Takes 5-7 minutes • Completely free • Instant results
              </p>
            </section>
          </>
        )}

        {viewState === "questionnaire" && (
          <section id="questionnaire-section">
            <QuestionnaireStepper
              onComplete={handleAssessmentComplete}
              isLoading={assessmentMutation.isPending}
            />
          </section>
        )}

        {viewState === "results" && recommendation && (
          <section id="results-section">
            <RecommendationResults
              recommendation={recommendation}
              onStartOver={handleStartOver}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
