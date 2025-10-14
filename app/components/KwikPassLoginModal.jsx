import {useEffect, useRef, useState, useCallback} from 'react';
import {createPortal} from 'react-dom';

export function KwikPassLoginModal({
  open,
  onClose,
  onSubmit,
  countryCode = '+91',
}) {
  const inputRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // body scroll lock + esc to close + autofocus
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const validatePhone = useCallback((raw) => {
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length !== 10) return 'Enter valid 10-digit number';
    if (!/^[6-9]/.test(digits)) return 'Number must start with 6–9';
    return '';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePhone(phone);
    setError(err);
    if (err) return;
    await onSubmit?.(phone.replace(/\D/g, ''));
  };

  if (!open) return null;

  const modal = (
    <div
      className="kwikpass-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="kwikpass-modal">
        {/* Black hero */}
        <div className="kwikpass-hero">
          <img
            src="https://d1nl4izteao6lk.cloudfront.net/images/saadaa_logo_white.png"
            alt="SAADAA"
            className="kwikpass-logo-saadaa"
          />
          <img
            src="https://d1nl4izteao6lk.cloudfront.net/images/powered_by_kp_4px.svg"
            alt="Powered by KwikPass"
            className="kwikpass-logo-powered"
          />
        </div>

        {/* White card */}
        <div
          className="kwikpass-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kp-title"
        >
          <button
            className="kwikpass-close"
            onClick={() => onClose?.()}
            aria-label="Close login modal"
            type="button"
          >
            <svg
              id="close"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: 'auto !important',
                height: 'auto !important',
                fontFamily: 'unset',
              }}
            >
              <path
                id="close-path"
                d="M15 5L5 15M5 5L15 15"
                stroke="white"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{fontFamily:"unset"}}
              ></path>
            </svg>
          </button>

          <h2 id="kp-title" className="kwikpass-title">
            Login / Signup
          </h2>

          <form onSubmit={handleSubmit} className="kwikpass-form">
            <span className="kwikpass-label">Enter Mobile Number</span>

            <div className="kwikpass-input-row">
              <div className="kwikpass-code-box">
                <span className="kwikpass-flag" aria-hidden="true" />
                <span className="kwikpass-country-code">{countryCode}</span>
              </div>
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="kwikpass-input"
                aria-invalid={!!error}
              />
            </div>

            {error && <div className="kwikpass-error">{error}</div>}

            <button type="submit" className="kwikpass-btn">
              Continue
            </button>

            <div className="kwikpass-legal">
              By logging in, you’re agreeing to our{' '}
              <a href="/pages/privacy-policy">Privacy Policy</a> &{' '}
              <a href="/pages/terms-conditions">Terms of Service</a>.
            </div>

            <button type="button" className="kwikpass-trouble">
              Trouble logging in?
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ⬇️ render at <body> so it's not affected by sidebar transforms
  return createPortal(modal, document.body);
}
