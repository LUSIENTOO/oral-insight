import React, { useState, useEffect } from 'react';
import { MedicalHeader } from '@/components/MedicalHeader';
import { ImageUpload } from '@/components/ImageUpload';
import { DiagnosisResult, DiagnosisData } from '@/components/DiagnosisResult';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Zap, Shield, Users } from 'lucide-react';
import { classificationService } from '@/services/classificationService';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/medical-hero.jpg';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the AI model on component mount
    const initModel = async () => {
      try {
        await classificationService.initializeModel();
        setModelReady(true);
        toast({
          title: "AI Model Ready",
          description: "The oral disease classification model has been loaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Model Loading Failed",
          description: "Unable to initialize the AI model. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    initModel();
  }, [toast]);

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setDiagnosisResult(null); // Clear previous results
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !modelReady) return;

    setIsAnalyzing(true);
    setDiagnosisResult(null);

    try {
      const result = await classificationService.classifyImage(selectedImage);
      setDiagnosisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Diagnosis: ${result.disease} (${Math.round(result.confidence * 100)}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced neural networks trained on thousands of oral pathology cases"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get preliminary diagnosis within seconds of image upload"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Secure, encrypted processing that meets medical privacy standards"
    },
    {
      icon: Users,
      title: "Professional Grade",
      description: "Trusted by dental professionals worldwide for screening support"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MedicalHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AI-Powered Oral Disease Detection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced machine learning technology for rapid screening and classification 
              of oral pathologies. Supporting dental professionals with instant, accurate analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button variant="medical" size="lg">
                Start Analysis
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Upload & Analyze</h2>
              <p className="text-muted-foreground">
                Upload a clear image of the oral condition for AI-powered analysis
              </p>
              
              {!modelReady && (
                <div className="space-y-2">
                  <p className="text-sm text-primary">Loading AI model...</p>
                  <Progress value={undefined} className="w-64 mx-auto" />
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  isLoading={isAnalyzing}
                />
                
                {selectedImage && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={!modelReady || isAnalyzing || !selectedImage}
                    className="w-full"
                    variant="medical"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Image'
                    )}
                  </Button>
                )}
              </div>

              <div>
                {diagnosisResult ? (
                  <DiagnosisResult result={diagnosisResult} />
                ) : (
                  <Card className="p-8 text-center space-y-4 h-full flex flex-col justify-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">Ready for Analysis</h3>
                      <p className="text-muted-foreground">
                        Upload an image to receive AI-powered diagnosis and recommendations
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 OralAI Diagnostics. Medical AI technology for dental professionals. 
            Always consult qualified healthcare providers for diagnosis and treatment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;