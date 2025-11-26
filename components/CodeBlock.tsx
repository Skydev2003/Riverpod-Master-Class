import React from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  // Simple syntax highlighting via regex splitting for demo purposes
  // In a real production app, use 'react-syntax-highlighter' or 'prismjs'
  
  const processCode = (source: string) => {
    return source.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell select-none text-right pr-4 text-brand-muted w-8 text-xs opacity-50">
          {i + 1}
        </span>
        <span className="table-cell whitespace-pre-wrap">
          {highlightLine(line)}
        </span>
      </div>
    ));
  };

  const highlightLine = (line: string) => {
    // Very basic highlighting logic for Dart/Flutter keywords
    const keywords = ['class', 'final', 'const', 'return', 'void', 'async', 'await', 'extends', 'implements', 'import', 'package', 'override', 'super', 'if', 'else', 'for', 'while'];
    const types = ['String', 'int', 'bool', 'List', 'Map', 'Widget', 'BuildContext', 'WidgetRef', 'Provider', 'Notifier', 'NotifierProvider', 'AsyncNotifier', 'Future', 'ConsumerWidget', 'StatefulWidget', 'StatelessWidget'];
    
    const words = line.split(' ');
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9_]/g, '');
      let colorClass = 'text-brand-text';

      if (keywords.includes(cleanWord)) colorClass = 'text-purple-400';
      else if (types.includes(cleanWord)) colorClass = 'text-yellow-300';
      else if (word.startsWith('//')) return <span key={idx} className="text-gray-500 italic">{word} </span>;
      else if (word.includes("'")) colorClass = 'text-green-400';
      
      return <span key={idx} className={`${colorClass}`}>{word} </span>;
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117] shadow-xl my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-brand-muted font-mono">main.dart</span>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-sm leading-6">
        <div className="table w-full border-collapse">
          {processCode(code)}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;