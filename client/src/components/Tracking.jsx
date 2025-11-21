import React from 'react';
import { Helmet } from 'react-helmet-async';

const Tracking = () => {
    // Replace these with actual Pixel IDs from the user or env vars
    const TIKTOK_PIXEL_ID = 'D4GDR8BC77UA1JCPQDPG';
    const FACEBOOK_PIXEL_ID = 'YOUR_FACEBOOK_PIXEL_ID';

    return (
        <Helmet>
            {/* TikTok Pixel */}
            {TIKTOK_PIXEL_ID && (
                <script>
                    {`
                        !function (w, d, t) {
                            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t.align=d,ttq.chars=t,ttq.methods.forEach(function(t){t[e]=ttq.setAndDefer.bind(ttq,t,e)})},ttq.instance=function(t){var e=ttq._i[t]||[];return e.forEach(function(t){var e=ttq.setAndDefer(t,"instance");ttq.methods.forEach(function(t){e[t]=ttq.setAndDefer.bind(ttq,e,t)})}),e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                            ttq.load('${TIKTOK_PIXEL_ID}');
                            ttq.page();
                        }(window, document, 'ttq');
                    `}
                </script>
            )}

            {/* Facebook Pixel */}
            {FACEBOOK_PIXEL_ID && (
                <script>
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${FACEBOOK_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `}
                </script>
            )}
            {FACEBOOK_PIXEL_ID && (
                <noscript>
                    {`<img height="1" width="1" style="display:none"
                    src="https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1"
                    />`}
                </noscript>
            )}
        </Helmet>
    );
};

export default Tracking;
