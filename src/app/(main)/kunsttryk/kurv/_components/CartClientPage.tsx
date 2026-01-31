'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Trash2, Truck } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CartClientPage() {
  const { items, removeItem, clearCart } = useCart();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleSendRequest = () => {
    const subject = "Forespørgsel på kunsttryk";
    const message = items.map(item =>
        `- ${item.name} (${item.selectedFrame}) - ${item.price.toLocaleString('da-DK')} DKK`
    ).join('\n');
    
    const fullMessage = `Jeg er interesseret i at købe følgende kunsttryk:\n\n${message}\n\nTotal pris (ekskl. fragt): ${total.toLocaleString('da-DK')} DKK\n\nVenligst kontakt mig for at aftale nærmere vedrørende betaling og levering.\n\n---\n`;

    const params = new URLSearchParams({
      subject,
      message: fullMessage,
      from_cart: "true", // Add a flag to indicate the origin
    });

    router.push(`/contact?${params.toString()}`);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Min Ønskeliste
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Gennemse din liste og send en samlet forespørgsel, når du er klar.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-card border shadow-sm">
          <p className="text-xl text-muted-foreground">Din ønskeliste er tom.</p>
          <Button asChild className="mt-6">
            <Link href="/kunsttryk">Udforsk kunsttryk</Link>
          </Button>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-6">
             <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-border">
                    {items.map((item) => {
                        const imageUrl = item.frameOptions?.find(f => f.description === item.selectedFrame)?.url || item.galleryImages?.[0]?.url || "https://picsum.photos/seed/placeholder/96/120";
                        return (
                        <li key={item.id + item.selectedFrame} className="flex py-6">
                            <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                <Image 
                                    src={imageUrl} 
                                    alt={item.name} 
                                    width={96}
                                    height={128}
                                    unoptimized={true}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-foreground">
                                        <h3>
                                            <Link href={`/kunsttryk/${item.id}`}>{item.name}</Link>
                                        </h3>
                                        <p className="ml-4">{item.price.toLocaleString('da-DK')} DKK</p>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{item.selectedFrame}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-muted-foreground">Antal: 1</p>
                                    <div className="flex">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="font-medium text-destructive hover:text-destructive"
                                            onClick={() => removeItem(item.id, item.selectedFrame)}
                                        >
                                           <Trash2 className="h-4 w-4 mr-1" /> Fjern
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )})}
                </ul>
             </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 border-t p-6">
                <div className="flex justify-between text-lg font-semibold text-foreground">
                    <p>Subtotal (ekskl. fragt)</p>
                    <p>{total.toLocaleString('da-DK')} DKK</p>
                </div>
                
                <Alert className="mt-2">
                  <Truck className="h-4 w-4" />
                  <AlertTitle>Information om Levering</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
                      <li><strong>Afhentning:</strong> Gratis i Slagelse efter aftale.</li>
                      <li><strong>Forsendelse (uden ramme):</strong> 50 DKK.</li>
                      <li><strong>Forsendelse (med ramme):</strong> 100 DKK.</li>
                    </ul>
                     <p className="mt-2 text-xs">Den endelige pris for fragt og betaling aftales via email efter din forespørgsel.</p>
                  </AlertDescription>
                </Alert>

                <div className="mt-4">
                    <Button onClick={handleSendRequest} className="w-full" size="lg">
                        Send forespørgsel
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                 <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                    <p>
                        eller{' '}
                        <Button variant="link" className="p-0 h-auto" asChild>
                             <Link href="/kunsttryk">fortsæt med at udforske</Link>
                        </Button>
                    </p>
                 </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
