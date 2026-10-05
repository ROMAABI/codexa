import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  Square,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';

interface TerminalLine {
  type: 'stdin' | 'stdout' | 'stderr' | 'system';
  text: string;
  timestamp: string;
}

interface IntegratedTerminalProps {
  lines: TerminalLine[];
  isRunning?: boolean;
  onExecuteCommand: (command: string) => void;
  onClear: () => void;
  onStop?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const IntegratedTerminal: React.FC<IntegratedTerminalProps> = ({
  lines,
  isRunning = false,
  onExecuteCommand,
  onClear,
  onStop,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new output
  useEffect(() => {
    if (!isCollapsed && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, isCollapsed]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd || isRunning) return;

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');
    onExecuteCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || '');
      }
    }
  };

  const quickCommands = ['node server.js', 'npm test', 'npm run dev', 'ls -la'];

  return (
    <div className="flex flex-col bg-[#0d1117] text-slate-200 border-t border-subtle h-full select-text font-mono text-xs">
      {/* Terminal Toolbar */}
      <div className="h-8 px-3 bg-[#161b22] border-b border-subtle/60 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300 text-[11px] tracking-wide">
            TERMINAL
          </span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-sky-400 text-[11px] px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>Running...</span>
            </span>
          )}
        </div>

        {/* Quick Command Suggestions */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
          {quickCommands.map((qc) => (
            <button
              key={qc}
              disabled={isRunning}
              onClick={() => onExecuteCommand(qc)}
              className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] text-slate-400 hover:text-slate-100 hover:bg-[#30363d] transition disabled:opacity-40 cursor-pointer"
            >
              {qc}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {isRunning && onStop && (
            <button
              onClick={onStop}
              className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
              title="Stop Process"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          )}

          <button
            onClick={onClear}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-[#21262d] transition cursor-pointer"
            title="Clear Terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-[#21262d] transition cursor-pointer"
              title={isCollapsed ? 'Expand Terminal' : 'Collapse Terminal'}
            >
              {isCollapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      {!isCollapsed && (
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#0d1117] min-h-[120px] max-h-[260px]"
        >
          {lines.length === 0 ? (
            <div className="text-slate-500 italic">
              Codexa sandbox terminal ready. Type a command (e.g. node server.js, npm test) or click Run above.
            </div>
          ) : (
            lines.map((l, i) => (
              <div key={i} className="leading-relaxed break-all">
                {l.type === 'stdin' && (
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <span className="text-emerald-400 select-none">$</span>
                    <span>{l.text}</span>
                  </div>
                )}
                {l.type === 'stdout' && (
                  <pre className="whitespace-pre-wrap font-mono text-slate-300 text-[11.5px]">{l.text}</pre>
                )}
                {l.type === 'stderr' && (
                  <pre className="whitespace-pre-wrap font-mono text-rose-400 text-[11.5px]">{l.text}</pre>
                )}
                {l.type === 'system' && (
                  <div className="text-slate-500 text-[11px] italic">{l.text}</div>
                )}
              </div>
            ))
          )}

          {/* Interactive Prompt Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
            <span className="text-emerald-400 font-bold select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              disabled={isRunning}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRunning ? 'Command running in sandbox...' : 'Type command here...'}
              className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
            />
            {inputVal.trim() && !isRunning && (
              <button
                type="submit"
                className="p-1 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                title="Execute"
              >
                <CornerDownLeft className="h-3 w-3" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
