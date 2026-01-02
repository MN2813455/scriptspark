
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AppLanguage } from '../types';
import { sendSoulMessage } from '../services/soulService';
import { Icons, UI_TRANSLATIONS } from '../constants';

const SoulSanctuary: React.FC<{ onClose: () => void, language: AppLanguage }> = ({ onClose, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendSoulMessage(messages, input, language);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error("Soul Chat Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "Error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FDFCF8] z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      <header className="p-6 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 hover:bg-stone-100 rounded-2xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tighter">{t.soulSanctuary}</h1>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Share your heart, find His peace</p>
          </div>
        </div>
        <div className="text-amber-500"><Icons.Heart /></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="py-20 text-center space-y-8 animate-in fade-in duration-1000">
             <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <Icons.Heart />
             </div>
             <div className="max-w-xs mx-auto">
                <h2 className="text-3xl font-black text-stone-900 tracking-tighter mb-4">{t.soulSanctuary}</h2>
                <p className="text-stone-500 font-medium leading-relaxed">Describe your pain, your sorrow, or what's heavy on your heart. We'll find a word from God for you.</p>
             </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[85%] p-7 rounded-[2.5rem] ${
              m.role === 'user' 
                ? 'bg-stone-900 text-white shadow-xl' 
                : 'bg-white border-2 border-stone-50 text-stone-900 shadow-sm'
            }`}>
              <p className={`font-serif-bible text-xl leading-relaxed ${m.role === 'model' ? 'font-medium' : 'font-normal'}`}>
                {m.text}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-stone-50 p-8 rounded-[2.5rem] border-2 border-stone-100 flex gap-2">
               <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-150"></div>
               <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-stone-100">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleSend();
               }
            }}
            placeholder="..."
            className="w-full p-6 pr-20 bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] focus:border-amber-400 focus:ring-0 outline-none font-bold text-stone-800 transition-all shadow-inner resize-none min-h-[80px]"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-4 bottom-4 w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SoulSanctuary;
