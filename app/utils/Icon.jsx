// utils/Icon.jsx
export function Icon({icon, className = ''}) {
    if (!icon) return null;
  
    // If the string starts with "<svg", render it inline
    if (typeof icon === 'string' && icon.trim().startsWith('<svg')) {
      return (
        <span
          className={className}
          dangerouslySetInnerHTML={{__html: icon}}
          aria-hidden="true"
        />
      );
    }
  
    // Otherwise treat it as an image URL
    return <img src={icon} className={className} alt="" loading="lazy" />;
  }