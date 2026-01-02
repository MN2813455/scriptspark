
import React from 'react';
import { AppLanguage } from './types';

export const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Matthew', chapters: 28 },
  { name: 'John', chapters: 21 },
  { name: 'Romans', chapters: 16 }
];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

export const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    home: "Home", library: "Library", soul: "Soul", settings: "Settings", logout: "Log Out",
    getStarted: "Get Started", welcome: "Welcome Home", readyToFocus: "Ready to Focus?",
    startReading: "Start Reading", soulSanctuary: "Soul Sanctuary", searchPlaceholder: "Search topics...",
    wordOfDay: "Word of the Day", quickLibrary: "Quick Library", seeAll: "See All Books",
    search: "Search", language: "Language", fontSize: "Font Size", transStyle: "Translation Style",
    modern: "Modern", traditional: "Traditional", simplified: "Simplified",
    small: "Small", normal: "Normal", large: "Large"
  },
  es: {
    home: "Inicio", library: "Biblioteca", soul: "Alma", settings: "Ajustes", logout: "Cerrar Sesión",
    getStarted: "Empezar", welcome: "Bienvenido a Casa", readyToFocus: "¿Listo para Enfocarte?",
    startReading: "Empezar a Leer", soulSanctuary: "Santuario del Alma", searchPlaceholder: "Buscar temas...",
    wordOfDay: "Palabra del Día", quickLibrary: "Biblioteca Rápida", seeAll: "Ver Todos",
    search: "Buscar", language: "Idioma", fontSize: "Tamaño Letra", transStyle: "Estilo",
    modern: "Moderno", traditional: "Tradicional", simplified: "Simplificado",
    small: "Pequeño", normal: "Normal", large: "Grande"
  },
  fr: {
    home: "Accueil", library: "Bibliothèque", soul: "Âme", settings: "Paramètres", logout: "Déconnexion",
    getStarted: "Commencer", welcome: "Bienvenue chez vous", readyToFocus: "Prêt à vous concentrer ?",
    startReading: "Lire maintenant", soulSanctuary: "Sanctuaire de l'Âme", searchPlaceholder: "Rechercher...",
    wordOfDay: "Parole du Jour", quickLibrary: "Bibliothèque Rapide", seeAll: "Tout voir",
    search: "Recherche", language: "Langue", fontSize: "Taille", transStyle: "Traduction",
    modern: "Moderne", traditional: "Traditionnel", simplified: "Simplifiée",
    small: "Petit", normal: "Normal", large: "Grand"
  },
  de: {
    home: "Start", library: "Bibliothek", soul: "Seele", settings: "Einstellungen", logout: "Abmelden",
    getStarted: "Loslegen", welcome: "Willkommen Zuhause", readyToFocus: "Bereit?",
    startReading: "Lesen", soulSanctuary: "Seelen-Heiligtum", searchPlaceholder: "Suchen...",
    wordOfDay: "Wort des Tages", quickLibrary: "Kurz-Bibliothek", seeAll: "Alle Bücher",
    search: "Suche", language: "Sprache", fontSize: "Schriftgröße", transStyle: "Übersetzung",
    modern: "Modern", traditional: "Traditionell", simplified: "Vereinfacht",
    small: "Klein", normal: "Normal", large: "Groß"
  },
  pt: {
    home: "Início", library: "Biblioteca", soul: "Alma", settings: "Ajustes", logout: "Sair",
    getStarted: "Começar", welcome: "Bem-vindo", readyToFocus: "Pronto para Focar?",
    startReading: "Começar Leitura", soulSanctuary: "Santuário da Alma", searchPlaceholder: "Buscar temas...",
    wordOfDay: "Palavra do Dia", quickLibrary: "Biblioteca Rápida", seeAll: "Ver todos",
    search: "Buscar", language: "Idioma", fontSize: "Tamanho Fonte", transStyle: "Tradução",
    modern: "Moderno", traditional: "Tradicional", simplified: "Simplificado",
    small: "Pequeno", normal: "Normal", large: "Grande"
  },
  tl: {
    home: "Home", library: "Libro", soul: "Kaluluwa", settings: "Settings", logout: "Logout",
    getStarted: "Magsimula", welcome: "Maligayang Pagdating", readyToFocus: "Handa na ba?",
    startReading: "Magbasa na", soulSanctuary: "Santuaryo ng Kaluluwa", searchPlaceholder: "Maghanap...",
    wordOfDay: "Salita ng Diyos", quickLibrary: "Mabilisang Libro", seeAll: "Lahat ng Libro",
    search: "Maghanap", language: "Wika", fontSize: "Laki ng Letra", transStyle: "Pagsasalin",
    modern: "Moderno", traditional: "Tradisyonal", simplified: "Simple",
    small: "Maliit", normal: "Normal", large: "Malaki"
  },
  ko: {
    home: "홈", library: "라이브러리", soul: "영혼", settings: "설정", logout: "로그아웃",
    getStarted: "시작하기", welcome: "환영합니다", readyToFocus: "집중할 준비가 되셨나요?",
    startReading: "읽기 시작", soulSanctuary: "영혼의 안식처", searchPlaceholder: "주제 검색...",
    wordOfDay: "오늘의 말씀", quickLibrary: "빠른 라이브러리", seeAll: "모든 책 보기",
    search: "검색", language: "언어", fontSize: "글자 크기", transStyle: "번역 스타일",
    modern: "현대적", traditional: "전통적", simplified: "쉬운 성경",
    small: "작게", normal: "보통", large: "크게"
  }
};

export const APP_COLORS = {
  background: '#FDFCF8',
  text: '#0F172A',
  accent: '#7C2D12',
  primary: '#064E3B',
  secondary: '#B45309',
};

export const Icons = {
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Sparkle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
};
