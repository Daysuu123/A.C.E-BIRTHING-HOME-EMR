<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - A.C.E Birthing Home</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #007bff; text-align: center; margin-bottom: 30px;">A.C.E Birthing Home</h1>
        
        <h2 style="color: #28a745; text-align: center;">Email Verification</h2>
        
        <p>Hello <strong>{{ $patient->first_name }} {{ $patient->last_name }}</strong>,</p>
        
        <p>Thank you for registering with A.C.E Birthing Home! To complete your registration and ensure the security of your account, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/api/patients/verify-email/' . $verificationToken) }}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
            </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <code style="background-color: #e9ecef; padding: 2px 4px; border-radius: 3px;">
                {{ url('/api/patients/verify-email/' . $verificationToken) }}
            </code>
        </p>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #856404;">Important Security Information:</p>
            <p style="margin: 5px 0 0 0; color: #856404;">This verification link will expire in 24 hours for your security.</p>
        </div>
        
        <p>If you didn't create this account, please ignore this email or contact us immediately.</p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d; text-align: center;">
            A.C.E Birthing Home | Your trusted partner in maternal care
        </p>
    </div>
</body>
</html>