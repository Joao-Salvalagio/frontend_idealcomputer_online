import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RecommendationResponse } from '../services/recommendationService';

interface RecommendationContextType {
  recommendation: RecommendationResponse | null;
  setRecommendation: (data: RecommendationResponse | null) => void;
  questionnaireData: {
    usage: string;
    budget: string;
    detail: string;  // ✅ ADICIONAR ESTA LINHA
  } | null;
  setQuestionnaireData: (data: { usage: string; budget: string; detail: string } | null) => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<{ 
    usage: string; 
    budget: string;
    detail: string;  // ✅ ADICIONAR ESTA LINHA
  } | null>(null);

  return (
    <RecommendationContext.Provider 
      value={{ 
        recommendation, 
        setRecommendation,
        questionnaireData,
        setQuestionnaireData
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendation must be used within RecommendationProvider');
  }
  return context;
};