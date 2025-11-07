<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .code { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
        .muted { color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset</h2>
        <p>Use the verification code below to reset your password:</p>
        <p class="code">{{ $code }}</p>
        <p class="muted">This code will expire at {{ \Carbon\Carbon::parse($expiresAt)->format('Y-m-d H:i') }}.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>— A.C.E Birthing Home EMR System</p>
    </div>
</body>
</html>
