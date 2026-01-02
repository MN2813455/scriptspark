
export interface BibleVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface ChapterSummary {
  tlDr: string;
  keyTakeaway: string;
  modernAnalogy: string;
}

export interface ReadingHistory {
  book: string;
  chapter: number;
  timestamp: number;
}

export interface Highlight {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface StudyNote {
  book: string;
  chapter: number;
  verse: number;
  noteText: string;
  verseText: string;
  timestamp: number;
}

export interface BibleBook {
  name: string;
  chapters: number;
}

export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'tl' | 'ko';
export type FontSize = 'small' | 'normal' | 'large';
export type TranslationStyle = 'modern' | 'traditional' | 'simplified';

export interface UserSettings {
  language: AppLanguage;
  fontSize: FontSize;
  translationStyle: TranslationStyle;
}

export interface UserProfile {
  name: string;
  email: string;
  settings: UserSettings;
}

export enum ViewMode {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  READER = 'READER',
  SEARCH = 'SEARCH',
  LIBRARY = 'LIBRARY',
  PROGRESS = 'PROGRESS',
  SOUL_SANCTUARY = 'SOUL_SANCTUARY'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  verseReference?: string;
}
