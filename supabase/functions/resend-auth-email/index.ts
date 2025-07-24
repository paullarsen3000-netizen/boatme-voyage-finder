import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendEmailRequest {
  email: string;
  emailType: 'signup' | 'recovery' | 'email_change' | 'magiclink';
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Resend auth email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, emailType = 'signup' }: ResendEmailRequest = await req.json();
    console.log("Resending email to:", email, "Type:", emailType);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate a new confirmation token/link for the user
    let subject = "";
    let htmlContent = "";
    let confirmUrl = "";

    // For signup confirmation, we need to generate a new confirmation link
    if (emailType === 'signup') {
      // For manual resend, we'll use the auth API to trigger a new confirmation
      const { error: resendError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: email,
        options: {
          redirectTo: `https://tcoqqqpbuzwtsjbwlnyz.supabase.co/`
        }
      });

      if (resendError) {
        console.error('Error generating confirmation link:', resendError);
        return new Response(
          JSON.stringify({ error: 'Failed to generate confirmation link', details: resendError.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      subject = "Confirm your BoatMe account";
      confirmUrl = `https://tcoqqqpbuzwtsjbwlnyz.supabase.co/auth/v1/verify?type=signup&redirect_to=${encodeURIComponent('https://tcoqqqpbuzwtsjbwlnyz.supabase.co/')}`;
      
      htmlContent = `
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

    console.log("Sending email to:", email);
    
    const emailResponse = await resend.emails.send({
      from: "BoatMe <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email attempt in the email_logs table
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        email_address: email,
        template_type: `manual_resend_${emailType}`,
        status: 'sent',
        user_id: null // We don't have the user_id in this context
      });

    if (logError) {
      console.error('Error logging email:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      id: emailResponse.id,
      email: email,
      type: emailType,
      message: `${emailType} confirmation email resent successfully`
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in resend-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);