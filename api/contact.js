// Vercel Serverless Function — handles contact form submissions
// Sends email via Resend API if RESEND_API_KEY is set,
// otherwise stores messages in Upstash Redis for later retrieval.

import { Redis } from '@upstash/redis';
import { applyCors } from './_lib/cors';
import { checkRateLimit } from './_lib/rateLimit';
import { requireCaptcha } from './_lib/botProtection';
import { isValidEmail, rejectUnexpectedKeys } from './_lib/validation';

const CONTACT_KEY = 'contact_messages';
const MAX_MESSAGES = 500;
const RECIPIENT = 'matthew.donovan@alumni.griffithuni.edu.au';

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

async function sendEmail({ name, email, subject, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Ideology Compass <noreply@ideologycompass.com>',
      to: RECIPIENT,
      reply_to: email,
      subject: `[Contact] ${subject || 'General Inquiry'} — from ${name || 'Anonymous'}`,
      text: [
        `From: ${name || 'Not provided'}`,
        `Email: ${email}`,
        `Subject: ${subject || 'General Inquiry'}`,
        '',
        'Message:',
        message,
        '',
        `Sent at: ${new Date().toISOString()}`,
      ].join('\n'),
    }),
  });

  return res.ok;
}

export default async function handler(req, res) {
  if (!applyCors(req, res, ['POST'])) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await checkRateLimit(req, res, 'contact', { limit: 10, window: '1 m' }))) return;

  const body = req.body || {};
  if (rejectUnexpectedKeys(res, body, ['name', 'email', 'subject', 'message', 'website', 'captchaToken'])) return;

  const { name, email, subject, message, website } = body;
  const trimmedEmail = String(email || '').trim().toLowerCase();
  const trimmedMessage = String(message || '').trim();

  if (!(await requireCaptcha(req, res, { required: true }))) return;

  if (website) {
    return res.status(400).json({ error: 'Bot detected' });
  }

  if (!trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
    return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
  }

  const entry = {
    name: (name || '').slice(0, 200),
    email: trimmedEmail.slice(0, 200),
    subject: (subject || 'General Inquiry').slice(0, 200),
    message: trimmedMessage.slice(0, 5000),
    timestamp: new Date().toISOString(),
  };

  try {
    // Try sending email
    const emailSent = await sendEmail(entry);

    // Always store in Redis as backup
    const redis = getRedis();
    await redis.lpush(CONTACT_KEY, JSON.stringify(entry));
    await redis.ltrim(CONTACT_KEY, 0, MAX_MESSAGES - 1);

    return res.status(200).json({ ok: true, emailSent });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}
