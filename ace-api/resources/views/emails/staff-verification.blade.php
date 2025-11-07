<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            background-color: #e9ecef;
            border-radius: 5px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Email Verification</h1>
    </div>
    
    <div class="content">
        <h2>Hello {{ $staff->staffs_firs }} {{ $staff->staffs_sur }}!</h2>
        
        <p>Thank you for registering with A.C.E Birthing Home EMR System. To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
            <a href="{{ url('/api/staffs/verify-email/' . $verificationToken) }}" class="button">Verify Email Address</a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">{{ url('/api/staffs/verify-email/' . $verificationToken) }}</p>
        
        <p>This verification link will expire in 24 hours for security reasons.</p>
        
        <p>If you didn't create this account, please ignore this email.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message from A.C.E Birthing Home EMR System. Please do not reply to this email.</p>
    </div>
</body>
</html>