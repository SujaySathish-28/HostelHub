# Forgot Password Implementation - HostelHub

This document describes the implementation of the forgot password feature for student accounts using NodeMailer.

## Features

- **Email-based password reset**: Students can request a password reset by entering their registered email
- **Secure token generation**: Password reset tokens are generated using crypto and stored in the database
- **Token expiration**: Reset tokens expire after 1 hour for security
- **Email notifications**: Automated emails are sent for password reset requests and confirmations
- **Password hashing**: Passwords are hashed using bcryptjs before storage
- **Frontend UI**: User-friendly interface for forgot password flow

## Backend Setup

### 1. Install Dependencies

The following packages have been added to `package.json`:

```bash
npm install
```

**New dependencies:**
- `nodemailer` - Email sending library
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token management (for future use)
- `dotenv` - Environment variable management

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Email Configuration (NodeMailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for password reset link)
FRONTEND_URL=http://localhost:5173

# JWT Secret (optional, for future use)
JWT_SECRET=your-secret-key-here
```

#### Gmail Setup Instructions:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated 16-character password
   - Use this password in `EMAIL_PASSWORD` in `.env`

### 3. Database Changes

The `User` schema has been updated with two new fields:

```javascript
resetPasswordToken: {
    type: String,
    default: null,
},
resetPasswordExpires: {
    type: Date,
    default: null,
}
```

These fields store the password reset token and its expiration time.

### 4. New API Endpoints

#### Forgot Password Request
- **URL**: `/student/forgot-password`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "student@example.com"
}
```
- **Response**:
```json
{
    "message": "If email exists, a password reset link will be sent",
    "email": "student@example.com"
}
```

#### Reset Password
- **URL**: `/student/reset-password`
- **Method**: `POST`
- **Body**:
```json
{
    "token": "reset-token-from-email",
    "email": "student@example.com",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```
- **Response**:
```json
{
    "message": "Password reset successfully. You can now login with your new password"
}
```

#### Verify Reset Token
- **URL**: `/student/verify-reset-token`
- **Method**: `GET`
- **Query Parameters**:
  - `token`: Reset token
  - `email`: User email
- **Response**:
```json
{
    "valid": true,
    "message": "Token is valid",
    "userName": "username"
}
```

### 5. File Structure

**Backend files added/modified:**

```
backend/
├── utils/
│   └── emailService.js          (NEW - Email sending utility)
├── controllers/
│   └── studentControllers.js    (MODIFIED - Added password functions)
├── routes/
│   └── studentRouter.js         (MODIFIED - Added password routes)
├── model/
│   └── userSchema.js            (MODIFIED - Added reset fields)
├── app.js                       (MODIFIED - Added dotenv, updated auth)
├── package.json                 (MODIFIED - Added dependencies)
├── .env                         (NEW - Environment variables)
└── .env.example                 (NEW - Example env file)
```

## Frontend Setup

### 1. New Components

#### ForgotPassword Component
- **File**: `src/components/ForgotPassword.jsx`
- **File**: `src/components/ForgotPassword.css`
- **Features**:
  - Two-step flow: Email entry and password reset
  - Automatic token verification from URL parameters
  - Real-time form validation
  - User feedback via success/error messages
  - Loading states during API calls

### 2. Routing

Added new routes in `main.jsx`:

```javascript
{path:'/forgot-password',element:<ForgotPassword/>},
{path:'/reset-password',element:<ForgotPassword/>},
```

### 3. Updated Components

- **SignIn.jsx**: Updated forgot password link to navigate to `/forgot-password`

## Usage Flow

### Student Initiates Password Reset

1. Student visits the application and clicks "Sign In"
2. Clicks "Forgot Password?" link
3. Enters their registered email address
4. Receives a confirmation message
5. Checks their email for the reset link

### Student Resets Password

1. Student clicks the reset link in the email
2. Frontend parses the token and email from URL
3. Verifies the token validity with the backend
4. Student enters a new password
5. Password is updated and stored securely
6. Student receives a confirmation email
7. Can now login with the new password

### Security Features

1. **Token Expiration**: Tokens expire after 1 hour
2. **Token Hashing**: Tokens are hashed before storage in database
3. **Password Hashing**: New passwords are hashed using bcryptjs
4. **Email Verification**: Only valid emails receive reset links
5. **HTTPS Recommended**: Use HTTPS in production
6. **HTTPOnly Cookies**: Session management uses secure cookies

## Testing

### Test the Forgot Password Flow

1. **Backend Testing** (Using Postman or cURL):
   ```bash
   # Request password reset
   curl -X POST http://localhost:3001/student/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"student@example.com"}'
   ```

2. **Frontend Testing**:
   - Navigate to `http://localhost:5173/forgot-password`
   - Enter a registered student email
   - Check the email inbox for the reset link
   - Click the reset link (it will redirect to the component)
   - Enter new password and confirm
   - Try logging in with the new password

### Gmail Testing

If using Gmail in development:
1. Make sure you've generated an App Password
2. Check the `.env` file has the correct credentials
3. Emails may appear in Gmail's "All Mail" if they bypass spam filters

## Troubleshooting

### Emails Not Sending

1. **Check `.env` file**: Ensure EMAIL_USER and EMAIL_PASSWORD are correct
2. **Gmail App Password**: If using Gmail, ensure you've generated an App Password (not your regular password)
3. **Enable Less Secure Apps**: For older Gmail accounts, may need to enable "Less secure app access"
4. **Check Logs**: Look at backend console for error messages

### Reset Token Errors

1. **Token Expired**: Tokens are valid for 1 hour only. Request a new reset link
2. **Invalid Token**: Ensure the full URL including token is being used
3. **Token Mismatch**: The token is hashed before storage, ensure no modifications

### Frontend Issues

1. **Component Not Loading**: Ensure ForgotPassword.jsx is properly imported in main.jsx
2. **Styling Issues**: Check ForgotPassword.css is in the same directory as the component
3. **Navigation Issues**: Ensure React Router is properly configured

## Future Enhancements

1. **Social Login**: Add OAuth integration (Google, GitHub)
2. **Two-Factor Authentication**: Add 2FA option
3. **Password Strength Indicator**: Add real-time password strength feedback
4. **Rate Limiting**: Limit forgot password requests to prevent spam
5. **Admin Panel**: Allow admins to reset student passwords
6. **SMS Notification**: Add SMS as additional notification method
7. **Resend Email**: Allow students to resend reset email if not received

## Production Considerations

1. **Use Environment Variables**: Never commit `.env` file with real credentials
2. **HTTPS Only**: Always use HTTPS in production
3. **Secure Email Service**: Consider using SendGrid, AWS SES, or other production email services
4. **Rate Limiting**: Implement rate limiting on password reset endpoints
5. **Monitoring**: Set up error logging and monitoring for email failures
6. **Database Backups**: Ensure regular backups of user data
7. **Token Rotation**: Consider implementing token rotation for additional security

## References

- [Nodemailer Documentation](https://nodemailer.com/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [OWASP Password Reset Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
