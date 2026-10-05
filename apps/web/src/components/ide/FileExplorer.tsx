import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  FilePlus,
  FolderPlus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface FileExplorerProps {
  files: Record<string, string>;
  selectedFile: string;
  dirtyFiles?: Set<string>;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onCreateFolder?: (folderPath: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  readOnly?: boolean;
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: Record<string, TreeNode>;
}

function buildFileTree(filePaths: string[]): TreeNode {
  const root: TreeNode = { name: '', path: '', isFolder: true, children: {} };

  filePaths.forEach((filePath) => {
    const parts = filePath.split('/').filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          children: {},
        };
      } else if (!isLast) {
        current.children[part].isFolder = true;
      }
      current = current.children[part];
    });
  });

  return root;
}

function getFileIcon(fileName: string) {
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
    case 'scss':
      return <FileCode className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
    case 'html':
      return <FileCode className="h-3.5 w-3.5 text-orange-400 shrink-0" />;
    case 'md':
      return <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />;
    default:
      return <FileCode className="h-3.5 w-3.5 text-secondary shrink-0" />;
  }
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  dirtyFiles = new Set(),
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
  readOnly = false,
}) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filePaths = Object.keys(files).sort();
  const rootTree = buildFileTree(filePaths);

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const handleStartCreateFile = () => {
    setIsCreatingFile(true);
    setIsCreatingFolder(false);
    setNewItemName('');
  };

  const handleStartCreateFolder = () => {
    setIsCreatingFolder(true);
    setIsCreatingFile(false);
    setNewItemName('');
  };

  const handleConfirmCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newItemName.trim();
    if (!cleanName) {
      setIsCreatingFile(false);
      setIsCreatingFolder(false);
      return;
    }

    if (isCreatingFile) {
      onCreateFile(cleanName);
    } else if (isCreatingFolder && onCreateFolder) {
      onCreateFolder(cleanName);
    }

    setIsCreatingFile(false);
    setIsCreatingFolder(false);
    setNewItemName('');
  };

  const handleStartRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingPath(path);
    setRenameValue(path);
  };

  const handleConfirmRename = (oldPath: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = renameValue.trim();
    if (clean && clean !== oldPath) {
      onRenameFile(oldPath, clean);
    }
    setRenamingPath(null);
  };

  const handleDelete = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete '${path}'?`)) {
      onDeleteFile(path);
    }
  };

  const renderTree = (node: TreeNode, level = 0) => {
    const entries = Object.values(node.children).sort((a, b) => {
      if (a.isFolder === b.isFolder) {
        return a.name.localeCompare(b.name);
      }
      return a.isFolder ? -1 : 1;
    });

    return entries.map((child) => {
      const isCollapsed = collapsedFolders.has(child.path);
      const isSelected = selectedFile === child.path;
      const isDirty = dirtyFiles.has(child.path);
      const isRenaming = renamingPath === child.path;

      if (child.isFolder) {
        return (
          <div key={child.path} className="select-none">
            <div
              onClick={() => toggleFolder(child.path)}
              style={{ paddingLeft: `${Math.max(8, level * 14)}px` }}
              className="group flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs font-mono text-secondary hover:text-primary hover:bg-surface-elevated/70 cursor-pointer transition"
            >
              <div className="flex items-center gap-1.5 truncate">
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted shrink-0" />
                )}
                {isCollapsed ? (
                  <Folder className="h-3.5 w-3.5 text-amber-400/80 shrink-0" />
                ) : (
                  <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                )}
                <span className="truncate font-semibold">{child.name}</span>
              </div>
            </div>

            {!isCollapsed && <div>{renderTree(child, level + 1)}</div>}
          </div>
        );
      }

      // File Node
      return (
        <div
          key={child.path}
          style={{ paddingLeft: `${Math.max(12, level * 14)}px` }}
          onClick={() => !isRenaming && onSelectFile(child.path)}
          className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs font-mono transition cursor-pointer border ${
            isSelected
              ? 'bg-surface-elevated text-primary font-bold border-highlight'
              : 'text-secondary hover:text-primary hover:bg-surface-elevated/60 border-transparent'
          }`}
        >
          {isRenaming ? (
            <form
              onSubmit={(e) => handleConfirmRename(child.path, e)}
              className="flex items-center gap-1 flex-1 mr-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full bg-main border border-accent rounded px-1.5 py-0.5 text-xs text-primary font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                title="Save"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setRenamingPath(null)}
                className="p-1 text-muted hover:text-primary cursor-pointer"
                title="Cancel"
              >
                <X className="h-3 w-3" />
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(child.name)}
                <span className="truncate">{child.name}</span>
                {isDirty && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
                )}
              </div>

              {!readOnly && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleStartRename(child.path, e)}
                    className="p-0.5 rounded text-muted hover:text-primary hover:bg-surface transition cursor-pointer"
                    title="Rename file"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(child.path, e)}
                    className="p-0.5 rounded text-muted hover:text-rose-400 hover:bg-surface transition cursor-pointer"
                    title="Delete file"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* File Explorer Header Toolbar */}
      <div className="px-3 py-2 border-b border-subtle flex items-center justify-between bg-surface shrink-0">
        <span className="text-[11px] font-semibold text-muted tracking-wider uppercase">
          Explorer
        </span>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleStartCreateFile}
              className="p-1 rounded text-secondary hover:text-primary hover:bg-surface-elevated transition cursor-pointer"
              title="New File"
              aria-label="New File"
            >
              <FilePlus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleStartCreateFolder}
              className="p-1 rounded text-secondary hover:text-primary hover:bg-surface-elevated transition cursor-pointer"
              title="New Folder"
              aria-label="New Folder"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Creation Inline Input */}
      {(isCreatingFile || isCreatingFolder) && (
        <form
          onSubmit={handleConfirmCreate}
          className="p-2 border-b border-subtle bg-surface-elevated flex items-center gap-1.5"
        >
          {isCreatingFile ? (
            <FileCode className="h-3.5 w-3.5 text-accent shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          )}
          <input
            type="text"
            autoFocus
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={isCreatingFile ? 'filename.js or src/file.js' : 'folder-name'}
            className="flex-1 bg-main border border-subtle focus:border-accent rounded px-2 py-1 text-xs text-primary font-mono focus:outline-none"
          />
          <button
            type="submit"
            className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
            title="Create"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatingFile(false);
              setIsCreatingFolder(false);
            }}
            className="p-1 text-muted hover:text-primary cursor-pointer"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filePaths.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted font-mono">
            No files in workspace
          </div>
        ) : (
          renderTree(rootTree)
        )}
      </div>
    </div>
  );
};
