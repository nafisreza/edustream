import { AccessToken } from 'livekit-server-sdk';

export const generateLiveKitToken = async (
  roomName: string,
  participantName: string,
  participantId: string,
  isHost: boolean = false
): Promise<string> => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit credentials not configured');
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantId,
    name: participantName,
  });

  // Set permissions based on role
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    // Host has additional permissions
    ...(isHost && {
      roomAdmin: true,
      roomRecord: true,
    }),
  });

  const jwt = await at.toJwt();
  return jwt;
};
