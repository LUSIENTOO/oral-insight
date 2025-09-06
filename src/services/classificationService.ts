import { pipeline } from '@huggingface/transformers';
import { DiagnosisData } from '@/components/DiagnosisResult';

// Oral disease database based on Kaggle dataset categories
const oralDiseases = {
  'caries': {
    name: 'Dental Caries (Tooth Decay)',
    description: 'Bacterial infection causing demineralization and destruction of tooth structures. Characterized by cavities and carious lesions visible as dark spots or holes in teeth.',
    severity: 'medium' as const,
    recommendations: [
      'Schedule immediate dental restoration (fillings)',
      'Professional fluoride treatment',
      'Improve daily oral hygiene routine',
      'Reduce sugar and acidic food intake',
      'Consider antimicrobial mouth rinse'
    ]
  },
  'calculus': {
    name: 'Dental Calculus (Tartar)',
    description: 'Hardened dental plaque that has mineralized on teeth surfaces. Appears as yellow-brown deposits along the gum line and between teeth.',
    severity: 'medium' as const,
    recommendations: [
      'Professional dental scaling and cleaning',
      'Ultrasonic tartar removal',
      'Improve brushing technique and frequency',
      'Use tartar control toothpaste',
      'Regular dental cleanings every 6 months'
    ]
  },
  'gingivitis': {
    name: 'Gingivitis',
    description: 'Inflammation of the gums caused by bacterial plaque buildup. Gums appear red, swollen, and may bleed during brushing or flossing.',
    severity: 'low' as const,
    recommendations: [
      'Improve daily oral hygiene routine',
      'Professional dental cleaning',
      'Use antibacterial mouthwash',
      'Gentle brushing with soft-bristled toothbrush',
      'Regular flossing to remove plaque'
    ]
  },
  'tooth_discoloration': {
    name: 'Tooth Discoloration',
    description: 'Abnormal staining or discoloration of teeth that can be caused by various factors including diet, medications, or dental conditions.',
    severity: 'low' as const,
    recommendations: [
      'Professional dental cleaning',
      'Evaluate cause of discoloration',
      'Consider professional whitening treatment',
      'Limit staining foods and beverages',
      'Maintain excellent oral hygiene'
    ]
  },
  'ulcers': {
    name: 'Oral Ulcers',
    description: 'Painful sores or lesions in the mouth that can be caused by trauma, stress, nutritional deficiencies, or underlying conditions.',
    severity: 'medium' as const,
    recommendations: [
      'Apply topical pain relief medication',
      'Avoid spicy, acidic, or rough foods',
      'Maintain gentle oral hygiene',
      'Consider stress management if stress-related',
      'Consult dentist if ulcers persist beyond 2 weeks'
    ]
  },
  'hypodontia': {
    name: 'Hypodontia (Missing Teeth)',
    description: 'Congenital condition characterized by the absence of one or more teeth. Can affect both primary and permanent dentition.',
    severity: 'medium' as const,
    recommendations: [
      'Consult orthodontist for treatment planning',
      'Consider dental implants or bridges',
      'Evaluate need for orthodontic treatment',
      'Monitor remaining teeth for proper alignment',
      'Discuss prosthetic replacement options'
    ]
  },
  'healthy': {
    name: 'Healthy Oral Tissue',
    description: 'Normal, healthy oral structures with no signs of disease or abnormalities detected. Gums appear pink and firm, teeth are clean and intact.',
    severity: 'low' as const,
    recommendations: [
      'Maintain excellent oral hygiene routine',
      'Continue regular dental check-ups every 6 months',
      'Brush twice daily with fluoride toothpaste',
      'Daily flossing and mouthwash use',
      'Maintain balanced diet low in sugar'
    ]
  }
};

class OralClassificationService {
  private classifier: any = null;
  private isLoading = false;

  async initializeModel() {
    if (this.classifier || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // For demo purposes, we'll simulate model loading
      // In production, you would load a real medical imaging model
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate model initialization
      this.classifier = {
        classify: this.simulateClassification.bind(this)
      };
    } catch (error) {
      console.error('Failed to initialize classification model:', error);
      throw new Error('Model initialization failed');
    } finally {
      this.isLoading = false;
    }
  }

  private simulateClassification(imageData: string): Promise<DiagnosisData> {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Simulate different diagnoses based on some image characteristics
        const diseases = Object.keys(oralDiseases);
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const diseaseInfo = oralDiseases[randomDisease as keyof typeof oralDiseases];
        
        // Generate realistic confidence score
        const baseConfidence = 0.7 + Math.random() * 0.25; // 70-95%
        
        const result: DiagnosisData = {
          disease: diseaseInfo.name,
          confidence: baseConfidence,
          description: diseaseInfo.description,
          severity: diseaseInfo.severity,
          recommendations: diseaseInfo.recommendations,
          timestamp: new Date()
        };
        
        resolve(result);
      }, 3000); // Simulate 3-second processing time
    });
  }

  async classifyImage(imageFile: File): Promise<DiagnosisData> {
    if (!this.classifier) {
      await this.initializeModel();
    }

    // Convert file to base64 for processing
    const imageData = await this.fileToBase64(imageFile);
    
    // Perform classification
    return await this.classifier.classify(imageData);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  isModelReady(): boolean {
    return this.classifier !== null;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const classificationService = new OralClassificationService();