'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { roomApi } from '@/lib/room';

interface RoomSettingsProps {
  roomId: string;
  initialSettings: {
    maxParticipants: number;
    autoMuteOnJoin: boolean;
    waitingRoomEnabled: boolean;
  };
  onSaved?: (settings: { maxParticipants: number; autoMuteOnJoin: boolean; waitingRoomEnabled: boolean }) => void;
  onClose: () => void;
}

export default function RoomSettings({ roomId, initialSettings, onSaved, onClose }: RoomSettingsProps) {
  const [maxParticipants, setMaxParticipants] = useState(initialSettings.maxParticipants);
  const [autoMuteOnJoin, setAutoMuteOnJoin] = useState(initialSettings.autoMuteOnJoin);
  const [waitingRoomEnabled, setWaitingRoomEnabled] = useState(initialSettings.waitingRoomEnabled);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await roomApi.updateRoomSettings(roomId, { maxParticipants, autoMuteOnJoin, waitingRoomEnabled });
      onSaved?.({ maxParticipants, autoMuteOnJoin, waitingRoomEnabled });
      toast.success('Settings saved');
      onClose();
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-gray-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-base">Room Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Max participants */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Max Participants</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={2}
                max={100}
                value={maxParticipants}
                onChange={(e) =>
                  setMaxParticipants(Math.max(2, Math.min(100, Number(e.target.value))))
                }
                className="w-24 bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="text-xs text-gray-500">2 – 100</span>
            </div>
          </div>

          {/* Auto-mute on join */}
          <ToggleSetting
            label="Auto-mute on join"
            description="New participants join with their microphone muted"
            checked={autoMuteOnJoin}
            onChange={setAutoMuteOnJoin}
          />

          {/* Waiting room */}
          <ToggleSetting
            label="Waiting room"
            description="Participants wait for host approval before entering"
            checked={waitingRoomEnabled}
            onChange={setWaitingRoomEnabled}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-9 h-5 rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
