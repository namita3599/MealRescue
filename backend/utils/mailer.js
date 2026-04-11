import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_SECURE = typeof process.env.EMAIL_SECURE === 'string'
  ? process.env.EMAIL_SECURE.toLowerCase() === 'true'
  : EMAIL_PORT === 465;
const SMTP_REQUIRE_TLS = typeof process.env.SMTP_REQUIRE_TLS === 'string'
  ? process.env.SMTP_REQUIRE_TLS.toLowerCase() === 'true'
  : false;

const buildTransport = ({ port, secure, requireTLS }) => nodemailer.createTransport({
  host: EMAIL_HOST,
  port,
  secure,
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
  requireTLS,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const transporter = buildTransport({
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  requireTLS: SMTP_REQUIRE_TLS,
});

const RETRYABLE_EMAIL_CODES = new Set([
  'ETIMEDOUT',
  'ESOCKET',
  'ECONNECTION',
  'EHOSTUNREACH',
  'ECONNRESET',
]);

export const sendMail = async (mailOptions) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    const err = new Error('Email credentials are missing on server');
    err.code = 'OTP_EMAIL_CONFIG_ERROR';
    throw err;
  }

  const mergedOptions = {
    from: EMAIL_USER,
    ...mailOptions,
  };

  const maxRetries = Number(process.env.SMTP_MAX_RETRIES || 0);
  let attempt = 0;
  let lastError = null;
  let info = null;

  while (attempt <= maxRetries) {
    try {
      info = await transporter.sendMail(mergedOptions);
      break;
    } catch (err) {
      lastError = err;
      if (!RETRYABLE_EMAIL_CODES.has(err.code) || attempt === maxRetries) {
        throw err;
      }
      attempt += 1;
    }
  }

  const shouldTryGmailAlternateMode =
    !info &&
    lastError &&
    RETRYABLE_EMAIL_CODES.has(lastError.code) &&
    EMAIL_HOST.toLowerCase() === 'smtp.gmail.com';

  if (shouldTryGmailAlternateMode) {
    const alternatePort = EMAIL_PORT === 465 ? 587 : 465;
    const alternateSecure = alternatePort === 465;
    const alternateRequireTLS = alternatePort === 587;

    try {
      const alternateTransport = buildTransport({
        port: alternatePort,
        secure: alternateSecure,
        requireTLS: alternateRequireTLS,
      });
      info = await alternateTransport.sendMail(mergedOptions);
    } catch (altErr) {
      lastError = altErr;
    }
  }

  if (!info && lastError) {
    throw lastError;
  }

  // Nodemailer can resolve with rejected recipients instead of throwing.
  if ((!info.accepted || info.accepted.length === 0) && info.rejected && info.rejected.length > 0) {
    const err = new Error(`Email rejected by SMTP for: ${info.rejected.join(', ')}`);
    err.code = 'EMAIL_REJECTED';
    throw err;
  }

  return info;
};

export { EMAIL_USER };
