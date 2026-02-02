import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { logout } from '@/lib/actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getIronSession(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="bg-secondary/50 min-h-screen">
      <div className="container max-w-4xl mx-auto py-10">
        <form action={logout} className="text-right mb-4">
            <Button type="submit" variant="ghost">Log ud</Button>
        </form>
        {children}
      </div>
    </div>
  );
}
