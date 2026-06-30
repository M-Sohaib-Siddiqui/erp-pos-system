import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_verification_email(to_email: str, full_name: str, token: str):
    verify_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    resend.Emails.send({
        "from": settings.EMAIL_FROM,
        "to": to_email,
        "subject": "Verify your email — ERP-POS System",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                <h2>Welcome, {full_name} 👋</h2>
                <p>Thanks for signing up. Please verify your email to activate your account.</p>
                <a href="{verify_link}"
                   style="display:inline-block; padding:12px 24px; background:#2563eb;
                          color:#fff; text-decoration:none; border-radius:6px; margin-top:12px;">
                    Verify Email
                </a>
                <p style="margin-top:24px; font-size:13px; color:#666;">
                    If you didn't create this account, you can ignore this email.
                </p>
            </div>
        """
    })


def send_password_reset_email(to_email: str, full_name: str, token: str):
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    resend.Emails.send({
        "from": settings.EMAIL_FROM,
        "to": to_email,
        "subject": "Reset your password — ERP-POS System",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                <h2>Password Reset Request</h2>
                <p>Hi {full_name}, we received a request to reset your password.</p>
                <a href="{reset_link}"
                   style="display:inline-block; padding:12px 24px; background:#dc2626;
                          color:#fff; text-decoration:none; border-radius:6px; margin-top:12px;">
                    Reset Password
                </a>
                <p style="margin-top:24px; font-size:13px; color:#666;">
                    This link expires in 30 minutes. If you didn't request this, ignore this email.
                </p>
            </div>
        """
    })