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

export const sendInvitationEmail = async (toEmail, name, organizationName, role, tempPassword) => {
  try {
    const resend = getResendInstance();
    const roleLabels = {
      school_admin: "School Administrator",
      school_teacher: "Teacher",
      school_student: "Student",
      school_parent: "Parent",
      school_accountant: "Accountant",
      school_librarian: "Librarian",
      school_transport_staff: "Transport Staff",
    };
    
    const roleLabel = roleLabels[role] || "User";
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `Wise Student <${fromEmail}>`,
      to: [toEmail],
      subject: `Welcome to ${organizationName} - Your Account Details`,
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
                      <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome to ${organizationName}! 🎉</h2>
                      <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">You have been invited to join <strong>${organizationName}</strong> as a <strong>${roleLabel}</strong> on the Wise Student platform.</p>
                      
                      <!-- Credentials Box -->
                      <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; margin: 30px 0;">
                        <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 18px; font-weight: 600;">Your Login Credentials</h3>
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;"><strong>Email:</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: 'Courier New', monospace;">${toEmail}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Password:</strong></td>
                            <td style="padding: 8px 0;">
                              <code style="background-color: #ffffff; border: 1px solid #d1d5db; padding: 8px 12px; border-radius: 6px; color: #1f2937; font-size: 14px; font-weight: 600; font-family: 'Courier New', monospace; letter-spacing: 1px;">${tempPassword}</code>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Security Notice -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                          <strong>🔒 Security Reminder:</strong> Please change your password immediately after your first login for security purposes.
                        </p>
                      </div>
                      
                      <p style="margin: 30px 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">You can now log in to the platform and start using all the features available for your role.</p>
                      
                      <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">If you have any questions or need assistance, please don't hesitate to contact the administration.</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                        Need help? Contact us at 
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
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }

    console.log(`✅ Invitation email sent successfully to ${toEmail} via Resend`);
    return data;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

export const sendApprovalEmail = async (toEmail, name, role = "parent") => {
  try {
    const resend = getResendInstance();
    const roleLabels = {
      parent: "Parent",
      seller: "Seller",
      csr: "CSR"
    };
    
    const roleLabel = roleLabels[role] || "User";
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `Wise Student <${fromEmail}>`,
      to: [toEmail],
      subject: `${roleLabel} Account Approved`,
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
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Account Approved! 🎉</h1>
                      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Wise Student Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">Great news! Your <strong>${roleLabel}</strong> account has been approved by our admin team. You can now log in and start using the Wise Student platform with full access to your dashboard.</p>
                      
                      <!-- Next Steps Box -->
                      <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 30px; margin: 30px 0;">
                        <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 18px; font-weight: 600;">What's Next?</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                          <li style="margin-bottom: 10px;">Log in to your account using your registered email</li>
                          <li style="margin-bottom: 10px;">Complete your profile setup</li>
                          <li style="margin-bottom: 10px;">Explore the ${roleLabel.toLowerCase()} dashboard features</li>
                          ${role === "parent" ? "<li style=\"margin-bottom: 10px;\">Link with your child's account</li>" : ""}
                          ${role === "seller" ? "<li style=\"margin-bottom: 10px;\">Set up your product listings</li>" : ""}
                          ${role === "csr" ? "<li style=\"margin-bottom: 10px;\">Configure your organization settings</li>" : ""}
                        </ul>
                      </div>
                      
                      <p style="margin: 30px 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to reach out to our support team.</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                        Need help? Contact us at 
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
      throw new Error(`Failed to send approval email: ${error.message}`);
    }

    console.log(`✅ Approval email sent successfully to ${toEmail} via Resend`);
    return data;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};
