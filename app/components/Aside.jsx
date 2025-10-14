// Aside.jsx
import {createContext, useContext, useEffect, useState, useRef} from 'react';

const AsideContext = createContext(null);

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

export function AsideProvider({children}) {
  const [type, setType] = useState('closed');
  const closeTimestampRef = useRef(0);
  
  const openAside = (newType) => {
    // Don't open if we just closed within the last 500ms
    const timeSinceClose = Date.now() - closeTimestampRef.current;
    if (timeSinceClose < 500) {
      return;
    }
    setType(newType);
  };
  
  const closeAside = () => {
    closeTimestampRef.current = Date.now();
    setType('closed');
  };
  
  return (
    <AsideContext.Provider
      value={{
        type,
        open: openAside,
        close: closeAside,
      }}
    >
      {children}
    </AsideContext.Provider>
  );
}

export function Aside({children, heading, type, openFrom = 'right'}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const [showLoader, setShowLoader] = useState(false);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    close();
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    if (expanded) {
      document.body.style.overflow = 'hidden';
      
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            handleClose();
          }
        },
        {signal: abortController.signal},
      );
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      abortController.abort();
      document.body.style.overflow = '';
    };
  }, [expanded]);

  // Force loader for 2 seconds when aside opens (for cart type)
  useEffect(() => {
    if (expanded && type === 'cart') {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [expanded, type]);

  if (!expanded) return null;

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button
        className="close-outside"
        onClick={handleClose}
        aria-label="Close"
        type="button"
        tabIndex={-1}
      />
      <aside className={`aside-${openFrom}`}>
        <header>
          {heading}
        </header>
        <main>{children}</main>
        {showLoader && <CartLoader />}
      </aside>
    </div>
  );
}

/* ---------------- CART LOADER OVERLAY ---------------- */
function CartLoader() {
  return (
    <div className="cart-loader-overlay">
      <div className="cart-loader-spinner">
        <svg
          className="spinner-icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    </div>
  );
}