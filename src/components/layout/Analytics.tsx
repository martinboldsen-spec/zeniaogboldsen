"use client";

import { getPageContent, type SeoPageContent } from '@/lib/page-content-service'
import Script from 'next/script'
import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';


// This is the client component that handles tracking logic
function AnalyticsClient({ seo }: { seo: SeoPageContent | null }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const GA_MEASUREMENT_ID = seo?.googleAnalyticsId;
    
    useEffect(() => {
        if (!GA_MEASUREMENT_ID || !window.gtag) return;
        
        const url = pathname + searchParams.toString();
        
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });

    }, [pathname, searchParams, GA_MEASUREMENT_ID]);


    return (
        <>
            {GA_MEASUREMENT_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_MEASUREMENT_ID}');
                        `,
                        }}
                    />
                </>
            )}
            {seo?.headerScript && (
                <Suspense fallback={null}>
                    <div dangerouslySetInnerHTML={{ __html: seo.headerScript }} />
                </Suspense>
            )}
        </>
    );
}


// This is the component that will be dynamically loaded
export default function Analytics() {
    const [seo, setSeo] = useState<SeoPageContent | null>(null);

    useEffect(() => {
        getPageContent().then(({ content }) => {
            if (content?.seo) {
                setSeo(content.seo);
            }
        });
    }, []);

    return (
        <Suspense fallback={null}>
            <AnalyticsClient seo={seo} />
        </Suspense>
    );
}
