export type SupportedLanguage = 'ar' | 'tr' | 'uk' | 'en';
export type GermanLevel = 'A1' | 'A2' | 'B1';

export interface User {
  id: string;
  email: string;
  displayName: string;
  uiLanguage: SupportedLanguage;
  currentLevel: GermanLevel;
  createdAt: string;
}

export interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export interface Level {
  id: GermanLevel;
  name: string;
  description: string;
  color: string;
  icon: string;
  totalLessons: number;
}

export interface Scenario {
  id: string;
  levelId: GermanLevel;
  icon: string;
  order: number;
  totalLessons: number;
}

export interface ScenarioTranslation {
  scenarioId: string;
  languageCode: SupportedLanguage;
  name: string;
  description: string;
}

export interface Lesson {
  id: string;
  scenarioId: string;
  order: number;
  totalItems: number;
}

export interface LessonTranslation {
  lessonId: string;
  languageCode: SupportedLanguage;
  title: string;
  description: string;
}

export interface LessonItem {
  id: string;
  lessonId: string;
  order: number;
  germanText: string;
  germanAudioUrl?: string;
  type: 'sentence' | 'vocabulary' | 'phrase' | 'dialog';
  speakerId?: string;
}

export interface LessonItemTranslation {
  itemId: string;
  languageCode: SupportedLanguage;
  translation: string;
  explanation?: string;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  itemsCompleted: number;
  totalItems: number;
  completedAt?: string;
  score?: number;
}

export interface AppState {
  currentUser: User | null;
  uiLanguage: SupportedLanguage;
  isAuthenticated: boolean;
}
