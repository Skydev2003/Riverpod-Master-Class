import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Lesson, LoadingState } from '../types';
import { askGeminiTutor } from '../services/geminiService';

interface GeminiTutorProps {
  currentLesson: Lesson;
}

const GeminiTutor: React.FC<GeminiTutorProps> = ({ currentLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'สวัสดีครับ สงสัยตรงไหนเกี่ยวกับบทเรียนนี้ ถามผมได้เลยครับ' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(LoadingState.IDLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading === LoadingState.LOADING) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(LoadingState.LOADING);

    const answer = await askGeminiTutor(userMessage.text, currentLesson.content, currentLesson.codeSnippet);

    const modelMessage: ChatMessage = { role: 'model', text: answer };
    setMessages(prev => [...prev, modelMessage]);
    setLoading(LoadingState.IDLE);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-accent hover:bg-brand-glow rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center z-50 transition-all transform hover:scale-105"
        aria-label="Ask AI Tutor"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-brand-accent/10 border-b border-slate-700 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
             </div>
             <div>
               <h3 className="font-semibold text-white">AI Tutor</h3>
               <p className="text-xs text-blue-300">ถามได้ทุกเรื่องเกี่ยวกับโค้ด</p>
             </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-accent text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading === LoadingState.LOADING && (
              <div className="flex justify-start">
                 <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="เช่น ref.watch ต่างกับ ref.read ยังไง?"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent placeholder-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={loading === LoadingState.LOADING || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-brand-accent text-white rounded-lg hover:bg-brand-glow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.89 28.89 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiTutor;