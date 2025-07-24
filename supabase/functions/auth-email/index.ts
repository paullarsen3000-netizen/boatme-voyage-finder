import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  user: {
    email: string;
    id: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Auth email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AuthEmailRequest = await req.json();
    console.log("Request data:", JSON.stringify(requestData, null, 2));

    const { user, email_data } = requestData;
    const { email } = user;
    const { token_hash, email_action_type, redirect_to, site_url } = email_data;

    let subject = "";
    let htmlContent = "";

    // Determine email type and content
    switch (email_action_type) {
      case "signup":
        subject = "Confirm your BoatMe account";
        htmlContent = generateSignupEmail(token_hash, redirect_to, site_url);
        break;
      case "recovery":
        subject = "Reset your BoatMe password";
        htmlContent = generatePasswordResetEmail(token_hash, redirect_to, site_url);
        break;
      case "email_change":
        subject = "Confirm your new email address";
        htmlContent = generateEmailChangeEmail(token_hash, redirect_to, site_url);
        break;
      case "magiclink":
        subject = "Your BoatMe magic link";
        htmlContent = generateMagicLinkEmail(token_hash, redirect_to, site_url);
        break;
      default:
        subject = "BoatMe Account Verification";
        htmlContent = generateDefaultEmail(token_hash, redirect_to, site_url);
    }

    console.log("Sending email to:", email);
    
    const emailResponse = await resend.emails.send({
      from: "BoatMe <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateSignupEmail(tokenHash: string, redirectTo: string, siteUrl: string): string {
  const confirmUrl = `${siteUrl}/auth/v1/verify?token=${tokenHash}&type=signup&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm your BoatMe account</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0066cc; margin: 0;">🚤 BoatMe</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Your ticket to the water starts here</p>
      </div>
      
      <h2 style="color: #333;">Welcome to BoatMe!</h2>
      
      <p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Confirm Email Address
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${confirmUrl}" style="color: #0066cc; word-break: break-all;">${confirmUrl}</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This email was sent to you because you signed up for BoatMe.<br>
        If you didn't request this, you can safely ignore this email.
      </p>
    </body>
    </html>
  `;
}

function generatePasswordResetEmail(tokenHash: string, redirectTo: string, siteUrl: string): string {
  const resetUrl = `${siteUrl}/auth/v1/verify?token=${tokenHash}&type=recovery&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your BoatMe password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0066cc; margin: 0;">🚤 BoatMe</h1>
      </div>
      
      <h2 style="color: #333;">Reset Your Password</h2>
      
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${resetUrl}" style="color: #0066cc; word-break: break-all;">${resetUrl}</a>
      </p>
      
      <p style="color: #e74c3c; font-size: 14px;">
        <strong>Security Note:</strong> This link will expire in 1 hour for your security.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you didn't request a password reset, you can safely ignore this email.<br>
        Your password will remain unchanged.
      </p>
    </body>
    </html>
  `;
}

function generateEmailChangeEmail(tokenHash: string, redirectTo: string, siteUrl: string): string {
  const confirmUrl = `${siteUrl}/auth/v1/verify?token=${tokenHash}&type=email_change&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm your new email address</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0066cc; margin: 0;">🚤 BoatMe</h1>
      </div>
      
      <h2 style="color: #333;">Confirm Email Change</h2>
      
      <p>Please confirm your new email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Confirm New Email
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${confirmUrl}" style="color: #0066cc; word-break: break-all;">${confirmUrl}</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you didn't request this email change, please contact support immediately.
      </p>
    </body>
    </html>
  `;
}

function generateMagicLinkEmail(tokenHash: string, redirectTo: string, siteUrl: string): string {
  const magicUrl = `${siteUrl}/auth/v1/verify?token=${tokenHash}&type=magiclink&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your BoatMe magic link</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0066cc; margin: 0;">🚤 BoatMe</h1>
      </div>
      
      <h2 style="color: #333;">Your Magic Link</h2>
      
      <p>Click the button below to sign in to your BoatMe account:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${magicUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Sign In to BoatMe
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${magicUrl}" style="color: #0066cc; word-break: break-all;">${magicUrl}</a>
      </p>
      
      <p style="color: #e74c3c; font-size: 14px;">
        <strong>Security Note:</strong> This link will expire in 1 hour for your security.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you didn't request this login link, you can safely ignore this email.
      </p>
    </body>
    </html>
  `;
}

function generateDefaultEmail(tokenHash: string, redirectTo: string, siteUrl: string): string {
  const verifyUrl = `${siteUrl}/auth/v1/verify?token=${tokenHash}&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BoatMe Account Verification</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0066cc; margin: 0;">🚤 BoatMe</h1>
      </div>
      
      <h2 style="color: #333;">Account Verification</h2>
      
      <p>Please verify your account by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Verify Account
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verifyUrl}" style="color: #0066cc; word-break: break-all;">${verifyUrl}</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This email was sent from BoatMe. If you didn't expect this email, you can safely ignore it.
      </p>
    </body>
    </html>
  `;
}

serve(handler);