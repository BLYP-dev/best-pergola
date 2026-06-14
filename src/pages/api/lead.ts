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

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

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
    return json({ ok: false, error: 'Please provide your name, a valid email and your postcode.' }, 400);
  }

  const lead = {
    receivedAt: new Date().toISOString(),
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

  // For MVP: log to the Workers console. Cloudflare Pages captures these.
  console.log('NEW_LEAD', JSON.stringify(lead));

  // ── Wire up real delivery here ──────────────────────────────────
  // TODO(Resend): POST to https://api.resend.com/emails using env.RESEND_API_KEY
  //   to email the lead to LEAD_NOTIFY_EMAIL.
  // TODO(Supabase): insert into a `leads` table once Supabase is set up.
  // TODO(Slack/Telegram): optional notification webhook.
  // ────────────────────────────────────────────────────────────────

  // Example shape for env access on Cloudflare Pages:
  //   const env = (locals as any).runtime?.env as { RESEND_API_KEY?: string; LEAD_NOTIFY_EMAIL?: string } | undefined;
  //   if (env?.RESEND_API_KEY && env?.LEAD_NOTIFY_EMAIL) { ... await fetch(...) ... }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
