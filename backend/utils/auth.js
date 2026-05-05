import crypto from 'node:crypto';

const TOKEN_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const toBase64Url = (value) => Buffer.from(value).toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const signValue = (value) =>
  crypto.createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url');

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, 64);
  const originalBuffer = Buffer.from(originalHash, 'hex');

  if (derivedHash.length !== originalBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedHash, originalBuffer);
};

export const generateToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_TTL_MS
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const verifyToken = (token) => {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = signValue(encodedPayload);
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));
  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
};
