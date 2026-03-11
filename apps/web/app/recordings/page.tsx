'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { recordingApi, RecordingInfo } from '@/lib/recording';
import { toast } from 'react-hot-toast';

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RecordingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [recordings, setRecordings] = useState<RecordingInfo[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const loadRecordings = useCallback(async () => {
    try {
      const data = await recordingApi.listRecordings();
      setRecordings(data.recordings);
    } catch {
      toast.error('Failed to load recordings');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadRecordings();
  }, [user, loadRecordings]);

  const handleDownload = (recordingId: string) => {
    const url = recordingApi.getDownloadUrl(recordingId);
    window.open(url, '_blank');
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Recordings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Recordings of sessions you hosted. Only completed recordings are shown.
            </p>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading recordings…
            </div>
          ) : recordings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
              </svg>
              <p className="text-lg font-medium">No recordings yet</p>
              <p className="text-sm mt-1">Start a class and hit the Record button to capture sessions.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Room</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Duration</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Size</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recordings.map((rec) => (
                    <tr key={rec.recordingId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 truncate max-w-50">{rec.roomName}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{rec.roomId}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(rec.startedAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 tabular-nums">
                        {formatDuration(rec.duration)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatFileSize(rec.fileSize)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={rec.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {rec.status === 'completed' && (
                          <button
                            onClick={() => handleDownload(rec.recordingId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                          >
                            <DownloadIcon />
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: RecordingInfo['status'] }) {
  const map = {
    recording: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status === 'recording' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
