import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
  userId: string;
  name: string;
  role: 'host' | 'participant';
  status: 'active' | 'pending';
  joinedAt: Date;
}

export interface IRoom extends Document {
  roomId: string;
  name: string;
  description?: string;
  hostId: string;
  hostName: string;
  participants: IParticipant[];
  isActive: boolean;
  whiteboardState?: Buffer;
  settings: {
    maxParticipants: number;
    autoMuteOnJoin: boolean;
    waitingRoomEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['host', 'participant'],
    default: 'participant',
  },
  status: {
    type: String,
    enum: ['active', 'pending'],
    default: 'active',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const roomSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    hostId: {
      type: String,
      required: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    participants: [participantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    whiteboardState: {
      type: Buffer,
      default: null,
    },
    settings: {
      maxParticipants: {
        type: Number,
        default: 50,
        min: 2,
        max: 100,
      },
      autoMuteOnJoin: {
        type: Boolean,
        default: false,
      },
      waitingRoomEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model<IRoom>('Room', roomSchema);
