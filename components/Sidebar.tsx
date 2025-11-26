import React from 'react';
import { Lesson } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lessons, currentLessonId, onSelectLesson, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-brand-darker border-r border-slate-800 
          transform transition-transform duration-300 z-30 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-brand-accent tracking-tighter">
            Riverpod<span className="text-white">Mastery</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1">คู่มือฉบับจับมือทำ</p>
        </div>

        <nav className="p-4 space-y-2">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                onSelectLesson(lesson.id);
                onClose();
              }}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200 group
                ${currentLessonId === lesson.id 
                  ? 'bg-brand-accent/10 border border-brand-accent/50 text-brand-glow' 
                  : 'hover:bg-slate-800 text-brand-muted hover:text-white border border-transparent'}
              `}
            >
              <div className="text-sm font-semibold">{lesson.title}</div>
              <div className={`text-xs mt-1 truncate ${currentLessonId === lesson.id ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {lesson.shortDescription}
              </div>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-brand-darker">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xs">
               AI
             </div>
             <div>
               <p className="text-xs text-brand-muted">Powered by</p>
               <p className="text-sm font-bold text-white">Gemini 2.5</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;