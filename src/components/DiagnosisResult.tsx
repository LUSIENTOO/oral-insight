import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DiagnosisData {
  disease: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: Date;
}

interface DiagnosisResultProps {
  result: DiagnosisData;
}

const severityConfig = {
  low: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success-muted',
    label: 'Low Risk',
    variant: 'default' as const
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning-muted',
    label: 'Medium Risk',
    variant: 'secondary' as const
  },
  high: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    label: 'High Risk',
    variant: 'destructive' as const
  }
};

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ result }) => {
  const severity = severityConfig[result.severity];
  const SeverityIcon = severity.icon;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">Diagnosis Result</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Analyzed on {result.timestamp.toLocaleDateString()}</span>
          </div>
        </div>
        <Badge variant={severity.variant} className="flex items-center space-x-1">
          <SeverityIcon className="h-3 w-3" />
          <span>{severity.label}</span>
        </Badge>
      </div>

      <div className="space-y-4">
        <div className={cn("p-4 rounded-lg", severity.bgColor)}>
          <div className="flex items-center space-x-3 mb-3">
            <SeverityIcon className={cn("h-5 w-5", severity.color)} />
            <h4 className="font-semibold text-lg">{result.disease}</h4>
          </div>
          <p className="text-sm text-foreground/80">{result.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Confidence Score</span>
            <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
          </div>
          <Progress value={result.confidence * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            AI model confidence in the diagnosis
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="font-semibold flex items-center space-x-2">
          <Info className="h-4 w-4 text-primary" />
          <span>Recommendations</span>
        </h5>
        <ul className="space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only. 
          Always consult with a qualified dental professional for proper diagnosis and treatment.
        </p>
      </div>
    </Card>
  );
};