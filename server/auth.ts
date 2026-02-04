import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ALGORITHM = 'HS256';

interface JWTPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

export function generateToken(userId: string, username: string, role: 'user' | 'admin' = 'user'): string {
  const header = {
    alg: ALGORITHM,
    typ: 'JWT',
  };

  const payload: JWTPayload = {
    userId,
    username,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');

    const headerJson = Buffer.from(headerEncoded, 'base64url').toString();
    const payloadJson = Buffer.from(payloadEncoded, 'base64url').toString();

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson) as JWTPayload;

    // Verify signature
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64url');

    if (signature !== signatureEncoded) {
      return null;
    }

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
