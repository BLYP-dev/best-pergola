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
  roofType?: string;
  approximateSize?: string;
  installationSurface?: string;
  budget?: string;
  timeframe?: string;
  notes?: string;
  company?: string; // honeypot
};

type LeadStore = {
  put: (
    key: string,
    value: string,
    options?: { metadata?: Record<string, string> },
  ) => Promise<void>;
};

type Env = {
  LEADS?: LeadStore;
  AIRTABLE_API_KEY?: string;
  AIRTABLE_BASE_ID?: string;
  AIRTABLE_TABLE_ID?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
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
    name: body.name.toString().trim(),
    email: body.email.toString().trim(),
    phone: body.phone?.toString().trim() ?? '',
    postcode: body.postcode.toString().trim().toUpperCase(),
    town: body.town?.toString().trim() ?? '',
    county: body.county?.toString().trim() ?? '',
    pergolaType: body.pergolaType?.toString().trim() ?? '',
    roofType: body.roofType?.toString().trim() ?? '',
    approximateSize: body.approximateSize?.toString().trim() ?? '',
    installationSurface: body.installationSurface?.toString().trim() ?? '',
    budget: body.budget?.toString().trim() ?? '',
    timeframe: body.timeframe?.toString().trim() ?? '',
    notes: body.notes?.toString().trim() ?? '',
    userAgent: request.headers.get('user-agent') ?? '',
    referer: request.headers.get('referer') ?? '',
  };

  const env = (locals as { runtime?: { env?: Env } }).runtime?.env;

  console.log('NEW_LEAD', JSON.stringify(lead));

  // Fire all delivery channels concurrently and don't block on any one failing.
  const tasks: Promise<unknown>[] = [];

  if (env?.LEADS) {
    tasks.push(
      env.LEADS.put(`lead:${receivedAt}:${randomId()}`, JSON.stringify(lead), {
        metadata: {
          email: lead.email,
          county: lead.county,
          postcode: lead.postcode,
        },
      }).catch((err: unknown) => console.error('KV_PUT_FAILED', err)),
    );
  }

  if (env?.AIRTABLE_API_KEY && env?.AIRTABLE_BASE_ID && env?.AIRTABLE_TABLE_ID) {
    tasks.push(postToAirtable(lead, env).catch((err) => console.error('AIRTABLE_FAILED', err)));
  }

  if (env?.RESEND_API_KEY && env?.LEAD_NOTIFY_EMAIL) {
    tasks.push(sendNotificationEmail(lead, env).catch((err) => console.error('RESEND_FAILED', err)));
  }

  await Promise.all(tasks);

  return json({ ok: true });
};

async function postToAirtable(lead: Record<string, string>, env: Env): Promise<void> {
  const url = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: lead.name,
            Email: lead.email,
            Phone: lead.phone || undefined,
            Postcode: lead.postcode,
            Town: lead.town || undefined,
            County: lead.county || undefined,
            'Pergola Type': lead.pergolaType || undefined,
            Budget: lead.budget || undefined,
            Timeframe: lead.timeframe || undefined,
            Notes: [
              lead.roofType ? `Roof type: ${lead.roofType}` : '',
              lead.approximateSize ? `Approximate size: ${lead.approximateSize}` : '',
              lead.installationSurface ? `Installation surface: ${lead.installationSurface}` : '',
              lead.notes ? `Notes: ${lead.notes}` : '',
            ].filter(Boolean).join('\n') || undefined,
            Status: 'New',
            'Received At': lead.receivedAt,
            Referer: lead.referer || undefined,
            'User Agent': lead.userAgent || undefined,
          },
        },
      ],
      typecast: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Airtable ${res.status}: ${detail.slice(0, 300)}`);
  }
}

async function sendNotificationEmail(lead: Record<string, string>, env: Env): Promise<void> {
  const from = env.RESEND_FROM || 'BestPergola Leads <leads@bestpergola.co.uk>';
  const subject = `New pergola enquiry — ${lead.county || lead.postcode}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: env.LEAD_NOTIFY_EMAIL,
      reply_to: lead.email,
      subject,
      text: formatLeadEmail(lead),
      html: formatLeadHtml(lead),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function formatLeadEmail(lead: Record<string, string>): string {
  return [
    `New pergola enquiry received via BestPergola.co.uk`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || '—'}`,
    ``,
    `Location: ${lead.town || '—'}, ${lead.county || '—'} (${lead.postcode})`,
    ``,
    `Pergola type: ${lead.pergolaType || '—'}`,
    `Roof type: ${lead.roofType || '—'}`,
    `Approximate size: ${lead.approximateSize || '—'}`,
    `Installation surface: ${lead.installationSurface || '—'}`,
    `Budget: ${lead.budget || '—'}`,
    `Timeframe: ${lead.timeframe || '—'}`,
    ``,
    `Notes:`,
    lead.notes || '—',
    ``,
    `Received: ${lead.receivedAt}`,
    `Referer: ${lead.referer || '—'}`,
  ].join('\n');
}

function formatLeadHtml(lead: Record<string, string>): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7163;font-size:13px;">${label}</td><td style="padding:6px 0;font-size:14px;color:#0f1e16;"><strong>${escapeHtml(value || '—')}</strong></td></tr>`;
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f1e16;line-height:1.5;margin:0;padding:24px;background:#fbf7ec;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;">
      <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6b7163;">New lead</div>
      <h1 style="font-family:Georgia,serif;font-size:28px;margin:8px 0 4px;color:#1c3528;">${escapeHtml(lead.name)}</h1>
      <div style="color:#6b7163;font-size:14px;margin-bottom:24px;">${escapeHtml(lead.town || '')}${lead.town && lead.county ? ', ' : ''}${escapeHtml(lead.county || '')} · ${escapeHtml(lead.postcode)}</div>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Email', lead.email)}
        ${row('Phone', lead.phone)}
        ${row('Pergola type', lead.pergolaType)}
        ${row('Roof type', lead.roofType)}
        ${row('Approximate size', lead.approximateSize)}
        ${row('Installation surface', lead.installationSurface)}
        ${row('Budget', lead.budget)}
        ${row('Timeframe', lead.timeframe)}
      </table>
      ${lead.notes ? `<div style="margin-top:24px;padding:16px;background:#f7f1e3;border-radius:12px;font-size:14px;"><div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6b7163;margin-bottom:8px;">Notes</div>${escapeHtml(lead.notes)}</div>` : ''}
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #f1e9d8;font-size:12px;color:#6b7163;">Received ${escapeHtml(lead.receivedAt)} · Referer: ${escapeHtml(lead.referer || '—')}</div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
