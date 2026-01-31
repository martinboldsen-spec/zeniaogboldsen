'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareButton({ artworkName }: { artworkName: string }) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Se kunstværket: ${artworkName}`,
      text: `Jeg synes, du skal se dette kunstværk "${artworkName}" af Martin Boldsen.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Fejl ved deling:', error);
      }
    } else {
      // Fallback for desktop: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link kopieret!",
            description: "Linket til kunstværket er kopieret til din udklipsholder.",
        })
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error('Kunne ikke kopiere link:', error);
         toast({
            title: "Fejl",
            description: "Kunne ikke kopiere linket til udklipsholderen.",
            variant: "destructive"
        })
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      aria-label="Del kunstværk"
      className="flex-shrink-0"
    >
      {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
    </Button>
  );
}
