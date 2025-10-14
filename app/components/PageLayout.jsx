import { useState } from 'react';
import { AsideProvider } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { AnnouncementBar } from '~/components/AnnouncementBar';
import { CartAside } from '~/components/CartAside';
import { SearchAside } from '~/components/SearchAside';
import { MenuAside } from '~/components/MenuAside';
import { KwikPassLoginModal } from '~/components/KwikPassLoginModal';


/**
 * Page Layout Component
 * - Wraps all pages with header, footer, and asides
 * - Manages global layout state
 *
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <AsideProvider>
      <AnnouncementBar />
      
      {/* All Asides - Lazy loaded when opened */}
      <CartAside cart={cart} />
      <SearchAside />
      <MenuAside setIsLoginOpen={setIsLoginOpen} />
      <KwikPassLoginModal open={isLoginOpen} onClose={()=> setIsLoginOpen(false)} onSubmit={()=>setIsLoginOpen(false)}/>
      
      {/* Header */}
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      
      {/* Main Content */}
      <main>{children}</main>
      
      {/* Footer */}
      {footer && <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />}
      
       <a
        href="https://wa.me/919251998279?text=Hi%20!"
        className="floating-whatsapp"
      >
        <img
          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/56x56_1.png?v=1755694867"
          alt="WhatsApp Icon"
          width="56"
          height="56"
        />
      </a>
    </AsideProvider>
  );
}




/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */