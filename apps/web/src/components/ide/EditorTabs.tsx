import React from 'react';
import { X, FileCode, FileJson, FileText } from 'lucide-react';

interface EditorTabsProps {
  openFiles: string[];
  activeFile: string;
  dirtyFiles?: Set<string>;
  onSelectTab: (filePath: string) => void;
  onCloseTab: (filePath: string) => void;
}

function getTabIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs':
      return <FileCode className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
    case 'ts':
    case 'tsx':
      return <FileCode className="h-3.5 w-3.5 text-sky-400 shrink-0" />;
    case 'py':
      return <FileCode className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
    case 'json':
      return <FileJson className="h-3.5 w-3.5 text-yellow-500 shrink-0" />;
    case 'css':
      return <FileCode className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
    case 'html':
      return <FileCode className="h-3.5 w-3.5 text-orange-400 shrink-0" />;
    case 'md':
      return <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />;
    default:
      return <FileCode className="h-3.5 w-3.5 text-secondary shrink-0" />;
  }
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  openFiles,
  activeFile,
  dirtyFiles = new Set(),
  onSelectTab,
  onCloseTab,
}) => {
  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center overflow-x-auto bg-surface border-b border-subtle no-scrollbar select-none h-9 shrink-0">
      {openFiles.map((filePath) => {
        const isActive = activeFile === filePath;
        const isDirty = dirtyFiles.has(filePath);
        const fileName = filePath.split('/').pop() || filePath;

        return (
          <div
            key={filePath}
            onClick={() => onSelectTab(filePath)}
            className={`group flex items-center gap-2 px-3 py-1.5 h-full text-xs font-mono border-r border-subtle transition cursor-pointer border-t-2 shrink-0 ${
              isActive
                ? 'bg-surface-elevated text-primary font-bold border-t-accent'
                : 'bg-surface text-secondary hover:text-primary hover:bg-surface-elevated/40 border-t-transparent'
            }`}
          >
            {getTabIcon(fileName)}
            <span className="truncate max-w-[140px]" title={filePath}>
              {fileName}
            </span>

            {isDirty && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0"
                title="Unsaved changes"
              />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(filePath);
              }}
              className="p-0.5 rounded text-muted hover:text-primary hover:bg-surface transition cursor-pointer opacity-70 group-hover:opacity-100"
              title="Close tab"
              aria-label={`Close ${fileName}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
