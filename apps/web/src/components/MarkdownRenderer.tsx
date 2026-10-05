import React, { useState } from 'react';
import {
  Copy,
  Check,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  FileCode,
  ExternalLink,
  Play,
} from 'lucide-react';

interface MarkdownRendererProps {
  content?: string;
  className?: string;
  onTryIt?: (code: string, language: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content = '',
  className = '',
  onTryIt,
}) => {
  if (!content) return null;

  // Sanitize content against raw script tags and event handlers
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi, '');

  const lines = sanitized.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block (```lang)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace(/^```/, '') || 'javascript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const fullCode = codeLines.join('\n');
      elements.push(
        <CodeBlock
          key={`code-${i}`}
          code={fullCode}
          language={lang}
          onTryIt={onTryIt}
        />
      );
      continue;
    }

    // 2. Callout Blocks (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION] or > 💡 ... or > ⚠️ ...)
    if (line.trim().startsWith('>')) {
      let calloutType = 'NOTE';
      const trimmed = line.trim();
      const calloutTypeMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (calloutTypeMatch) {
        calloutType = calloutTypeMatch[1].toUpperCase();
      } else if (trimmed.includes('💡') || /tip/i.test(trimmed)) {
        calloutType = 'TIP';
      } else if (trimmed.includes('⚠️') || /warning|mistake|caution/i.test(trimmed)) {
        calloutType = 'WARNING';
      } else if (trimmed.includes('🔑') || /key takeaway|important/i.test(trimmed)) {
        calloutType = 'IMPORTANT';
      }

      const calloutLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        let clean = lines[i].trim().replace(/^>\s?/, '');
        clean = clean.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s?/i, '');
        if (clean.length > 0) {
          calloutLines.push(clean);
        }
        i++;
      }
      elements.push(
        <CalloutBlock
          key={`callout-${i}`}
          type={calloutType as any}
          content={calloutLines.join('\n')}
        />
      );
      continue;
    }

    // 3. Tables (| header | header |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<TableBlock key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // 4. Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-bold text-primary tracking-tight mt-6 mb-3 border-b border-subtle pb-2">
          {renderInlineFormatting(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold text-primary tracking-tight mt-6 mb-3">
          {renderInlineFormatting(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-semibold text-primary mt-5 mb-2">
          {renderInlineFormatting(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-semibold text-secondary mt-4 mb-2">
          {renderInlineFormatting(line.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    // 5. Unordered List Items (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-3 text-xs sm:text-sm text-secondary pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered List Items (1. )
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 my-3 text-xs sm:text-sm text-secondary pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Horizontal Rule (--- or ***)
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-subtle" />);
      i++;
      continue;
    }

    // 8. Standard Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-xs sm:text-sm text-secondary leading-relaxed my-2.5">
          {renderInlineFormatting(line)}
        </p>
      );
    }
    i++;
  }

  return <div className={`space-y-1 font-sans ${className}`}>{elements}</div>;
};

// Helper function to handle inline markdown (***bold-italic***, **bold**, *italic*, _italic_, `code`, [links](url))
function renderInlineFormatting(rawText: string): React.ReactNode[] {
  // Pre-normalize formatting quirks and stray symbols
  let text = rawText
    .replace(/_\*+(.*?)\*+_/g, '***$1***')
    .replace(/\*+_(.*?)_\*+/g, '***$1***')
    .replace(/__(.*?)__/g, '**$1**')
    .replace(/\b_([^_]+)_\b/g, '*$1*')
    .replace(/\b_\*/g, '')
    .replace(/\*_\b/g, '');

  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('***') && token.endsWith('***')) {
      parts.push(
        <strong key={match.index} className="font-bold italic text-primary">
          {token.slice(3, -3)}
        </strong>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-primary">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-secondary">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-elevated text-accent border border-subtle"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        let linkUrl = linkMatch[2];
        if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://') && !linkUrl.startsWith('#')) {
          linkUrl = `https://${linkUrl}`;
        }
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2 inline-flex items-center gap-0.5 font-medium"
          >
            <span>{linkText}</span>
            <ExternalLink className="h-3 w-3 inline opacity-70" />
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

// Code Block Component with Copy & Try It Button
const CodeBlock: React.FC<{
  code: string;
  language: string;
  onTryIt?: (code: string, language: string) => void;
}> = ({ code, language, onTryIt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRunnable =
    language.toLowerCase().includes('js') ||
    language.toLowerCase().includes('javascript') ||
    language.toLowerCase().includes('python') ||
    language.toLowerCase().includes('ts');

  return (
    <div className="rounded-xl border border-subtle bg-surface-elevated/40 overflow-hidden my-5 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-elevated/70 border-b border-subtle text-muted text-xs font-mono">
        <span className="flex items-center gap-1.5 text-primary font-bold">
          <FileCode className="h-3.5 w-3.5 text-accent" />
          {language}
        </span>
        <div className="flex items-center gap-2">
          {onTryIt && isRunnable && (
            <button
              onClick={() => onTryIt(code, language)}
              className="btn btn-secondary text-[11px] px-2.5 py-1 inline-flex items-center gap-1 cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run Snippet</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface hover:bg-surface-elevated text-secondary text-[11px] font-mono border border-subtle transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-primary leading-relaxed bg-surface">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Callout / Alert Block Component
const CalloutBlock: React.FC<{
  type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  content: string;
}> = ({ type, content }) => {
  const configs = {
    NOTE: {
      border: 'border-accent/30',
      bg: 'bg-accent/5',
      text: 'text-accent',
      title: 'NOTE',
      icon: Info,
      iconColor: 'text-accent',
    },
    TIP: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-400',
      title: 'PRO TIP',
      icon: Lightbulb,
      iconColor: 'text-emerald-400',
    },
    IMPORTANT: {
      border: 'border-accent/40',
      bg: 'bg-accent/5',
      text: 'text-accent',
      title: 'CRITICAL INVARIANT',
      icon: AlertOctagon,
      iconColor: 'text-accent',
    },
    WARNING: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-400',
      title: 'WARNING',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    CAUTION: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/5',
      text: 'text-rose-400',
      title: 'CAUTION',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
    },
  };

  const config = configs[type] || configs.NOTE;
  const IconComponent = config.icon;

  return (
    <div className={`p-4 rounded-xl border ${config.border} ${config.bg} my-4 space-y-2`}>
      <div className="flex items-center gap-2">
        <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
        <span className={`text-xs font-semibold ${config.text}`}>
          {config.title}
        </span>
      </div>
      <div className="text-xs text-secondary leading-relaxed pl-6 font-normal space-y-1">
        {content.split('\n').map((line, lIdx) => (
          <p key={lIdx}>{renderInlineFormatting(line)}</p>
        ))}
      </div>
    </div>
  );
};

// Table Component
const TableBlock: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const header = parseRow(lines[0]);
  const isSeparator = lines[1] && lines[1].includes('---');
  const bodyRows = lines.slice(isSeparator ? 2 : 1).map(parseRow);

  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-subtle bg-surface shadow-sm">
      <table className="w-full text-left text-xs text-secondary">
        <thead className="bg-surface-elevated/70 border-b border-subtle text-muted uppercase font-mono text-[10px]">
          <tr>
            {header.map((col, idx) => (
              <th key={idx} className="p-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-subtle">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-surface-elevated/40 transition">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 font-mono">
                  {renderInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
