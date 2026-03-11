import mongoose, { Document, Schema } from 'mongoose';

export interface IRecording extends Document {
  recordingId: string;
  roomId: string;
  roomName: string;
  hostId: string;
  hostName: string;
  egressId: string;
  status: 'recording' | 'completed' | 'failed';
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // seconds
  filePath?: string; // filename only, stored under RECORDINGS_DIR
  fileSize?: number; // bytes
  createdAt: Date;
  updatedAt: Date;
}

const recordingSchema = new Schema<IRecording>(
  {
    recordingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    roomId: { type: String, required: true, index: true },
    roomName: { type: String, required: true },
    hostId: { type: String, required: true, index: true },
    hostName: { type: String, required: true },
    egressId: { type: String, required: true },
    status: {
      type: String,
      enum: ['recording', 'completed', 'failed'],
      default: 'recording',
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number },
    filePath: { type: String },
    fileSize: { type: Number },
  },
  { timestamps: true }
);

export const Recording = mongoose.model<IRecording>('Recording', recordingSchema);
