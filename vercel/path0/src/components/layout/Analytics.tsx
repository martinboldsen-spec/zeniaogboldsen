'use client'

import Script from 'next/script'
import { getPageContent } from '@/lib/page-content-service';
import { useEffect, useState } from 'react';

type SeoContent = Awaited<ReturnType<typeof getPageContent>>['content']['seo'];

// Analytics component to handle all tracking scripts
export function Analytics() {
    const [seo, setSeo] = useState<SeoContent | null>(null);

    useEffect(() => {
        getPageContent().then(({ content }) => {
            if (content?.seo) {
                setSeo(content.seo);
            }
        });
    }, []);

    const GA_MEASUREMENT_ID = seo?.googleAnalyticsId;
    const HEADER_SCRIPT = seo?.headerScript;
    
    return (
        <>
            {/* Google Analytics */}
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
                            gtag('config', '${GA_MEASUREMENT_ID}', {
                                page_path: window.location.pathname,
                            });
                        `,
                        }}
                    />
                </>
            )}

            {/* Other header scripts */}
            {HEADER_SCRIPT && (
                <Script
                    id="header-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: HEADER_SCRIPT }}
                />
            )}
        </>
    )
}
