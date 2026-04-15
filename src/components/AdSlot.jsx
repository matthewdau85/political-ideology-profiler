import React, { useEffect, useRef } from 'react';
import { isAdEnabled, getAdConfig } from '../utils/adConfig';

export default function AdSlot({ placement = 'results_footer' }) {
  const containerRef = useRef(null);

  const adInfo = getAdConfig(placement);

  useEffect(() => {
    if (!isAdEnabled(placement)) return;

    // Only render a manual ad unit when a valid slot ID is configured.
    // If the slot is empty, the auto-ads script in index.html handles placement
    // automatically — pushing an empty slot causes console errors and policy issues.
    const slotId = adInfo.config?.slots?.[placement];

    if (adInfo.provider === 'adsense' && adInfo.config?.clientId && slotId) {
      // Google AdSense manual ad unit
      try {
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', adInfo.config.clientId);
        ins.setAttribute('data-ad-slot', slotId);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(ins);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn('[AdSlot] AdSense error:', e);
      }
    }

    if (adInfo.provider === 'carbon' && adInfo.config?.serve) {
      // Carbon Ads integration
      try {
        const script = document.createElement('script');
        script.src = adInfo.config.serve;
        script.id = '_carbonads_js';
        script.async = true;
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(script);
        }
      } catch (e) {
        console.warn('[AdSlot] Carbon Ads error:', e);
      }
    }
  }, [placement, adInfo.provider]);

  if (!isAdEnabled(placement)) return null;

  // If AdSense is active but no slot ID is configured, return null —
  // rely on Auto Ads (the script tag in index.html) for ad placement.
  if (adInfo.provider === 'adsense' && !adInfo.config?.slots?.[placement]) return null;

  // Custom sponsor banner
  if (adInfo.provider === 'custom') {
    const banner = adInfo.config?.banners?.[placement];
    if (!banner?.enabled) return null;

    return (
      <div className="ad-slot ad-slot-custom" style={{
        margin: 'var(--spacing-lg) 0',
        padding: 'var(--spacing-md)',
        textAlign: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg)',
      }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
          Sponsor
        </span>
        <a
          href={banner.link}
          style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {banner.text}
        </a>
      </div>
    );
  }

  // AdSense / Carbon container
  return (
    <div
      ref={containerRef}
      className="ad-slot"
      data-placement={placement}
      style={{ margin: 'var(--spacing-lg) 0', minHeight: 90, textAlign: 'center' }}
    />
  );
}
