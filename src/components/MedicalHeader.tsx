import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Shield, User } from 'lucide-react';

export const MedicalHeader: React.FC = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">OralAI Diagnostics</h1>
              <p className="text-xs text-muted-foreground">Advanced Oral Disease Classification</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">HIPAA Compliant</span>
            </div>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};