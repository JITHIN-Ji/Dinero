import { useState, useEffect } from "react";

const CONFIG = {
  APK_URL: "/DineroStakes.apk",
};

const GOLD_H = "linear-gradient(90deg,  #7B6328 0%, #A8882E 15%, #C9A84C 35%, #E2C664 50%, #C9A84C 65%, #A8882E 85%, #7B6328 100%)";
const GOLD_D = "linear-gradient(135deg, #7B6328 0%, #A8882E 15%, #C9A84C 35%, #E2C664 50%, #C9A84C 65%, #A8882E 85%, #7B6328 100%)";

export default function DinoraStakesDownload() {
  const [visible,      setVisible]      = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referrerName, setReferrerName] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);

    const pathname = window.location.pathname;
    const search   = window.location.search;

    let code = '';
    const pathMatch = pathname.match(/\/ref\/([A-Z0-9a-z]+)/i);
    if (pathMatch) {
      code = pathMatch[1].toUpperCase();
    } else {
      const params = new URLSearchParams(search);
      code = (params.get('ref') || '').toUpperCase();
    }

    if (code) {
      setReferralCode(code);
      copyToClipboard(code);
      fetchReferrerName(code);
    }

    return () => clearTimeout(t);
  }, []);

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      try {
        const el          = document.createElement('textarea');
        el.value          = code;
        el.style.position = 'fixed';
        el.style.opacity  = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      } catch (e2) {
        console.log('Clipboard copy failed:', e2.message);
      }
    }
  };

  const fetchReferrerName = async (code) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;
      const res  = await fetch(`${apiUrl}/referral-info/${code}`);
      const data = await res.json();
      if (data.success && data.name) setReferrerName(data.name);
    } catch (e) {
      console.log('Could not fetch referrer name:', e.message);
    }
  };

  const handleDownload = () => {
    if (CONFIG.APK_URL === "YOUR_APK_LINK_HERE") {
      alert("Please set your APK URL in the CONFIG object.");
      return;
    }
    const a    = document.createElement("a");
    a.href     = CONFIG.APK_URL;
    a.download = "DineroStakes.apk";
    a.click();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          margin: 0; padding: 0;
          background: #0a0800;
          overscroll-behavior: none;
          -webkit-text-size-adjust: 100%;
        }

        /* ── BACKGROUND — dark base with soft warm gold glow in center ── */
        .ds-bg {
          position: fixed; inset: 0; z-index: 0;
          background: #0a0800;
        }
        /* soft golden glow — center top, subtle corners */
        .ds-bg::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 75% 55% at 50% 35%, rgba(160,110,15,0.17) 0%, transparent 65%),
            radial-gradient(ellipse 45% 35% at 15% 85%, rgba(110,75,8,0.10)   0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 85% 15%, rgba(130,90,10,0.09)  0%, transparent 50%);
        }
        /* light grain texture for depth */
        .ds-bg::after {
          content: '';
          position: absolute; inset: 0; opacity: 0.35;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='multiply'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)' opacity='0.3' fill='%23c9a84c'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          mix-blend-mode: overlay;
        }

        /* subtle moving grain layer */
        .ds-grain {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.30;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.5' fill='%23b8882a'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          mix-blend-mode: soft-light;
        }

        .ds-vignette {
          position: fixed; inset: 0; z-index: 2; pointer-events: none;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.60) 100%);
        }

        .ds-bar-top, .ds-bar-bottom {
          position: fixed; left: 0; right: 0; height: 3px;
          background: ${GOLD_H}; z-index: 100;
        }
        .ds-bar-top    { top: 0; }
        .ds-bar-bottom { bottom: 0; }

        .ds-root {
          position: relative; z-index: 10;
          min-height: 100vh; min-height: 100dvh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding-top: calc(env(safe-area-inset-top) + 56px);
          padding-bottom: calc(env(safe-area-inset-bottom) + 56px);
          padding-left: calc(env(safe-area-inset-left) + 20px);
          padding-right: calc(env(safe-area-inset-right) + 20px);
          width: 100%;
          font-family: 'Rajdhani', sans-serif;
        }

        .ds-header {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(-24px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .ds-header.vis { opacity: 1; transform: translateY(0); }

        .ds-logo {
          width: clamp(90px, 28vw, 130px);
          height: clamp(90px, 28vw, 130px);
          margin-bottom: 22px;
          display: flex; align-items: center; justify-content: center;
          filter: drop-shadow(0 0 18px rgba(226,198,100,0.45))
                  drop-shadow(0 0 40px rgba(201,168,76,0.20));
        }
        .ds-logo img { width: 100%; height: 100%; object-fit: contain; }

        .ds-company-name {
          font-family: 'Cinzel', serif;
          font-size: clamp(22px, 6.5vw, 44px);
          font-weight: 900; letter-spacing: clamp(3px, 1.5vw, 7px);
          background: ${GOLD_H};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center; line-height: 1.2;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.9));
        }

        .ds-tagline {
          font-size: clamp(10px, 2.8vw, 13px);
          letter-spacing: clamp(3px, 1.2vw, 6px);
          color: rgba(255,255,255,0.60);
          text-transform: uppercase; margin-top: 10px;
          font-weight: 300; font-family: Georgia, serif;
          text-shadow: 0 1px 6px rgba(0,0,0,0.9);
        }

        .ds-rule {
          width: clamp(140px, 55vw, 220px); height: 2px;
          background: ${GOLD_H};
          margin: 20px 0; border-radius: 2px;
          opacity: 0; transition: opacity 0.8s 0.25s ease;
        }
        .ds-rule.vis { opacity: 1; }

        /* ── REFERRAL CARD ── */
        .ds-ref-card {
          width: 100%; max-width: 420px;
          background: rgba(16,11,3,0.90);
          border: 1px solid rgba(200,146,42,0.30);
          border-radius: 16px;
          padding: 20px 24px;
          text-align: center;
          margin-bottom: 18px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease;
        }
        .ds-ref-card.vis { opacity: 1; transform: translateY(0); }

        .ds-invited-by {
          font-size: clamp(11px, 2.8vw, 13px);
          color: #c8922a; letter-spacing: 1px;
          margin-bottom: 4px; font-weight: 600;
        }
        .ds-referrer-name {
          font-size: clamp(16px, 4vw, 20px);
          color: #f0e6cc; font-weight: 700;
          margin-bottom: 12px;
        }
        .ds-code-hint {
          font-size: clamp(11px, 2.8vw, 13px);
          color: #6a5030; line-height: 1.7;
        }
        .ds-code-hint strong { color: #c8922a; }

        /* ── DOWNLOAD BUTTON ── */
        .ds-btn-wrap {
          width: 100%; max-width: 420px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.8s 0.45s ease, transform 0.8s 0.45s ease;
        }
        .ds-btn-wrap.vis { opacity: 1; transform: translateY(0); }

        .ds-btn {
          display: flex; align-items: center; justify-content: center;
          gap: clamp(12px, 3vw, 18px);
          width: 100%;
          padding: clamp(16px, 4.5vw, 22px) clamp(20px, 5vw, 32px);
          background: ${GOLD_D};
          border: none; border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: clamp(15px, 4vw, 18px);
          font-weight: 700; color: #FFFFFF;
          letter-spacing: clamp(2px, 0.8vw, 3px);
          cursor: pointer; min-height: 60px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: transform 0.15s ease, box-shadow 0.3s ease, filter 0.3s ease;
          box-shadow: 0 4px 24px rgba(238,187,77,0.42), 0 2px 10px rgba(0,0,0,0.75);
          animation: ds-pulse 2.5s ease-in-out infinite;
          position: relative; overflow: hidden;
        }
        .ds-btn::before {
          content: '';
          position: absolute; top: 0; left: -110%; width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: ds-shimmer 2.8s ease-in-out infinite;
        }
        .ds-btn:hover {
          filter: brightness(1.12);
          box-shadow: 0 8px 42px rgba(238,187,77,0.60), 0 4px 18px rgba(0,0,0,0.9);
          transform: translateY(-3px); animation: none;
        }
        .ds-btn:hover::before { animation: none; }
        .ds-btn:active { transform: scale(0.97); filter: brightness(0.95); animation: none; }

        .ds-btn-icon svg {
          width: clamp(20px, 5vw, 26px); height: clamp(20px, 5vw, 26px);
          display: block; flex-shrink: 0;
        }
        .ds-btn-right { display: flex; flex-direction: column; align-items: flex-start; }
        .ds-btn-main  { display: block; line-height: 1.1; }
        .ds-btn-sub   {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(10px, 2.5vw, 12px);
          letter-spacing: 2px; color: rgba(255,255,255,0.60);
          font-weight: 600; margin-top: 4px; display: block;
        }

        /* ── BADGES ── */
        .ds-badges {
          display: flex; justify-content: center;
          gap: clamp(6px, 2vw, 10px);
          margin-top: 20px; flex-wrap: wrap;
          max-width: 420px; width: 100%;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.8s 0.6s ease, transform 0.8s 0.6s ease;
        }
        .ds-badges.vis { opacity: 1; transform: translateY(0); }

        .ds-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(197,168,76,0.28);
          border-radius: 24px;
          padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px);
          font-size: clamp(10px, 2.4vw, 12px);
          color: rgba(226,198,100,0.85); letter-spacing: 1.5px;
          text-transform: uppercase; font-weight: 700;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
          -webkit-tap-highlight-color: transparent;
        }
        .ds-badge svg { width: 11px; height: 11px; flex-shrink: 0; }

        /* ── FOOTER ── */
        .ds-footer {
          margin-top: 36px; text-align: center;
          opacity: 0; transition: opacity 0.8s 0.75s ease;
        }
        .ds-footer.vis { opacity: 1; }
        .ds-footer-line {
          width: 50px; height: 1px; margin: 0 auto 12px;
          background: ${GOLD_H}; opacity: 0.35;
        }
        .ds-footer p {
          font-size: clamp(10px, 2.5vw, 12px);
          color: rgba(197,168,76,0.32);
          letter-spacing: 2px; font-weight: 700;
          text-transform: uppercase;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
        }

        @media (max-width: 360px) {
          .ds-badges { gap: 6px; }
          .ds-badge  { padding: 5px 10px; font-size: 9px; }
        }
        @media (max-height: 500px) and (orientation: landscape) {
          .ds-root   { justify-content: flex-start; padding-top: 40px; }
          .ds-logo   { width: 70px; height: 70px; margin-bottom: 12px; }
          .ds-header { margin-bottom: 16px; }
          .ds-rule   { margin: 12px 0; }
        }
        @media (min-width: 640px) {
          .ds-root { justify-content: center; }
          .ds-btn-wrap, .ds-badges, .ds-ref-card { max-width: 440px; }
        }

        @keyframes ds-pulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(238,187,77,0.42), 0 2px 10px rgba(0,0,0,0.75); }
          50%       { box-shadow: 0 6px 36px rgba(238,187,77,0.58), 0 4px 18px rgba(0,0,0,0.9); }
        }
        @keyframes ds-shimmer {
          0%        { left: -110%; }
          55%, 100% { left: 160%; }
        }
      `}</style>

      <div className="ds-bg" />
      <div className="ds-grain" />
      <div className="ds-vignette" />
      <div className="ds-bar-top" />
      <div className="ds-bar-bottom" />

      <div className="ds-root">

        {/* LOGO + NAME */}
        <div className={`ds-header ${visible ? "vis" : ""}`}>
          <div className="ds-logo">
            <img src="/logo.png" alt="Dinero Stakes" />
          </div>
          <div className="ds-company-name">DINERO STAKES</div>
          <div className="ds-tagline">STAKE YOUR LIFE</div>
        </div>

        <div className={`ds-rule ${visible ? "vis" : ""}`} />

        {/* REFERRAL CARD */}
        {referralCode && (
          <div className={`ds-ref-card ${visible ? "vis" : ""}`}>
            {referrerName && (
              <>
                <div className="ds-invited-by">You've been invited by</div>
                <div className="ds-referrer-name">{referrerName}</div>
              </>
            )}
            <div className="ds-code-hint">
              Download the app · Open · Sign Up<br />
              Your referral code will be <strong>auto‑filled</strong>
            </div>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        <div className={`ds-btn-wrap ${visible ? "vis" : ""}`}>
          <button className="ds-btn" onClick={handleDownload}>
            <div className="ds-btn-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3V17M12 17L7 12M12 17L17 12"
                  stroke="#FFFFFF" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                <rect x="3" y="20" width="18" height="2.5" rx="1.25" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="ds-btn-right">
              <span className="ds-btn-main">DOWNLOAD APK</span>
              <span className="ds-btn-sub">FREE · ANDROID</span>
            </div>
          </button>
        </div>

        {/* BADGES */}
        <div className={`ds-badges ${visible ? "vis" : ""}`}>
          <div className="ds-badge">
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M6 1L10 3V6.5C10 8.5 8 10.5 6 11C4 10.5 2 8.5 2 6.5V3L6 1Z"
                stroke="#E2C664" strokeWidth="1" fill="rgba(201,168,76,0.15)" />
              <path d="M4 6L5.5 7.5L8 4.5" stroke="#E2C664" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Official
          </div>
          <div className="ds-badge">
            <svg viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#E2C664" strokeWidth="1" />
              <path d="M4 6L5.5 7.5L8 4" stroke="#E2C664" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </div>
          <div className="ds-badge">
            <svg viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="5" width="9" height="6" rx="1"
                stroke="#E2C664" strokeWidth="1" fill="rgba(201,168,76,0.15)" />
              <path d="M3.5 5V3.5C3.5 2.1 4.6 1 6 1C7.4 1 8.5 2.1 8.5 3.5V5"
                stroke="#E2C664" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Safe to Install
          </div>
        </div>

        {/* FOOTER */}
        <div className={`ds-footer ${visible ? "vis" : ""}`}>
          <div className="ds-footer-line" />
          <p>© 2026 Dinero Stakes</p>
          <p style={{ marginTop: 5 }}>All Rights Reserved</p>
        </div>

      </div>
    </>
  );
}