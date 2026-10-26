const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function value(input, limit) {
  return typeof input === 'string' ? input.trim().slice(0, limit) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); }
  catch { return res.status(400).json({ error: 'Invalid JSON body.' }); }

  const name = value(body.name, 200);
  const email = value(body.email, 320);
  const company = value(body.company, 200);
  if (!name || !EMAIL_PATTERN.test(email)) return res.status(400).json({ error: 'Please check your name and email.' });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'Contact form is not configured yet. Email us on Discord or GitHub.' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || 'Altrace <onboarding@resend.dev>', to: [process.env.CONTACT_TO_EMAIL || 'rishi@altrace.io'], reply_to: email, subject: `Team chat request — ${name}`, text: `New team inquiry\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || '(not provided)'}` }),
    });
    if (!response.ok) {
      console.error('[contact] Resend error:', response.status);
      return res.status(502).json({ error: 'Could not send your message. Try again later.' });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Could not send your message. Try again later.' });
  }
}
