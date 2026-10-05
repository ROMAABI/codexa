import React, { useState } from 'react';
import { AIMentorMode, AIMessageDTO, AIAskRequestContext } from '@codexa/shared';
import { apiFetch } from '../api/client';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sparkles, X, Send } from 'lucide-react';

interface AIMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext?: AIAskRequestContext;
}

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({
  isOpen,
  onClose,
  currentContext,
}) => {
  const [mode, setMode] = useState<AIMentorMode>('explain');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessageDTO[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hi! I am your Codexa AI Learning Mentor. I have full context of your active lesson, code editor, and tests.\n\nChoose a mode above (Explain, Hint, Debug, or Quiz Me) and ask me anything about the concept you are studying!',
      mode: 'explain',
      timestamp: new Date().toISOString(),
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: AIMessageDTO = {
      id: String(Date.now()),
      role: 'user',
      content: query.trim(),
      mode,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await apiFetch<any>('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({
          mode,
          query: userMessage.content,
          context: currentContext || {},
        }),
      });

      const assistantMessage: AIMessageDTO = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.message,
        mode: response.mode || mode,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: '⚠️ AI Mentor is temporarily unavailable. Please refer to the lesson notes or retry in a moment.',
          mode,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts: Record<string, string[]> = {
    explain: ['Explain this concept in simple terms', 'Why does this pattern matter in production?'],
    hint: ['Give me a hint for the next step', 'What invariant should I maintain here?'],
    debug: ['Why is my test failing?', 'Help me check for logic or syntax errors'],
    quiz_me: ['Ask me a question to test my understanding', 'What is a common edge case here?'],
    practice: ['Give me a small drill to reinforce this', 'What is an alternative approach?'],
    review: ['Review the architectural trade-offs of this approach', 'How does this scale?'],
    project_mentor: ['How should I structure the file hierarchy?', 'Guide me through this milestone'],
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-surface border-l border-subtle shadow-2xl flex flex-col backdrop-blur-3xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold text-primary">AI Mentor</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition cursor-pointer"
          aria-label="Close AI Mentor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Clean Mode Segmented Control */}
      <div className="px-4 py-2.5 border-b border-subtle bg-surface-elevated/20">
        <div className="grid grid-cols-4 p-1 rounded-xl bg-surface-elevated border border-subtle">
          {(['explain', 'hint', 'debug', 'quiz_me'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-center capitalize ${
                mode === m
                  ? 'bg-surface text-primary shadow-sm font-semibold'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {m === 'quiz_me' ? 'Quiz' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col text-xs ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-500 text-white font-medium rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] shadow-sm'
                  : 'bg-surface-elevated/70 border border-subtle text-primary rounded-2xl rounded-tl-xs px-4 py-3 max-w-[88%]'
              }`}
            >
              {m.role === 'user' ? (
                <div className="whitespace-pre-wrap">{m.content}</div>
              ) : (
                <div className="text-xs">
                  <MarkdownRenderer content={m.content} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted p-3 font-mono animate-pulse">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-accent" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts (Minimal Chips) */}
      {messages.length <= 2 && quickPrompts[mode] && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-subtle/50">
          {quickPrompts[mode].map((prompt, i) => (
            <button
              key={i}
              onClick={() => setQuery(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-elevated text-secondary hover:text-primary hover:border-accent border border-subtle transition text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-subtle bg-surface">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask in ${mode === 'quiz_me' ? 'quiz' : mode} mode...`}
            className="w-full bg-surface-elevated border border-subtle rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-accent font-sans"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-20 transition cursor-pointer flex items-center justify-center shadow-2xs"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
