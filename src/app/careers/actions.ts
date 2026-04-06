'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitApplication(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const linkedin = formData.get('linkedin') as string;
    const github = formData.get('github') as string;
    const notes = formData.get('notes') as string;
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const file = formData.get('resume') as File;

    const fileBuffer = file ? Buffer.from(await file.arrayBuffer()) : null;

    console.log(`Sending application for ${jobTitle} from ${name}...`);

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6;">
        <div style="padding: 40px 0; border-bottom: 1px solid #eee;">
          <span style="font-size: 11px; letter-spacing: 3px; color: #888; text-transform: uppercase;">InquisLab Recruitment</span>
          <h1 style="font-size: 24px; margin: 10px 0 0; font-weight: 600;">New Application: ${jobTitle}</h1>
        </div>
        
        <div style="padding: 30px 0;">
          <div style="margin-bottom: 25px;">
            <label style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Candidate</label>
            <span style="font-size: 18px; font-weight: 500;">${name}</span>
          </div>
          
          <div style="margin-bottom: 25px;">
            <label style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Email</label>
            <a href="mailto:${email}" style="color: #111; text-decoration: none; font-size: 16px; border-bottom: 1px solid #ddd;">${email}</a>
          </div>

          <div style="margin-bottom: 25px;">
            <label style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Links</label>
            ${linkedin ? `<a href="${linkedin}" style="display: block; color: #888; text-decoration: none; font-size: 14px; margin-bottom: 5px;">LinkedIn ↗</a>` : ''}
            ${github ? `<a href="${github}" style="display: block; color: #888; text-decoration: none; font-size: 14px;">GitHub / Work ↗</a>` : ''}
          </div>

          <div style="margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <label style="display: block; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Why InquisLab?</label>
            <p style="margin: 0; font-size: 15px; color: #444; font-style: italic;">"${notes || 'No notes provided.'}"</p>
          </div>
        </div>

        <div style="padding-top: 20px; border-top: 1px solid #eee; color: #aaa; font-size: 11px; text-align: center;">
          Sent via InquisLab Research Portal · 2026
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'InquisLab <system@inquislab.com>',
      to: 'careers@inquislab.com',
      subject: `[Application] ${jobTitle} — ${name}`,
      replyTo: email,
      html: htmlContent,
      attachments: fileBuffer ? [
        {
          filename: file.name,
          content: fileBuffer,
        }
      ] : [],
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error(error.message);
    }

    return { success: true, message: 'Application submitted successfully. We will be in touch.' };
  } catch (error) {
    console.error('Application submission error:', error);
    return { success: false, message: 'Failed to submit application. Please try again or email careers@inquislab.com directly.' };
  }
}
