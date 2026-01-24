import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set');
    }

    console.log('📧 Sending OTP email to:', email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    await transporter.sendMail({
      from: `"EduStream" <${gmailUser}>`,
      to: email,
      subject: 'Password Reset OTP - EduStream',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #6B46C1; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">EduStream</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #6B46C1; margin-top: 0;">Password Reset Request</h2>
              <p>Hello ${name},</p>
              <p>We received a request to reset your password. Use the OTP below to continue:</p>
              <div style="background-color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #6B46C1; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This OTP will expire in <strong>10 minutes</strong>.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </body>
        </html>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};
