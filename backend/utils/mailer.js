import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendInvitationEmail = async (toEmail, name, organizationName, role, tempPassword) => {
  const roleLabels = {
    school_admin: "School Administrator",
    school_teacher: "Teacher",
    school_student: "Student",
    school_parent: "Parent",
    school_accountant: "Accountant",
    school_librarian: "Librarian",
    school_transport_staff: "Transport Staff",
    college_admin: "College Administrator",
    college_hod: "Head of Department",
    college_faculty: "Faculty",
    college_student: "Student",
    college_parent: "Parent",
    college_placement_officer: "Placement Officer",
    college_alumni: "Alumni",
    college_accountant: "Accountant",
    college_librarian: "Librarian",
    college_hostel_staff: "Hostel Staff",
  };
  
  const roleLabel = roleLabels[role] || "User";
  
  await transporter.sendMail({
    from: `"FINMEN Team" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to ${organizationName} - Your Account Details`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to ${organizationName}! 🎉</h2>
        <p>Hi ${name},</p>
        <p>You have been invited to join <strong>${organizationName}</strong> as a <strong>${roleLabel}</strong>.</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your Login Credentials:</h3>
          <p><strong>Email:</strong> ${toEmail}</p>
          <p><strong>Temporary Password:</strong> <code style="background-color: #E5E7EB; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
        </div>
        
        <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400E;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>
        
        <p>You can now log in to the platform and start using all the features available for your role.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact the administration.</p>
        
        <p>Welcome aboard!</p>
        <p>– The FINMEN Team</p>
      </div>
    `,
  });
};

export const sendApprovalEmail = async (toEmail, name, role = "educator") => {
  const roleLabels = {
    educator: "Educator",
    parent: "Parent",
    seller: "Seller",
    csr: "CSR"
  };
  
  const roleLabel = roleLabels[role] || "User";
  
  await transporter.sendMail({
    from: `"FINMEN Team" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: `${roleLabel} Account Approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Account Approved! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Great news! Your ${roleLabel.toLowerCase()} account has been approved by our admin team.</p>
        <p>You can now log in and start using the FINMEN platform with full access to your ${roleLabel.toLowerCase()} dashboard.</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">What's next?</h3>
          <ul style="color: #6B7280;">
            <li>Log in to your account using your registered email</li>
            <li>Complete your profile setup</li>
            <li>Explore the ${roleLabel.toLowerCase()} dashboard features</li>
            ${role === "parent" ? "<li>Link with your child's account</li>" : ""}
            ${role === "seller" ? "<li>Set up your product listings</li>" : ""}
            ${role === "csr" ? "<li>Configure your organization settings</li>" : ""}
            ${role === "educator" ? "<li>Create your first class or assignment</li>" : ""}
          </ul>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Welcome to FINMEN!</p>
        <p>– The FINMEN Team</p>
      </div>
    `,
  });
};
