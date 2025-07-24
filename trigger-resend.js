// Temporary script to trigger the resend function
const response = await fetch('https://tcoqqqpbuzwtsjbwlnyz.supabase.co/functions/v1/resend-auth-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjb3FxcXBidXp3dHNqYndsbnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjg5MDksImV4cCI6MjA2ODg0NDkwOX0.bGx7WFNtV6iA0ep4iNwq_vqUIub0YO38RYRFsB0npWE'
  },
  body: JSON.stringify({
    email: 'paul@unitedagri.co.za',
    emailType: 'signup'
  })
});

const result = await response.json();
console.log('Resend result:', result);