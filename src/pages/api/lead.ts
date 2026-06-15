import type { APIRoute } from 'astro';

export const prerender = false;

type Lead = {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  town?: string;
  county?: string;
  pergolaType?: string;
  budget?: string;
  timeframe?: string;
  notes?: string;
  company?: string; // honeypot
};

type Env = {
  LEADS?: KVNamespace;
  RESEND_API_KEY?: string;
  LEAD_NOTIFY_EMAIL?: string;
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const randomId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Lead;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    body = contentType.includes('application/json')
      ? ((await request.json()) as Lead)
      : (Object.fromEntries(await request.formData()) as Lead);
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400);
  }

  // Honeypot — bots fill it, humans don't see it.
  if (body.company && body.company.trim().length > 0) {
    return json({ ok: true });
  }

  // Required fields
  if (!body.name || !body.email || !body.postcode || !isEmail(body.email)) {
    return json(
      { ok: false, error: 'Please provide your name, a valid email and your postcode.' },
      400,
    );
  }

  const receivedAt = new Date().toISOString();
  const lead = {
    receivedAt,
    name: body.name?.toString().trim(),
    email: body.email?.toString().trim(),
    phone: body.phone?.toString().trim() ?? '',
    postcode: body.postcode?.toString().trim().toUpperCase(),
    town: body.town?.toString().trim() ?? '',
    county: body.county?.toString().trim() ?? '',
    pergolaType: body.pergolaType?.toString().trim() ?? '',
    budget: body.budget?.toString().trim() ?? '',
    timeframe: body.timeframe?.toString().trim() ?? '',
    notes: body.notes?.toString().trim() ?? '',
    userAgent: request.headers.get('user-agent') ?? '',
    referer: request.headers.get('referer') ?? '',
  };

  const env = (locals as { runtime?: { env?: Env } }).runtime?.env;

  // 1) Persist to KV — primary storage for MVP
  if (env?.LEADS) {
    const key = `lead:${receivedAt}:${randomId()}`;
    try {
      await env.LEADS.put(key, JSON.stringify(lead), {
        metadata: {
          email: lead.email,
          county: lead.county,
          postcode: lead.postcode,
        },
      });
    } catch (err) {
      console.error('KV_PUT_FAILED', err);
      // Fall through — we still log and respond OK so the user isn't blocked.
    }
  }

  // 2) Log for tail visibility in Cloudflare Pages → Functions → Real-time logs
  console.log('NEW_LEAD', JSON.stringify(lead));

  // 3) Email notification (when RESEND_API_KEY + LEAD_NOTIFY_EMAIL are set)
  if (env?.RESEND_API_KEY && env?.LEAD_NOTIFY_EMAIL) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BestPergola Leads <leads@bestpergola.co.uk>',
          to: env.LEAD_NOTIFY_EMAIL,
          subject: `New pergola enquiry — ${lead.county || lead.postcode}`,
          text: formatLeadEmail(lead),
        }),
      });
    } catch (err) {
      console.error('RESEND_FAILED', err);
    }
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function formatLeadEmail(lead: Record<string, string>): string {
  const lines = [
    `New pergola enquiry received via BestPergola.co.uk`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || '—'}`,
    ``,
    `Location: ${lead.town || '—'}, ${lead.county || '—'} (${lead.postcode})`,
    ``,
    `Pergola type: ${lead.pergolaType || '—'}`,
    `Budget: ${lead.budget || '—'}`,
    `Timeframe: ${lead.timeframe || '—'}`,
    ``,
    `Notes:`,
    lead.notes || '—',
    ``,
    `Received: ${lead.receivedAt}`,
    `Referer: ${lead.referer || '—'}`,
  ];
  return lines.join('\n');
}
