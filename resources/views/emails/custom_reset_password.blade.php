<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px; color: #374151; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #5a4bda; padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; }
        .content p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 14px 28px; background-color: #5a4bda; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .alert { background-color: #FEF2F2; color: #991B1B; padding: 15px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; border-left: 4px solid #DC2626;}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Karir Sebaya</h1>
        </div>
        <div class="content">
            <p>Halo, <strong>{{ $user->name }}</strong>!</p>
            <p>Kami menerima permintaan untuk mengatur ulang password akun Anda di <strong>Karir Sebaya</strong>. Silakan klik tombol di bawah ini untuk membuat password baru:</p>
            
            <div class="btn-wrapper">
                <a href="{{ $url }}" class="btn">Reset Password Saya</a>
            </div>
            
            <div class="alert">
                Jika Anda tidak merasa melakukan permintaan reset password, abaikan saja email ini. Akun Anda akan tetap aman.
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Tautan ini akan kedaluwarsa dalam 60 menit.<br>
                Jika Anda mengalami masalah saat mengklik tombol di atas, Anda bisa menyalin dan menempelkan tautan berikut ke browser Anda:<br>
                <a href="{{ $url }}" style="color: #5a4bda; word-break: break-all;">{{ $url }}</a>
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Karir Sebaya. Semua hak cipta dilindungi.
        </div>
    </div>
</body>
</html>
