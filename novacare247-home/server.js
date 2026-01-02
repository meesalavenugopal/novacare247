import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter with Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    console.log('Received contact form submission:', { name, email, subject });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: `"NovaCare247 Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'care@novacare247.com',
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00749c;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <hr style="border: 1px solid #ddd; margin: 15px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This email was sent from the NovaCare247 contact form.</p>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"NovaCare247" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting NovaCare247',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00749c 0%, #005a7a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">NovaCare™</h1>
            <p style="color: #e0f2f7; margin: 5px 0;">Your Health, Our Priority</p>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #00749c;">Thank You for Reaching Out!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and appreciate you contacting NovaCare247. Our team will review your inquiry and get back to you as soon as possible.</p>
            <div style="background-color: white; padding: 20px; border-left: 4px solid #00749c; margin: 20px 0;">
              <p style="margin: 0; color: #666;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p>If you have any urgent concerns, please don't hesitate to call us at <strong>+91 40 1234 5678</strong>.</p>
            <p>Best regards,<br><strong>NovaCare247 Team</strong></p>
          </div>
          <div style="padding: 20px; text-align: center; background-color: #00749c; color: white; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px;">NovaCare247 Healthcare Services</p>
            <p style="margin: 5px 0; font-size: 12px;">Available 24/7 for Your Healthcare Needs</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    console.log('Admin notification email sent successfully');
    
    await transporter.sendMail(userMailOptions);
    console.log('User confirmation email sent successfully');

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaCare247 Contact API is running' });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing email with credentials:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      adminEmail: process.env.ADMIN_EMAIL
    });

    const testMail = await transporter.sendMail({
      from: `"NovaCare247 Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from NovaCare247',
      text: 'If you receive this, your SMTP configuration is working correctly!',
      html: '<p>If you receive this, your SMTP configuration is working correctly!</p>'
    });

    console.log('Test email sent successfully:', testMail.messageId);
    res.json({ success: true, message: 'Test email sent!', messageId: testMail.messageId });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message, details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Contact form server running on port ${PORT}`);
});
