
import React, { useState, useEffect } from 'react';
import { ViewMode, ReadingHistory, BibleBook, StudyNote, AppLanguage, FontSize, TranslationStyle, UserProfile, UserSettings } from './types';
import { BIBLE_BOOKS, Icons, LANGUAGES, UI_TRANSLATIONS } from './constants';
import Reader from './components/Reader';
import SoulSanctuary from './components/SoulSanctuary';
import { getDailySpark, searchBible } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('spark_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const onboardingDone = localStorage.getItem('spark_onboarding_complete');
    const userSaved = localStorage.getItem('spark_user');
    if (onboardingDone && userSaved) return ViewMode.DASHBOARD;
    return ViewMode.LANDING;
  });

  // Local state for onboarding/settings before saving to user
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>('en');
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>('normal');
  const [selectedStyle, setSelectedStyle] = useState<TranslationStyle>('modern');

  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [dailySpark, setDailySpark] = useState<{ verse: string; reference: string; focusTip: string } | null>(null);
  const [loadingSpark, setLoadingSpark] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [browsingBook, setBrowsingBook] = useState<BibleBook | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

  // Sync state with existing user settings
  useEffect(() => {
    if (user) {
      setSelectedLanguage(user.settings.language);
      setSelectedFontSize(user.settings.fontSize);
      setSelectedStyle(user.settings.translationStyle);
    }
  }, [user]);

  const t = UI_TRANSLATIONS[selectedLanguage];

  useEffect(() => {
    const savedHistory = localStorage.getItem('spark_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedNotes = localStorage.getItem('spark_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes).reverse());

    if (viewMode === ViewMode.DASHBOARD) {
        fetchSpark();
    }
  }, [viewMode, selectedLanguage]);

  async function fetchSpark() {
    try {
      setLoadingSpark(true);
      const spark = await getDailySpark(selectedLanguage);
      setDailySpark(spark);
    } catch (err) {
      console.error("Daily Spark Error:", err);
    } finally {
      setLoadingSpark(false);
    }
  }

  const openReader = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setViewMode(ViewMode.READER);
    
    const newEntry = { book, chapter, timestamp: Date.now() };
    const updatedHistory = [newEntry, ...history.filter(h => h.book !== book)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('spark_history', JSON.stringify(updatedHistory));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setViewMode(ViewMode.SEARCH);
    try {
      const results = await searchBible(searchQuery, selectedLanguage);
      setSearchResults(results);
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsSettingsOpen(false);
    setViewMode(ViewMode.LANDING);
    setHistory([]);
    setNotes([]);
    setSelectedLanguage('en');
  };

  const handleGoogleSignIn = () => {
    if (!isPrivacyAccepted) return;
    const mockUser: UserProfile = { 
        name: "Faith Explorer", 
        email: "explorer@example.com",
        settings: {
            language: selectedLanguage,
            fontSize: selectedFontSize,
            translationStyle: selectedStyle
        }
    };
    setUser(mockUser);
    localStorage.setItem('spark_user', JSON.stringify(mockUser));
    setViewMode(ViewMode.ONBOARDING);
  };

  const updateUserSettings = (newSettings: UserSettings) => {
    if (!user) return;
    const updatedUser = { ...user, settings: newSettings };
    setUser(updatedUser);
    localStorage.setItem('spark_user', JSON.stringify(updatedUser));
  };

  const completeOnboarding = () => {
    updateUserSettings({
        language: selectedLanguage,
        fontSize: selectedFontSize,
        translationStyle: selectedStyle
    });
    localStorage.setItem('spark_onboarding_complete', 'true');
    setViewMode(ViewMode.DASHBOARD);
  };

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FDFCF8] text-center animate-in fade-in duration-1000">
      <div className="w-24 h-24 bg-amber-400 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
        <Icons.Sparkle />
      </div>
      <h1 className="text-5xl font-black text-stone-900 tracking-tighter mb-4 font-serif-bible">ScriptureSpark</h1>
      
      <div className="mb-8 w-full max-w-xs space-y-2 text-left">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">{t.language}</label>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
              <button 
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code as AppLanguage)}
                className={`py-3 px-4 rounded-2xl border-2 transition-all font-bold flex items-center gap-2 ${selectedLanguage === lang.code ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-100 bg-white text-stone-600'}`}
              >
                <span>{lang.flag}</span>
                <span className="text-xs">{lang.name}</span>
              </button>
            ))}
          </div>
      </div>

      <button onClick={() => setViewMode(ViewMode.AUTH)} className="w-full max-w-xs py-5 bg-stone-900 text-white rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all">{t.getStarted}</button>
    </div>
  );

  const renderAuth = () => (
    <div className="min-h-screen flex flex-col p-8 bg-[#FDFCF8] animate-in slide-in-from-right-10 duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12">
            <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-4 font-serif-bible">{t.welcome}</h2>
        </div>
        
        <div className="space-y-6">
          <button 
            disabled={!isPrivacyAccepted} 
            onClick={handleGoogleSignIn} 
            className={`w-full py-6 flex items-center justify-center gap-4 border-2 rounded-[2.5rem] font-black text-lg transition-all shadow-sm ${
                isPrivacyAccepted 
                    ? 'border-stone-900 bg-white text-stone-900 hover:bg-stone-50 active:scale-95 shadow-md' 
                    : 'opacity-30 border-stone-200 bg-stone-50 cursor-not-allowed'
            }`}
          >
            Continue with Google
          </button>
          
          <label className={`flex items-start gap-4 p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 ${isPrivacyAccepted ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-100'}`}>
            <input type="checkbox" checked={isPrivacyAccepted} onChange={(e) => setIsPrivacyAccepted(e.target.checked)} className="mt-1 w-6 h-6 rounded-lg border-2 border-stone-300 text-stone-900" />
            <span className="text-sm font-bold text-stone-700 leading-tight">Agree to Privacy Policy</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen flex flex-col p-8 bg-[#FDFCF8] animate-in zoom-in-95 duration-500 text-center justify-center space-y-12">
       <div>
          <h3 className="text-4xl font-black mb-4 font-serif-bible">{t.readyToFocus}</h3>
          <p className="text-stone-500 max-w-xs mx-auto text-lg font-medium">Fine-tune your reading experience.</p>
       </div>

       <div className="space-y-6 w-full max-w-xs mx-auto text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">{t.fontSize}</label>
            <div className="flex gap-2 bg-stone-100 p-2 rounded-[2rem]">
                {(['small', 'normal', 'large'] as FontSize[]).map(size => (
                    <button key={size} onClick={() => setSelectedFontSize(size)} className={`flex-1 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${selectedFontSize === size ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                        {t[size]}
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">{t.transStyle}</label>
            <div className="flex gap-2 bg-stone-100 p-2 rounded-[2rem]">
                {(['modern', 'traditional', 'simplified'] as TranslationStyle[]).map(style => (
                    <button key={style} onClick={() => setSelectedStyle(style)} className={`flex-1 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${selectedStyle === style ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                        {t[style]}
                    </button>
                ))}
            </div>
          </div>
       </div>

       <button onClick={completeOnboarding} className="w-full max-w-xs py-6 bg-stone-900 text-white rounded-[2.5rem] font-black text-lg mx-auto shadow-2xl active:scale-95 transition-all">{t.startReading}</button>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tighter">Hey, {user?.name.split(' ')[0]}</h1>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="w-14 h-14 flex items-center justify-center bg-white border-2 border-stone-200 rounded-full hover:border-amber-400 shadow-sm">
          <Icons.Settings />
        </button>
      </header>

      <section>
         <button onClick={() => setViewMode(ViewMode.SOUL_SANCTUARY)} className="w-full p-10 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-[3.5rem] text-left group relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-600/10 text-amber-700 rounded-xl"><Icons.Heart /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">{t.soulSanctuary}</span>
               </div>
               <h3 className="text-3xl font-black text-stone-900 tracking-tighter leading-tight mb-2">Feeling overwhelmed?</h3>
               <p className="text-stone-700 font-bold">Describe your burden.</p>
            </div>
         </button>
      </section>

      <section>
        <div className="relative p-10 bg-stone-900 rounded-[3.5rem] text-white shadow-2xl overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-400/20 rounded-xl text-amber-400"><Icons.Sparkle /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">{t.wordOfDay}</span>
            </div>
            {loadingSpark ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-white/10 rounded-full w-3/4"></div>
                    <div className="h-6 bg-white/10 rounded-full w-1/2"></div>
                </div>
            ) : dailySpark && (
              <>
                <blockquote className="text-3xl font-serif-bible italic mb-6 leading-snug text-stone-100">"{dailySpark.verse}"</blockquote>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">— {dailySpark.reference}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 px-2">
           <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Icons.BookOpen /> {t.quickLibrary}
           </h2>
           <button onClick={() => setViewMode(ViewMode.LIBRARY)} className="text-[10px] font-black uppercase text-stone-700 hover:text-amber-700 tracking-widest transition-colors underline decoration-2 underline-offset-4">
              {t.seeAll}
           </button>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {BIBLE_BOOKS.slice(0, 3).map(book => (
            <div key={book.name} className="p-8 bg-white border-2 border-stone-100 rounded-[3rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <h3 className="text-2xl font-black text-stone-900 tracking-tighter mb-4">{book.name}</h3>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map(ch => (
                  <button key={ch} onClick={() => openReader(book.name, ch)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-stone-50 border-2 border-stone-100 text-sm font-black text-stone-700 hover:bg-stone-900 hover:text-white transition-all">
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Fix: Implemented renderLibrary to allow users to browse and select any Bible book and chapter.
  const renderLibrary = () => (
    <div className="p-6 pb-32 space-y-10 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-4">
        <button onClick={() => setViewMode(ViewMode.DASHBOARD)} className="p-3 bg-stone-100 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h2 className="text-4xl font-black text-stone-900 tracking-tighter">{t.library}</h2>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {BIBLE_BOOKS.map(book => (
          <div key={book.name} className="p-8 bg-white border-2 border-stone-100 rounded-[3rem] shadow-sm">
            <h3 className="text-2xl font-black text-stone-900 tracking-tighter mb-6">{book.name}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(book.chapters, 10) }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => openReader(book.name, ch)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-stone-50 border-2 border-stone-100 text-sm font-black text-stone-700 hover:bg-stone-900 hover:text-white transition-all"
                >
                  {ch}
                </button>
              ))}
              {book.chapters > 10 && (
                <button
                  onClick={() => openReader(book.name, 1)}
                  className="px-4 h-12 flex items-center justify-center rounded-2xl bg-amber-50 border-2 border-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-700"
                >
                  +{book.chapters - 10} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Fix: Implemented renderSearch to provide a UI for interacting with search results.
  const renderSearch = () => (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => setViewMode(ViewMode.DASHBOARD)} className="p-3 bg-stone-100 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full p-4 pl-12 bg-white border-2 border-stone-100 rounded-2xl font-bold focus:border-amber-400 outline-none"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><Icons.Search /></div>
        </form>
      </header>

      {isSearching ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
           <p className="text-stone-400 font-bold animate-pulse">Searching the Word...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              onClick={() => openReader(result.book, result.chapter)}
              className="w-full p-8 bg-white border-2 border-stone-100 rounded-[3rem] text-left hover:border-amber-400 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{result.book} {result.chapter}:{result.verse}</span>
              </div>
              <p className="font-serif-bible text-xl text-stone-800 leading-relaxed italic">"{result.text}"</p>
            </button>
          ))}
          {searchResults.length === 0 && searchQuery && !isSearching && (
             <div className="py-20 text-center">
                <p className="text-stone-400 font-bold">No results found for "{searchQuery}"</p>
             </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-[#FDFCF8] flex flex-col font-sans">
      <main className="flex-1 relative">
        {viewMode === ViewMode.LANDING && renderLanding()}
        {viewMode === ViewMode.AUTH && renderAuth()}
        {viewMode === ViewMode.ONBOARDING && renderOnboarding()}
        {viewMode === ViewMode.DASHBOARD && renderDashboard()}
        {/* Fix: Replaced handleSearch() call with renderSearch() component call */}
        {viewMode === ViewMode.SEARCH && renderSearch()}
        {/* Fix: Added renderLibrary() call to display the Bible library view */}
        {viewMode === ViewMode.LIBRARY && renderLibrary()}
        {viewMode === ViewMode.READER && selectedBook && user && (
          <Reader book={selectedBook} chapter={selectedChapter} onClose={() => setViewMode(ViewMode.DASHBOARD)} settings={user.settings} />
        )}
        {viewMode === ViewMode.SOUL_SANCTUARY && (
          <SoulSanctuary onClose={() => setViewMode(ViewMode.DASHBOARD)} language={selectedLanguage} />
        )}
      </main>

      {user && viewMode !== ViewMode.READER && viewMode !== ViewMode.SOUL_SANCTUARY && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/95 backdrop-blur-3xl border-t border-stone-200 flex justify-center z-40">
            <div className="max-w-md w-full flex justify-around items-center px-6">
            <button onClick={() => setViewMode(ViewMode.DASHBOARD)} className={`flex flex-col items-center gap-1.5 transition-all px-8 py-3 rounded-[2rem] ${viewMode === ViewMode.DASHBOARD ? 'bg-stone-900 text-white' : 'text-stone-500'}`}>
                <Icons.Home /><span className="text-[9px] font-black uppercase tracking-widest">{t.home}</span>
            </button>
            <button onClick={() => setViewMode(ViewMode.SOUL_SANCTUARY)} className={`flex flex-col items-center gap-1.5 transition-all px-8 py-3 rounded-[2rem] ${viewMode === ViewMode.SOUL_SANCTUARY ? 'bg-stone-900 text-white' : 'text-stone-500'}`}>
                <Icons.Heart /><span className="text-[9px] font-black uppercase tracking-widest">{t.soul}</span>
            </button>
            <button onClick={() => { setBrowsingBook(null); setViewMode(ViewMode.LIBRARY); }} className={`flex flex-col items-center gap-1.5 transition-all px-8 py-3 rounded-[2rem] ${viewMode === ViewMode.LIBRARY ? 'bg-stone-900 text-white' : 'text-stone-500'}`}>
                <Icons.BookOpen /><span className="text-[9px] font-black uppercase tracking-widest">{t.library}</span>
            </button>
            </div>
        </nav>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100] flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFCF8] rounded-[3.5rem] p-10 shadow-2xl">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-stone-900 tracking-tighter">{t.settings}</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full">✕</button>
             </div>
             
             <div className="space-y-6 overflow-y-auto max-h-[60vh] pb-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.language}</label>
                    <select value={selectedLanguage} onChange={(e) => {
                        const lang = e.target.value as AppLanguage;
                        setSelectedLanguage(lang);
                        updateUserSettings({ ...user!.settings, language: lang });
                    }} className="w-full p-4 bg-white border-2 border-stone-100 rounded-2xl font-bold">
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.fontSize}</label>
                    <div className="flex gap-2 bg-stone-100 p-2 rounded-[2rem]">
                        {(['small', 'normal', 'large'] as FontSize[]).map(size => (
                            <button key={size} onClick={() => updateUserSettings({ ...user!.settings, fontSize: size })} className={`flex-1 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${user!.settings.fontSize === size ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                                {t[size]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.transStyle}</label>
                    <div className="flex gap-2 bg-stone-100 p-2 rounded-[2rem]">
                        {(['modern', 'traditional', 'simplified'] as TranslationStyle[]).map(style => (
                            <button key={style} onClick={() => updateUserSettings({ ...user!.settings, translationStyle: style })} className={`flex-1 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${user!.settings.translationStyle === style ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                                {t[style]}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleLogout} className="w-full py-6 bg-stone-100 text-stone-700 border-2 border-stone-200 rounded-[2.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                   <Icons.Logout /> {t.logout}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
