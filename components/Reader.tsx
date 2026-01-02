
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BibleVerse, ChapterSummary, Highlight, StudyNote, UserSettings } from '../types';
import { fetchSimplifiedPassage, getChapterSummary } from '../services/geminiService';
import { Icons } from '../constants';

interface ReaderProps {
  book: string;
  chapter: number;
  onClose: () => void;
  settings: UserSettings;
}

const VERSES_PER_PAGE = 2;

const Reader: React.FC<ReaderProps> = ({ book, chapter, onClose, settings }) => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [summary, setSummary] = useState<ChapterSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [showVersePicker, setShowVersePicker] = useState(false);
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingVerse, setEditingVerse] = useState<BibleVerse | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError(null);
        const [versesData, summaryData] = await Promise.all([
          fetchSimplifiedPassage(book, chapter, settings.language, settings.translationStyle),
          getChapterSummary(book, chapter, settings.language)
        ]);
        if (!versesData || versesData.length === 0) throw new Error("No verses found.");
        setVerses(versesData);
        setSummary(summaryData);

        const storedH = localStorage.getItem('spark_highlights');
        if (storedH) {
          const parsed: Highlight[] = JSON.parse(storedH);
          const currentH: Record<string, boolean> = {};
          parsed.forEach(h => { if (h.book === book && h.chapter === chapter) currentH[h.verse] = true; });
          setHighlights(currentH);
        }

        const storedN = localStorage.getItem('spark_notes');
        if (storedN) {
          const parsed: StudyNote[] = JSON.parse(storedN);
          const currentN: Record<string, string> = {};
          parsed.forEach(n => { if (n.book === book && n.chapter === chapter) currentN[n.verse] = n.noteText; });
          setNotes(currentN);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load scripture.");
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [book, chapter, settings]);

  const totalPages = useMemo(() => Math.ceil(verses.length / VERSES_PER_PAGE), [verses]);
  
  const currentVerses = useMemo(() => {
    if (isContinuousMode) return verses;
    const start = currentPage * VERSES_PER_PAGE;
    return verses.slice(start, start + VERSES_PER_PAGE);
  }, [verses, currentPage, isContinuousMode]);

  const fontClasses = {
    small: 'text-xl md:text-2xl',
    normal: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  }[settings.fontSize];

  const jumpToVerse = (verseNumber: number) => {
    const element = verseRefs.current.get(verseNumber);
    if (isContinuousMode) {
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShowVersePicker(false);
      return;
    }
    const pageIndex = Math.floor((verseNumber - 1) / VERSES_PER_PAGE);
    setCurrentPage(pageIndex);
    setShowVersePicker(false);
    setShowSummary(false); 
    setTimeout(() => {
      const el = verseRefs.current.get(verseNumber);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const toggleHighlight = (verse: BibleVerse) => {
    const isHighlighted = highlights[verse.verse];
    const newH = { ...highlights };
    if (isHighlighted) delete newH[verse.verse];
    else newH[verse.verse] = true;
    setHighlights(newH);
    const stored = localStorage.getItem('spark_highlights');
    let allH: Highlight[] = stored ? JSON.parse(stored) : [];
    if (isHighlighted) {
      allH = allH.filter(h => !(h.book === book && h.chapter === chapter && h.verse === verse.verse));
    } else {
      allH.push({ book, chapter, verse: verse.verse, text: verse.text });
    }
    localStorage.setItem('spark_highlights', JSON.stringify(allH));
  };

  const handleSaveNote = () => {
    if (!editingVerse) return;
    const newNotes = { ...notes };
    if (tempNote.trim() === "") delete newNotes[editingVerse.verse];
    else newNotes[editingVerse.verse] = tempNote;
    setNotes(newNotes);
    const stored = localStorage.getItem('spark_notes');
    let allNotes: StudyNote[] = stored ? JSON.parse(stored) : [];
    allNotes = allNotes.filter(n => !(n.book === book && n.chapter === chapter && n.verse === editingVerse.verse));
    if (tempNote.trim() !== "") {
      allNotes.push({ book, chapter, verse: editingVerse.verse, noteText: tempNote, verseText: editingVerse.text, timestamp: Date.now() });
    }
    localStorage.setItem('spark_notes', JSON.stringify(allNotes));
    setEditingVerse(null);
    setTempNote("");
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#FDFCF8] z-[60] flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-bold text-stone-800 animate-pulse font-serif-bible">Preparing the Word...</h2>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#FDFCF8] z-50 flex flex-col overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onClose} className="p-3 hover:bg-stone-100 rounded-2xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button onClick={() => setShowVersePicker(true)} className="text-center group">
          <h1 className="font-black text-stone-900 tracking-tighter flex items-center gap-1">
            {book} {chapter} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-stone-300 group-hover:text-stone-900"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
          </h1>
          <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest block">Jump to verse</span>
        </button>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsContinuousMode(!isContinuousMode)} className={`p-3 rounded-2xl transition-all ${isContinuousMode ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:bg-stone-100'}`}>
              <Icons.BookOpen />
            </button>
            <button onClick={() => setShowSummary(!showSummary)} className={`p-3 rounded-2xl transition-all ${showSummary ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:bg-stone-100'}`}>
              <Icons.Sparkle />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-24 lg:px-64 flex flex-col items-center" ref={scrollRef}>
        {showSummary && summary && (
          <div className="w-full mb-10 p-8 bg-amber-50 rounded-[3rem] border-2 border-amber-100 shadow-sm relative animate-in fade-in zoom-in-95 duration-500">
             <h2 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Icons.Sparkle /> TL;DR</h2>
             <p className="text-2xl font-bold text-amber-950 mb-6 leading-tight">{summary.tlDr}</p>
             <button onClick={() => setShowSummary(false)} className="w-full py-4 bg-amber-900/5 text-amber-900 rounded-full font-black text-[10px] uppercase tracking-widest">Start Reading</button>
          </div>
        )}

        <div className={`w-full max-w-2xl ${isContinuousMode ? 'space-y-6 pb-64' : 'space-y-12 pb-48'}`}>
          {currentVerses.map((v) => {
            const isHighlighted = highlights[v.verse];
            const hasNote = notes[v.verse];
            return (
              <div 
                key={v.verse}
                ref={(el) => { if (el) verseRefs.current.set(v.verse, el); else verseRefs.current.delete(v.verse); }}
                className={`group relative transition-all duration-700 rounded-[2.5rem] ${isContinuousMode ? 'p-6' : 'p-8 shadow-sm'} ${isHighlighted ? 'bg-amber-100/40 border-2 border-amber-200' : 'bg-white border border-stone-100'}`}
              >
                <div className="flex gap-6 items-start">
                  <div onClick={() => jumpToVerse(v.verse)} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer ${isHighlighted ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-400 hover:bg-stone-900 hover:text-white'}`}>
                    {v.verse}
                  </div>
                  <div className="flex-1">
                    <p className={`font-serif-bible leading-[1.6] text-stone-900 font-medium tracking-tight ${fontClasses}`}>
                      {v.text}
                    </p>
                    {hasNote && (
                      <div className="mt-6 p-5 bg-stone-50 border-l-4 border-stone-300 rounded-2xl">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">My Note</span>
                        <p className="text-stone-700 font-bold leading-relaxed">{hasNote}</p>
                      </div>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                       <button onClick={() => toggleHighlight(v)} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isHighlighted ? 'bg-amber-500 text-white' : 'bg-stone-50 text-stone-400 hover:text-stone-900'}`}>
                          {isHighlighted ? 'Highlighted' : 'Highlight'}
                       </button>
                       <button onClick={() => { setEditingVerse(v); setTempNote(notes[v.verse] || ""); }} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${hasNote ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-400 hover:text-stone-900'}`}>
                          {hasNote ? 'Edit Note' : 'Add Note'}
                       </button>
                       {!isContinuousMode && (
                         <button onClick={() => setIsContinuousMode(true)} className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-stone-100 text-stone-400 hover:bg-stone-900 hover:text-white transition-all">Full Read</button>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isContinuousMode && (
            <div className="pt-20 pb-40 text-center">
              <button onClick={() => { setIsContinuousMode(false); scrollRef.current?.scrollTo(0, 0); }} className="px-10 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl">Focus Mode</button>
            </div>
          )}
        </div>
      </div>

      {!isContinuousMode && (
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent pt-24 z-10 pointer-events-none">
            <div className="max-w-md mx-auto flex flex-col gap-4 pointer-events-auto">
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-stone-900 h-full transition-all duration-500" style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}></div>
            </div>
            <div className="bg-stone-900 text-white rounded-[2.5rem] p-3 flex items-center justify-between shadow-2xl">
                <button disabled={currentPage === 0} onClick={() => { setCurrentPage(prev => Math.max(0, prev - 1)); scrollRef.current?.scrollTo(0, 0); }} className="p-5 disabled:opacity-20 hover:bg-white/10 rounded-[2rem]"><Icons.Home /></button>
                <div className="text-lg font-black tracking-tighter">{currentPage + 1} / {totalPages}</div>
                <button disabled={currentPage === totalPages - 1} onClick={() => { setCurrentPage(prev => Math.min(totalPages - 1, prev + 1)); scrollRef.current?.scrollTo(0, 0); }} className="p-5 disabled:opacity-20 hover:bg-white/10 rounded-[2rem]"><Icons.BookOpen /></button>
            </div>
            </div>
        </div>
      )}

      {showVersePicker && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xl z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFCF8] rounded-[3.5rem] p-10 shadow-2xl max-h-[80vh] flex flex-col">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-stone-900 tracking-tighter">Jump to Verse</h3>
                <button onClick={() => setShowVersePicker(false)} className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
             </div>
             <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-3 pb-6">
                {verses.map((v) => (
                  <button key={v.verse} onClick={() => jumpToVerse(v.verse)} className={`h-16 flex items-center justify-center rounded-3xl text-lg font-black border-2 ${(!isContinuousMode && currentPage * VERSES_PER_PAGE < v.verse && v.verse <= (currentPage + 1) * VERSES_PER_PAGE) ? 'bg-amber-400 border-amber-500 text-amber-950' : 'bg-stone-50 border-stone-100 text-stone-500'}`}>{v.verse}</button>
                ))}
             </div>
          </div>
        </div>
      )}

      {editingVerse && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[70] flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFCF8] rounded-[3rem] p-8 shadow-2xl">
             <h3 className="text-xl font-black text-stone-900 tracking-tight mb-4">Study Note</h3>
             <textarea value={tempNote} onChange={(e) => setTempNote(e.target.value)} placeholder="What does this verse mean to you?" className="w-full h-40 p-6 bg-stone-50 border-2 border-stone-100 rounded-[2rem] focus:border-amber-400 outline-none font-bold text-stone-800 mb-8 resize-none" />
             <div className="flex gap-4">
               <button onClick={handleSaveNote} className="flex-1 py-5 bg-stone-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest">Save Note</button>
               <button onClick={() => setEditingVerse(null)} className="flex-1 py-5 bg-stone-100 text-stone-500 rounded-[2rem] font-black text-sm uppercase tracking-widest">Cancel</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reader;
