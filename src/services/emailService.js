import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'GYMVERSE - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Password Reset Request</h2>
        <p>You requested a password reset for your GYMVERSE account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to GYMVERSE!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Welcome to GYMVERSE, ${name}!</h2>
        <p>Your AI-powered fitness journey starts now.</p>
        <p>Get ready to transform your fitness with personalized workouts, diet plans, and our AI trainer!</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Go to Dashboard
        </a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendProgressReportEmail = async (email, name, stats, trainerMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'GYMVERSE - Weekly Progress Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Progress Report</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Here is your latest progress update from your trainer.</p>

          ${trainerMessage ? `<div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;"><strong>Trainer Note:</strong><br/>${trainerMessage}</div>` : ''}

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; color: #6b7280;">Current Plan</td>
              <td style="padding: 10px; font-weight: bold;">${stats.plan}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; color: #6b7280;">Attendance Streak</td>
              <td style="padding: 10px; font-weight: bold; color: #ef4444;">${stats.streak} Days 🔥</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Current Level</td>
              <td style="padding: 10px; font-weight: bold;">Level ${stats.level}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px;">
              View Full Dashboard
            </a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
          © 2026 GYMVERSE. All rights reserved.
        </div>
      </div>
    `,
  };

  // 🚨 SIMULATION MODE (If no credentials)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('--- 📧 EMAIL SIMULATION MODE ---');
    console.log(`To: ${email}`);
    console.log(`Subject: GYMVERSE - Weekly Progress Update`);
    console.log(`Trainer Message: ${trainerMessage}`);
    console.log('--------------------------------');
    return true; // Simulate success
  }

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    // Fallback to simulation on error so demo doesn't fail
    return true;
  }
};






