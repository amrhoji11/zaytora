import Script from "next/script";
import { API_BASE_URL } from "@/lib/api/config";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Meta's standard base code (Events Manager > Data Sources > pixel > Set up
// > Install code manually), adapted to next/script instead of a raw
// <script> tag so Next defers it appropriately. Silently renders nothing
// when NEXT_PUBLIC_META_PIXEL_ID isn't set, matching every other
// optionally-configured integration in this app (Google sign-in, Resend
// email) -- local dev and any environment without a real pixel ID just
// don't get one, instead of shipping a broken fbq() call.
export function MetaPixel() {
  if (!PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');

          // Tags this PageView with an id the server-side beacon below
          // reuses verbatim, so Meta dedupes the pair into one event
          // instead of double-counting a visit whose Pixel did fire --
          // see MetaController.PageView/SendPageViewAsync. Falls back to a
          // timestamp+random string on the handful of browsers without
          // crypto.randomUUID (older Safari/Firefox) since this only needs
          // to be unique, not cryptographically random.
          var __pvId = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : Date.now() + '-' + Math.random().toString(16).slice(2);
          fbq('track', 'PageView', {}, { eventID: __pvId });

          // Delayed so fbevents.js (loaded async above) has had a chance to
          // set its own _fbc/_fbp cookies first -- reading them immediately
          // here would almost always see last page's values or nothing, since
          // this inline snippet runs before that script has finished loading.
          setTimeout(function () {
            try {
              var fbcMatch = document.cookie.match(/(?:^|; )_fbc=([^;]*)/);
              var fbpMatch = document.cookie.match(/(?:^|; )_fbp=([^;]*)/);
              var payload = JSON.stringify({
                eventId: __pvId,
                url: location.href,
                fbc: fbcMatch ? decodeURIComponent(fbcMatch[1]) : undefined,
                fbp: fbpMatch ? decodeURIComponent(fbpMatch[1]) : undefined,
              });
              var endpoint = '${API_BASE_URL}/meta/pageview';
              if (navigator.sendBeacon) {
                navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
              } else {
                fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
              }
            } catch (e) {}
          }, 500);
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
