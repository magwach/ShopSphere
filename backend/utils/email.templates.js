export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 3 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Shop Sphere</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Shop Sphere</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Shop Sphere</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Hello {name} we're excited to have you join our community! 🎉</p>
    <p>At <strong>Shop Sphere</strong>, you'll find amazing products, exclusive deals, and a seamless shopping experience.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{loginUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
    </div>
    <p>If you ever need assistance, our support team is always here to help you out.</p>
    <p>Welcome aboard!<br>– The Shop Sphere Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0fdf4; color: #1a1a1a; margin: 0; padding: 0;">
  <div style="background: linear-gradient(to right, #10b981, #059669); padding: 30px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Password Reset Successful</h1>
  </div>

  <div style="background-color: #ffffff; margin: 20px auto; padding: 30px; max-width: 600px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <p style="font-size: 16px;">Hello <strong>{name}</strong>,</p>
    <p style="font-size: 16px;">We’re letting you know that your password has been successfully updated.</p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #10b981; color: white; width: 60px; height: 60px; border-radius: 50%; line-height: 60px; font-size: 30px; display: inline-block;">
        ✓
      </div>
    </div>

    <p style="font-size: 16px;">If you didn’t request this change, please contact our support team immediately.</p>

    <p style="font-size: 16px;">To keep your account secure, we recommend that you:</p>
    <ul style="font-size: 16px; padding-left: 20px;">
      <li>Use a strong and unique password</li>
      <li>Avoid reusing passwords across websites</li>
    </ul>

    <p style="font-size: 16px;">Thank you for taking steps to protect your account.</p>
    <p style="font-size: 16px;">Best regards,<br><strong>Your App Team</strong></p>
  </div>

  <div style="text-align: center; font-size: 12px; color: #888888; margin-top: 20px; padding: 10px;">
    <p>This is an automated message. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reset Your Password</h1>
  </div>

  <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi <strong>{name}</strong>,</p>

    <p>We received a request to reset the password for your Shop Sphere account. If you didn’t make this request, you can safely ignore this email.</p>

    <p style="margin-top: 24px;">To reset your password, please enter the verification code below in the app:</p>

    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4CAF50;">{resetCode}</p>
    </div>

    <p>This code will expire in <strong>3 minutes</strong> for security purposes.</p>

    <p>If you continue to experience issues, feel free to contact our support team.</p>

    <p style="margin-top: 30px;">Warm regards,<br /><strong>Shop Sphere Team</strong></p>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message — please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;

export const OTP_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>2FA Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Two-Factor Authentication</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello <strong>{name}</strong>,</p>
    <p>We detected a login attempt that requires additional verification. Use the code below to complete your sign-in process:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{otpCode}</span>
    </div>
    <p>This one-time code is valid for <strong>3 minutes</strong>. Please do not share this code with anyone.</p>
    <p>If this wasn't you, we recommend changing your password immediately to secure your account.</p>
    <p>Best regards,<br>Shop Sphere</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
