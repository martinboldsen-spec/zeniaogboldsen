// Inspired by https://nextjs.org/learn/dashboard-app/adding-authentication
import { LoginForm } from './_components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-secondary/50">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end bg-primary p-3">
          <div className="text-white text-2xl font-headline">
            Zenia & Boldsen - Admin
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
