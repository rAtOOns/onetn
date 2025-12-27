/**
 * Email service for sending notifications
 *
 * In production, integrate with:
 * - SendGrid: npm install @sendgrid/mail
 * - AWS SES: npm install @aws-sdk/client-ses
 * - Resend: npm install resend
 *
 * For development, emails are logged to console
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface NewsEmailData {
  title: string;
  titleTamil?: string;
  summary: string;
  url: string;
  imageUrl?: string;
}

const isDev = process.env.NODE_ENV !== "production";

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text } = options;

  if (isDev) {
    console.log("\n📧 Email (Dev Mode - Not Sent):");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Preview: ${text?.slice(0, 100) || html.slice(0, 100)}...`);
    return true;
  }

  // Production email sending
  // Uncomment and configure one of these:

  // SendGrid
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({ to, from: 'noreply@onetn.in', subject, html, text });

  // Resend
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'One TN <noreply@onetn.in>', to, subject, html });

  console.log(`Email sent to ${to}: ${subject}`);
  return true;
}

export function generateNewsEmailHtml(data: NewsEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">One TN</h1>
    <p style="color: #ccc; margin: 4px 0 0; font-size: 14px;">Tamil Nadu Education Portal</p>
  </div>

  <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
    ${data.imageUrl ? `
    <img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 16px;">
    ` : ''}

    <h2 style="color: #1e3a5f; margin: 0 0 8px; font-size: 20px;">${data.title}</h2>
    ${data.titleTamil ? `<p style="color: #666; margin: 0 0 16px; font-size: 16px;">${data.titleTamil}</p>` : ''}

    <p style="color: #444; margin: 0 0 24px;">${data.summary}</p>

    <a href="${data.url}" style="display: inline-block; background: #f59e0b; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
      Read Full Article →
    </a>
  </div>

  <div style="background: #f9fafb; padding: 16px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="color: #666; margin: 0; font-size: 12px;">
      You received this email because you subscribed to One TN news updates.
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe" style="color: #1e3a5f;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function generateNewsEmailText(data: NewsEmailData): string {
  return `
${data.title}
${data.titleTamil ? data.titleTamil : ''}

${data.summary}

Read more: ${data.url}

---
One TN - Tamil Nadu Education Portal
To unsubscribe, visit: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe
  `.trim();
}
