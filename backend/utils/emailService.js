const nodemailer = require('nodemailer');

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send forgot password email
const sendForgotPasswordEmail = async (email, resetLink, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - HostelHub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">HostelHub</h1>
                </div>
                <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Hello <strong>${userName}</strong>,
                    </p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. If you didn't make this request, you can ignore this email.
                    </p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        To reset your password, click the button below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link in your browser:
                    </p>
                    <p style="color: #0369a1; word-break: break-all; font-size: 12px;">
                        ${resetLink}
                    </p>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                        This link will expire in 1 hour for security purposes.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
                        If you have any questions, please contact the hostel administration.
                    </p>
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">
                        Best regards,<br/>
                        HostelHub Team
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
};

// Function to send password reset confirmation email
const sendPasswordResetConfirmation = async (email, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Changed Successfully - HostelHub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">HostelHub</h1>
                </div>
                <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Password Changed Successfully</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Hello <strong>${userName}</strong>,
                    </p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <div style="background-color: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <p style="color: #047857; margin: 0; font-weight: bold;">✓ Password Update Confirmed</p>
                    </div>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                        If you did not make this change or suspect unauthorized access, please contact the hostel administration immediately.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
                        Best regards,<br/>
                        HostelHub Team
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', info.response);
        return { success: true, message: 'Confirmation email sent' };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw new Error('Failed to send confirmation email: ' + error.message);
    }
};

module.exports = {
    sendForgotPasswordEmail,
    sendPasswordResetConfirmation,
};
