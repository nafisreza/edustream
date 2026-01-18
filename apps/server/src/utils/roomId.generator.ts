/**
 * Generate a unique room ID
 * Format: XXX-XXX-XXX (e.g., ABC-123-XYZ)
 */
export const generateRoomId = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters (0, O, I, 1)
  const segments = 3;
  const segmentLength = 3;

  const randomSegment = (): string => {
    let segment = '';
    for (let i = 0; i < segmentLength; i++) {
      segment += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return segment;
  };

  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    parts.push(randomSegment());
  }

  return parts.join('-');
};

/**
 * Validate room ID format
 */
export const isValidRoomId = (roomId: string): boolean => {
  const pattern = /^[A-Z2-9]{3}-[A-Z2-9]{3}-[A-Z2-9]{3}$/;
  return pattern.test(roomId);
};
