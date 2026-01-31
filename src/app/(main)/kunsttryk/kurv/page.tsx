import { Metadata } from 'next';
import { CartClientPage } from './_components/CartClientPage';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Ønskeliste / Kurv',
    description: 'Se din ønskeliste af kunsttryk og send en forespørgsel.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="text-center p-12">Indlæser kurv...</div>}>
      <CartClientPage />
    </Suspense>
  );
}
