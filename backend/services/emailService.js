import { Resend } from 'resend';

// Lazy initialization of Resend - only create instance when needed
let resendInstance = null;

const getResendInstance = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

export const sendOtpEmail = async (to, otp) => {
  try {
    const resend = getResendInstance();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `Wise Student <${fromEmail}>`,
      to: [to],
      subject: 'Your Wise Student Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Wise Student</h1>
                      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Digital Wellness & Financial Literacy Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Your Verification Code</h2>
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">We received a request to verify your account. Use the verification code below to complete your request:</p>
                      
                      <!-- OTP Box -->
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                        <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                      </div>
                      
                      <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        <strong>⏱️ Valid for 10 minutes</strong><br>
                        This code will expire in 10 minutes for security reasons. If you didn't request this code, please ignore this email or contact our support team if you have concerns.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Security Notice -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                          <strong>🔒 Security Tip:</strong> Never share this code with anyone. Wise Student staff will never ask for your verification code.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                        If you're having trouble, please contact our support team at 
                        <a href="mailto:support@wisestudent.org" style="color: #667eea; text-decoration: none;">support@wisestudent.org</a>
                      </p>
                      <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        © ${new Date().getFullYear()} Wise Student. All rights reserved.<br>
                        This is an automated message, please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`✅ OTP email sent successfully to ${to} via Resend`);
    return data;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};
