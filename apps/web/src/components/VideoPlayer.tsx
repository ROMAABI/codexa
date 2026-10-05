import React, { useState } from 'react';
import { Play, AlertTriangle, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { parseYouTubeId, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '@codexa/shared';

interface VideoPlayerProps {
  url?: string;
  embedUrl?: string;
  externalId?: string;
  title?: string;
  provider?: string;
  attribution?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  embedUrl,
  externalId,
  title = 'Educational Video',
  provider = 'YouTube',
  attribution,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  // Extract canonical video ID
  const videoId = parseYouTubeId(externalId) || parseYouTubeId(embedUrl) || parseYouTubeId(url);

  if (!videoId) {
    return (
      <div className={`rounded-xl border border-subtle bg-surface-elevated p-6 text-center space-y-2 ${className}`}>
        <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto" />
        <h4 className="text-sm font-semibold text-primary">Video Not Configured</h4>
        <p className="text-xs text-muted max-w-md mx-auto">
          No valid video stream is attached to this activity. All core learning notes and official docs remain accessible below.
        </p>
      </div>
    );
  }

  const finalEmbedUrl = embedUrl || getYouTubeEmbedUrl(videoId);
  const watchUrl = getYouTubeWatchUrl(videoId);

  return (
    <div className={`rounded-2xl border border-subtle bg-surface overflow-hidden shadow-lg ${className}`}>
      {/* Video Header Bar */}
      <div className="px-4 py-2.5 bg-surface-elevated border-b border-subtle flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold uppercase">
            <Play className="h-3 w-3 fill-rose-500" />
            {provider}
          </span>
          <span className="font-medium text-primary truncate">{title}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          {attribution && (
            <span className="text-muted hidden sm:inline">By {attribution}</span>
          )}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:text-sky-500 font-medium transition"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Responsive Video Frame / Fallback */}
      <div className="relative aspect-video w-full bg-black">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-surface text-secondary space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-bold text-primary">Video Stream Unavailable</h3>
              <p className="text-xs text-muted">
                The embedded player encountered an issue or is blocked by browser privacy settings.
                <strong className="text-sky-600 dark:text-sky-300 ml-1">Learning is not blocked:</strong> complete Codexa Notes and official documentation are available below.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setHasError(false);
                  setKey((prev) => prev + 1);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-200 dark:hover:bg-slate-700 text-secondary text-xs font-medium border border-subtle transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Player</span>
              </button>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition shadow-sm"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={key}
            src={finalEmbedUrl}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Resilient Learning Assurance Footer */}
      <div className="px-4 py-2 bg-surface-elevated border-t border-subtle flex items-center justify-between text-[11px] text-muted">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Official Embed • Zero Content Modification</span>
        </div>
        <button
          onClick={() => setHasError(true)}
          className="text-muted hover:text-secondary underline text-[10px]"
        >
          Report video issue
        </button>
      </div>
    </div>
  );
};
