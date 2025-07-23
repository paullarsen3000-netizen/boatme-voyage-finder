import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="font-brand text-2xl font-bold text-primary">
              BoatMe
            </div>
          </Link>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}