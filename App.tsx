import React, { useState } from 'react';
import { lessons } from './data/lessons';
import Sidebar from './components/Sidebar';
import CodeBlock from './components/CodeBlock';
import GeminiTutor from './components/GeminiTutor';

const App: React.FC = () => {
  const [currentLessonId, setCurrentLessonId] = useState(lessons[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];

  return (
    <div className="flex min-h-screen bg-brand-dark font-sans text-brand-text">
      <Sidebar
        lessons={lessons}
        currentLessonId={currentLessonId}
        onSelectLesson={setCurrentLessonId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 w-full md:w-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-brand-dark/90 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
          <span className="font-bold text-brand-accent">Riverpod Mastery</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
          <div className="mb-8">
            <span className="text-brand-accent font-mono text-sm tracking-wider uppercase">Lesson</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white leading-tight">
              {currentLesson.title}
            </h1>
            <p className="mt-4 text-lg text-brand-muted leading-relaxed">
              {currentLesson.shortDescription}
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
             {/* Render content manually to avoid markdown library complexity for this demo */}
             {currentLesson.content.split('\n').map((line, i) => {
               if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h2>
               if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-blue-200 mt-6 mb-3">{line.replace('### ', '')}</h3>
               if (line.startsWith('* ')) return <li key={i} className="ml-4 text-slate-300 list-disc">{line.replace('* ', '')}</li>
               if (line.trim() === '') return <div key={i} className="h-4"></div>
               return <p key={i} className="text-slate-300 leading-7">{line}</p>
             })}
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-2">
              Example Code
            </h3>
            <CodeBlock code={currentLesson.codeSnippet} />
          </div>
          
          <div className="mt-12 p-6 bg-slate-900/50 border border-brand-accent/20 rounded-xl">
             <h4 className="text-brand-accent font-semibold mb-2 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625v-8.196c0-.636-.088-1.246-.246-1.83m-2.25 10.026c-.366.195-.75.362-1.15.498m0-.498V17.25c0-.636.088-1.246.246-1.83m-3.75 4.656v-8.196c0-.636.088-1.246.246-1.83m2.25 10.026c.366.195.75.362 1.15.498m0-.498V17.25c0-.636-.088-1.246-.246-1.83" />
               </svg>
               Tip
             </h4>
             <p className="text-sm text-slate-400">
               อย่าลืมว่าใน Riverpod 2.0+ เรานิยมใช้ <code>ref.watch</code> ภายใน method <code>build</code> และใช้ <code>ref.read</code> หรือ <code>ref.read(provider.notifier)</code> ภายใน callback function เช่น <code>onPressed</code> เท่านั้น
             </p>
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <GeminiTutor currentLesson={currentLesson} />
    </div>
  );
};

export default App;