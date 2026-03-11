'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

interface JoinPreferences {
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface PreJoinPreviewProps {
  roomId: string;
  userName: string;
  defaultAudioEnabled?: boolean;
  defaultVideoEnabled?: boolean;
  onJoin: (preferences: JoinPreferences) => void;
  onCancel: () => void;
}

export default function PreJoinPreview({
  roomId,
  userName,
  defaultAudioEnabled = true,
  defaultVideoEnabled = true,
  onJoin,
  onCancel,
}: PreJoinPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(defaultAudioEnabled);
  const [videoEnabled, setVideoEnabled] = useState(defaultVideoEnabled);
  const [isJoining, setIsJoining] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupPreview = async () => {
      if (!audioEnabled && !videoEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setCameraError(null);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioEnabled,
          video: videoEnabled,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        streamRef.current = stream;
        setCameraError(null);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch (error) {
        console.error('Failed to start media preview:', error);

        // If camera permission/device fails, keep the pre-join usable by
        // switching video off while preserving mic preference.
        if (videoEnabled) {
          setVideoEnabled(false);
          setCameraError('Camera unavailable. You can still join with audio.');
        } else {
          setCameraError('Microphone unavailable. You can still join muted.');
          setAudioEnabled(false);
        }
      }
    };

    setupPreview();

    return () => {
      isMounted = false;
    };
  }, [audioEnabled, videoEnabled]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 pt-24 pb-10 md:flex-row md:gap-10">
        <div className="w-full max-w-xl">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-[#202124] shadow-sm">
            {videoEnabled ? (
              <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-[#202124]">
                <div className="text-center text-[#e8eaed]">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#3c4043] text-xl font-semibold">
                    {userName?.trim()?.slice(0, 1)?.toUpperCase() || 'U'}
                  </div>
                  <p className="text-sm text-[#9aa0a6]">Camera is turned off</p>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-linear-to-t from-black/70 to-transparent px-4 py-4">
              <button
                type="button"
                onClick={() => setAudioEnabled((v) => !v)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  audioEnabled ? 'bg-[#3c4043] text-white hover:bg-[#5f6368]' : 'bg-[#ea4335] text-white hover:bg-[#d93025]'
                }`}
                aria-label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setVideoEnabled((v) => !v)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  videoEnabled ? 'bg-[#3c4043] text-white hover:bg-[#5f6368]' : 'bg-[#ea4335] text-white hover:bg-[#d93025]'
                }`}
                aria-label={videoEnabled ? 'Turn camera off' : 'Turn camera on'}
              >
                {videoEnabled ? <Camera size={18} /> : <CameraOff size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Ready to join?</h1>
            <p className="mt-2 text-sm text-gray-600">Check your audio and video before entering the room.</p>

            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">Room</p>
              <p className="mt-1 font-mono text-sm text-gray-900">{roomId}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-600">Joining as</p>
              <p className="mt-1 text-sm text-gray-900">{userName}</p>
            </div>

            {cameraError ? <p className="mt-4 text-sm text-[#d93025]">{cameraError}</p> : null}

            <button
              type="button"
              disabled={isJoining}
              onClick={() => {
                setIsJoining(true);
                toast.success('Joining room...');
                onJoin({ audioEnabled, videoEnabled });
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#6B46C1] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Phone size={16} />
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
