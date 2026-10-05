import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  RotateCw,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Terminal,
  AlertCircle,
} from 'lucide-react';

interface WebPreviewProps {
  files: Record<string, string>;
  previewPort?: number;
  previewUrl?: string;
}

export const WebPreview: React.FC<WebPreviewProps> = ({
  files,
  previewPort = 5000,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'error' | 'warn'; message: string }>>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Construct bundled srcDoc for standard HTML/JS/CSS client apps
  const srcDoc = useMemo(() => {
    // Find index.html or construct default
    const htmlFile = files['index.html'] || files['public/index.html'] || files['src/index.html'];
    const cssFiles = Object.entries(files)
      .filter(([k]) => k.endsWith('.css'))
      .map(([, v]) => v)
      .join('\n');
    const jsFiles = Object.entries(files)
      .filter(([k]) => (k.endsWith('.js') || k.endsWith('.jsx')) && !k.includes('test') && !k.includes('harness'))
      .map(([, v]) => v)
      .join('\n');

    const consoleBridge = `
      <script>
        (function() {
          var oldLog = console.log;
          var oldError = console.error;
          var oldWarn = console.warn;
          window.addEventListener('error', function(e) {
            window.parent.postMessage({ type: 'CODEXA_CONSOLE', level: 'error', text: e.message || String(e) }, '*');
          });
          console.log = function() {
            var args = Array.prototype.slice.call(arguments).map(function(a) {
              return typeof a === 'object' ? JSON.stringify(a) : String(a);
            }).join(' ');
            window.parent.postMessage({ type: 'CODEXA_CONSOLE', level: 'log', text: args }, '*');
            oldLog.apply(console, arguments);
          };
          console.error = function() {
            var args = Array.prototype.slice.call(arguments).map(function(a) {
              return typeof a === 'object' ? JSON.stringify(a) : String(a);
            }).join(' ');
            window.parent.postMessage({ type: 'CODEXA_CONSOLE', level: 'error', text: args }, '*');
            oldError.apply(console, arguments);
          };
          console.warn = function() {
            var args = Array.prototype.slice.call(arguments).map(function(a) {
              return typeof a === 'object' ? JSON.stringify(a) : String(a);
            }).join(' ');
            window.parent.postMessage({ type: 'CODEXA_CONSOLE', level: 'warn', text: args }, '*');
            oldWarn.apply(console, arguments);
          };
        })();
      </script>
    `;

    if (htmlFile) {
      // Inject CSS and JS if not already inside HTML
      let finalHtml = htmlFile;
      if (!finalHtml.includes('<head>')) {
        finalHtml = `<!DOCTYPE html><html><head>${consoleBridge}<style>${cssFiles}</style></head><body>${finalHtml}<script>${jsFiles}</script></body></html>`;
      } else {
        finalHtml = finalHtml.replace('<head>', `<head>${consoleBridge}<style>${cssFiles}</style>`);
        finalHtml = finalHtml.replace('</body>', `<script>${jsFiles}</script></body>`);
      }
      return finalHtml;
    }

    // Default template for Node / API / Full-Stack servers
    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${consoleBridge}
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; }
            .card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            h2 { margin-top: 0; font-size: 18px; color: #0f172a; }
            p { font-size: 13px; color: #64748b; line-height: 1.5; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #ecfdf5; color: #059669; }
            code { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
            ${cssFiles}
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">App Server Ready (Port ${previewPort})</span>
            <h2>Codexa Live Web Preview</h2>
            <p>Your backend application and client routes are running. Click <strong>Run</strong> in the toolbar to execute your server.</p>
            <p>Active project files: <code>${Object.keys(files).join(', ')}</code></p>
          </div>
          <script>
            ${jsFiles}
          </script>
        </body>
      </html>
    `;
  }, [files, previewPort]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CODEXA_CONSOLE') {
        setConsoleLogs((prev) => [
          ...prev.slice(-49),
          { type: e.data.level || 'log', message: e.data.text },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const viewportWidth = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  }[viewportMode];

  return (
    <div className="flex flex-col h-full bg-surface border-subtle overflow-hidden">
      {/* Browser Bar */}
      <div className="px-3 py-2 border-b border-subtle bg-surface-elevated flex items-center justify-between gap-3 shrink-0 select-none">
        {/* URL Bar */}
        <div className="flex items-center gap-2 flex-1 bg-main border border-subtle rounded-lg px-2.5 py-1 text-xs text-secondary font-mono">
          <Globe className="h-3.5 w-3.5 text-muted shrink-0" />
          <span className="truncate">http://localhost:{previewPort}/</span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-surface border border-subtle rounded-lg p-0.5">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1 rounded text-xs transition cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-surface-elevated text-primary shadow-xs font-bold'
                : 'text-muted hover:text-primary'
            }`}
            title="Desktop View"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1 rounded text-xs transition cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-surface-elevated text-primary shadow-xs font-bold'
                : 'text-muted hover:text-primary'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1 rounded text-xs transition cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-surface-elevated text-primary shadow-xs font-bold'
                : 'text-muted hover:text-primary'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setConsoleLogs([]);
              setRefreshKey((k) => k + 1);
            }}
            className="p-1.5 rounded text-secondary hover:text-primary hover:bg-surface transition cursor-pointer"
            title="Reload Preview"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition cursor-pointer ${
              showConsole ? 'bg-surface-elevated text-primary font-bold' : 'text-secondary hover:text-primary'
            }`}
            title="Toggle Console Logs"
          >
            <Terminal className="h-3.5 w-3.5" />
            {consoleLogs.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-[#1e293b]/20 p-4 flex justify-center items-start overflow-auto">
        <div
          className={`${viewportWidth} h-full bg-white rounded-xl shadow-lg border border-subtle overflow-hidden transition-all duration-200 flex flex-col`}
        >
          <iframe
            key={refreshKey}
            srcDoc={srcDoc}
            title="Web Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full flex-1 border-none bg-white"
          />
        </div>
      </div>

      {/* Embedded Console Drawer */}
      {showConsole && (
        <div className="h-36 border-t border-subtle bg-[#0d1117] text-slate-200 p-2.5 overflow-y-auto font-mono text-[11px] space-y-1">
          <div className="flex items-center justify-between pb-1 border-b border-subtle/50 text-slate-500 font-semibold select-none">
            <span>PREVIEW CONSOLE</span>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-[10px] hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          </div>
          {consoleLogs.length === 0 ? (
            <div className="text-slate-500 italic py-1">No console messages logged.</div>
          ) : (
            consoleLogs.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  log.type === 'error'
                    ? 'text-rose-400 flex items-start gap-1'
                    : log.type === 'warn'
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }`}
              >
                {log.type === 'error' && <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />}
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
