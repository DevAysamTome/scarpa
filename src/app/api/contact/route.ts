import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Phone number must be at least 5 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the data
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return validation errors with a 400 status
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;

    // Create a transporter using SMTP with updated configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // Only use secure for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // Modern Arabic email signature HTML
    const signatureHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; direction: rtl; text-align: right;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px; color: #666;">مع تحياتنا،</p>
            <p style="margin: 5px 0; font-weight: bold; font-size: 18px; color: #333;">${validatedData.name}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">${validatedData.email}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">هاتف: ${validatedData.phone}</p>
          </div>
          <div style="width: 60px; height: 60px; background-color: #f5f5f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 24px; color: #666;">👤</span>
          </div>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 40px; height: 40px; background-color: #4a90e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 10px;">
              <span style="color: white; font-size: 18px;">👟</span>
            </div>
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 16px; color: #333;">سكاربا للأحذية</p>
              <p style="margin: 0; font-size: 14px; color: #666;">وجهتكم للأحذية الفاخرة</p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ddd;">
            <div style="text-align: center; flex: 1;">
              <p style="margin: 0; font-size: 12px; color: #888;">البريد الإلكتروني</p>
              <p style="margin: 0; font-size: 14px; color: #555;">info@scarpashoes.com</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <p style="margin: 0; font-size: 12px; color: #888;">الهاتف</p>
              <p style="margin: 0; font-size: 14px; color: #555;">+971 50 123 4567</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <p style="margin: 0; font-size: 12px; color: #888;">الموقع</p>
              <p style="margin: 0; font-size: 14px; color: #555;">www.scarpashoes.com</p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} سكاربا للأحذية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    `;

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact Form: New Message from ${validatedData.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2 style="color: #333; margin-bottom: 20px; text-align: center;">رسالة جديدة من نموذج الاتصال</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 10px 0;"><strong>الاسم:</strong> ${validatedData.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>البريد الإلكتروني:</strong> ${validatedData.email}</p>
            <p style="margin: 0 0 10px 0;"><strong>الهاتف:</strong> ${validatedData.phone}</p>
            <p style="margin: 0 0 10px 0;"><strong>الرسالة:</strong></p>
            <p style="margin: 0 0 20px 0; white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 5px; border-right: 3px solid #4a90e2;">${validatedData.message}</p>
          </div>
          ${signatureHtml}
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 