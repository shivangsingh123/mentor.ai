export interface MentorAnalysis {
  qualityScore: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  interviewScore: number;
  bugs: string[];
  security: string[];
  performance: string;
  optimizations: string[];
  bestPractices: string[];
  learningResources: { title: string; url: string; description: string }[];
  refactoredCode?: string;
  explanation?: string;
}

export interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  description: string;
  code: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  customApiKey?: string;
}
