import emailjs from 'emailjs-com';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';
const SITE_URL    = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

const REWARDS_URL = `${SITE_URL}/`;

const RETAILERS = ['Amazon', 'Target', 'Walmart', 'Sephora', 'Ulta'];

function randomRetailers() {
  const count = Math.floor(Math.random() * 2) + 1;
  const shuffled = [...RETAILERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(' and ');
}

function randomPoints() {
  return Math.floor(Math.random() * 280) + 80;
}

const RETAIL_LOGOS = {
  Amazon: { initial: 'A', bg: '#232F3E' },
  Target:  { initial: 'T', bg: '#CC0000' },
  Walmart: { initial: 'W', bg: '#0071CE' },
  Sephora: { initial: 'S', bg: '#000000' },
  Ulta:    { initial: 'U', bg: '#8B1A4A' },
};

function buildReceiptsModule(retailers, points) {
  const retailerList = retailers.split(' and ');
  const rows = retailerList.map((r) => {
    const logo = RETAIL_LOGOS[r] || { initial: r[0], bg: '#555' };
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const pts = Math.floor(points / retailerList.length) + Math.floor(Math.random() * 30);
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.1);">
        <tr>
          <td style="padding:14px 0; vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:11px;"><div style="width:30px; height:30px; border-radius:8px; background:${logo.bg}; text-align:center; line-height:30px; font-size:13px; font-weight:700; color:#FFFFFF; font-family:Arial,sans-serif;">${logo.initial}</div></td>
              <td style="vertical-align:middle; white-space:nowrap;"><span style="font-size:15px; font-weight:600; color:#E7E2D8;">${r}</span> <span style="font-size:13px; color:#8C857A;">· ${month} ${day}</span></td>
            </tr></table>
          </td>
          <td align="right" style="font-size:15px; font-weight:700; color:#A9C0E6; white-space:nowrap;">+${pts} pts</td>
        </tr>
      </table>`;
  }).join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#17140F; background-image:radial-gradient(120% 140% at 92% 6%, rgba(132,159,204,0.22) 0%, rgba(23,20,15,0) 55%); border-radius:18px;">
      <tr>
        <td style="padding:30px 32px 14px;">
          <p style="margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:2.6px; text-transform:uppercase; color:#8C857A; font-family:Arial,sans-serif;">Added to your Oriva rewards</p>
          <p style="margin:0; font-family:Arial,sans-serif; font-size:42px; line-height:1; font-weight:700; letter-spacing:-1px; color:#FFFFFF;">+${points} <span style="font-size:18px; font-weight:600; color:#9C968B; letter-spacing:0;">points</span></p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px 30px;">${rows}</td>
      </tr>
    </table>`;
}

export const EMAIL_TYPES = [
  { id: 'welcome',    label: 'Consent confirmation / welcome' },
  { id: 'found',      label: 'We found receipts' },
  { id: 'not_found',  label: 'No receipts found' },
  { id: 'new_order',  label: 'New order found (ongoing scan)' },
  { id: 'revoked',    label: 'Consent revocation confirmation' },
];

function buildEmailHtml(type, firstName, ctaUrl = REWARDS_URL) {
  const retailers = randomRetailers();
  const points    = randomPoints();
  const firstRetailer = retailers.split(' and ')[0];

  const configs = {
    found: {
      glyph: '✓', glyphBg: '#849FCC',
      eyebrow: 'Points added',
      headline: 'We looked back. You earned it.',
      body: `
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">Hey <strong style="color:#232120;">${firstName}</strong>, good news — we went back through the last 90 days and found purchases you made at <strong style="color:#232120;">${retailers}</strong>.</p>
        <p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">You earned <strong style="color:#232120;">${points} points</strong> on those orders, and we've already added them to your Oriva account. No forms. No receipts to dig up. Just points, waiting for you.</p>`,
      module: buildReceiptsModule(retailers, points),
      continuation: `<p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">And from here on, our agents are on it. Every time you shop at one of our partner retailers, we'll spot it, credit it, and let you know.</p>`,
      cta: 'See your points balance',
      signoff: 'Thanks for being part of the Oriva community, wherever you shop.',
      footnote: 'We only ever look at purchase-confirmation emails. Nothing else, ever.',
    },
    not_found: {
      glyph: '⌕', glyphBg: '#C9B68A',
      eyebrow: 'Scan complete',
      headline: 'We checked. Nothing yet, but we\'re watching.',
      body: `
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">Hey <strong style="color:#232120;">${firstName}</strong>,</p>
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">We scanned the last 90 days and didn't find any retailer purchases to credit this time.</p>
        <p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">That's totally fine. Our agents are now running in the background, so the next time you grab something from Amazon, Target, or one of our retail partners, we'll catch it automatically and add the points to your account.</p>`,
      module: null,
      continuation: `<p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">No action needed from you. We've got it from here.</p>`,
      cta: 'View your Oriva rewards',
      signoff: '',
      footnote: 'We only ever look at purchase-confirmation emails. Nothing else, ever.',
    },
    new_order: {
      glyph: '✓', glyphBg: '#849FCC',
      eyebrow: 'New points',
      headline: 'New order, new points. Nice.',
      body: `
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">Hey <strong style="color:#232120;">${firstName}</strong>,</p>
        <p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">Our agents just spotted something exciting: a recent order from <strong style="color:#232120;">${firstRetailer}</strong>.</p>`,
      module: buildReceiptsModule(firstRetailer, points),
      continuation: `<p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">We've added <strong style="color:#232120;">${points} points</strong> to your Oriva account automatically. You didn't have to do anything. That's kind of the whole point.</p>`,
      cta: 'Redeem your points on oriva.com',
      signoff: 'See you soon,',
      footnote: null,
    },
    welcome: {
      glyph: '◴', glyphBg: '#849FCC',
      eyebrow: 'You\'re connected',
      headline: 'You\'re connected. We\'re already looking.',
      body: `
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">Hey <strong style="color:#232120;">${firstName}</strong>,</p>
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">You just did something most shoppers never think to do: made sure your purchases actually count.</p>
        <p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">Your inbox is now connected to Oriva Rewards. Our agents are scanning the last 90 days of receipts from retailers like Amazon, Target, and more. If we find something, we'll add the points and let you know.</p>`,
      module: null,
      continuation: `<p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">This usually takes just a few minutes. Sit tight.</p>`,
      cta: 'Check your Oriva rewards account',
      signoff: '',
      footnote: 'We only look at purchase confirmation emails. Nothing else, ever.',
    },
    revoked: {
      glyph: '✕', glyphBg: '#B6AFA2',
      eyebrow: 'Disconnected',
      headline: 'You\'ve disconnected. Your data is gone.',
      body: `
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">Hey <strong style="color:#232120;">${firstName}</strong>,</p>
        <p style="margin:0 0 16px; font-size:17px; line-height:1.62; color:#4B463D;">You've disconnected your inbox from Oriva Rewards. We've removed access immediately and deleted any data associated with your connection.</p>
        <p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">We won't scan for new purchases going forward, and any pending retailer points will no longer be tracked.</p>`,
      module: null,
      continuation: `<p style="margin:0; font-size:17px; line-height:1.62; color:#4B463D;">Your existing points balance stays exactly where it is. Those are yours.</p>`,
      cta: 'Manage your Oriva account',
      signoff: '',
      footnote: null,
    },
  };

  const c = configs[type] || configs.found;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background:#E4DACB;font-family:'Hanken Grotesk',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E4DACB;">
<tr><td align="center" style="padding:26px 12px 40px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(58,46,30,0.14);">

<!-- HEADER -->
<tr><td align="center" style="padding:30px 0 14px;background:#FFFFFF;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;padding-right:9px;">
      <div style="width:26px;height:26px;border-radius:50%;background:#849FCC;"></div>
    </td>
    <td style="vertical-align:middle;">
      <span style="font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:28px;letter-spacing:-1px;color:#232120;">oriva</span>
    </td>
  </tr></table>
</td></tr>
<tr><td align="center" style="padding:0 0 8px;background:#FFFFFF;">
  <span style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#B0A793;">Powered by Claim</span>
</td></tr>
<tr><td style="padding:8px 56px 14px;background:#FFFFFF;"><div style="height:1px;background:#EFE9DD;"></div></td></tr>

<!-- HERO IMAGE -->
<tr><td style="padding:0;font-size:0;line-height:0;">
  <img src="https://i.imgur.com/1DG04RJ.jpeg" width="600" alt="Oriva" style="width:100%;height:300px;object-fit:cover;object-position:50% 30%;display:block;" />
</td></tr>

<!-- STATUS GLYPH -->
<tr><td style="padding:34px 56px 0;background:#FFFFFF;">
  <div style="width:54px;height:54px;border-radius:50%;background:${c.glyphBg};text-align:center;line-height:54px;font-size:26px;color:#FFFFFF;font-weight:700;">${c.glyph}</div>
</td></tr>

<!-- BODY -->
<tr><td style="padding:22px 56px 0;background:#FFFFFF;">
  <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#849FCC;">${c.eyebrow}</p>
  <h1 style="margin:0 0 18px;font-size:33px;line-height:1.1;font-weight:800;letter-spacing:-0.6px;color:#232120;">${c.headline}</h1>
  ${c.body}
</td></tr>

${c.module ? `<tr><td style="padding:30px 56px 0;background:#FFFFFF;">${c.module}</td></tr>` : ''}

${c.continuation ? `<tr><td style="padding:26px 56px 0;background:#FFFFFF;">${c.continuation}</td></tr>` : ''}

<!-- CTA -->
<tr><td style="padding:30px 56px 6px;background:#FFFFFF;">
  <a href="${ctaUrl}" style="display:block;text-align:center;padding:18px 24px;background:#232120;color:#FFFFFF;font-size:17px;font-weight:700;letter-spacing:0.3px;border-radius:13px;text-decoration:none;">${c.cta}</a>
</td></tr>

<!-- SIGN-OFF -->
<tr><td style="padding:30px 56px 0;background:#FFFFFF;">
  ${c.signoff ? `<p style="margin:0 0 4px;font-size:17px;line-height:1.6;color:#4B463D;">${c.signoff}</p>` : ''}
  <p style="margin:0;font-size:17px;font-weight:700;color:#232120;">The Oriva Team</p>
</td></tr>

${c.footnote ? `
<tr><td style="padding:22px 56px 0;background:#FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2EB;border-radius:12px;">
    <tr><td style="padding:14px 18px;font-size:13.5px;line-height:1.5;color:#6B6456;">
      <span style="color:#849FCC;font-weight:700;">●</span>&nbsp; ${c.footnote}
    </td></tr>
  </table>
</td></tr>` : ''}

<!-- FOOTER -->
<tr><td style="padding:36px 56px 0;background:#FFFFFF;">
  <div style="height:1px;background:#EDE7DB;margin-bottom:24px;"></div>
  <p style="margin:0;font-size:14.5px;line-height:1.6;color:#6B6456;">You're in control. <a href="#" style="color:#3A4A7A;font-weight:700;">Manage your connection</a> or disconnect anytime.</p>
</td></tr>
<tr><td align="center" style="padding:24px 56px 30px;background:#FFFFFF;">
  <span style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#B0A793;">Receipts found by Claim</span>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

const SUBJECTS = {
  found:     'We looked back. You earned it.',
  not_found: "We checked. Nothing yet, but we're watching.",
  new_order: 'New order, new points. Nice.',
  welcome:   "You're connected. We're already looking.",
  revoked:   "You've disconnected. Your data is gone.",
};

export async function sendTransactionalEmail({ type, toEmail, firstName }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('ENV_MISSING');
  }

  const html = buildEmailHtml(type, firstName);
  const subject = SUBJECTS[type] || SUBJECTS.found;

  const result = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email:  toEmail,
      to_name:   firstName,
      subject,
      html_body: html,
    },
    PUBLIC_KEY
  );

  return result;
}
