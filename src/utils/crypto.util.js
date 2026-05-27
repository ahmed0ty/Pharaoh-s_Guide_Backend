import crypto from 'crypto';

const ALGO   = 'aes-256-gcm';
const KEY    = Buffer.from(process.env.CRYPTO_SECRET_KEY || crypto.randomBytes(32).toString('hex').slice(0, 64), 'hex');
const IV_LEN = 16;

export const encrypt = (text) => {
  const iv         = crypto.randomBytes(IV_LEN);
  const cipher     = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted  = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  const authTag    = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (encryptedText) => {
  const [ivHex, authTagHex, dataHex] = encryptedText.split(':');
  const iv         = Buffer.from(ivHex, 'hex');
  const authTag    = Buffer.from(authTagHex, 'hex');
  const decipher   = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
};

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateOTP = (length = 6) =>
  crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

export const generateSecureToken = () =>
  crypto.randomBytes(32).toString('hex');