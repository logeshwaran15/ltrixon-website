interface LtrixonLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  light?: boolean;
  customUrl?: string | null;
}

const LtrixonLogo = ({ size = "md", className = "", light = false, customUrl = null }: LtrixonLogoProps) => {
  const heights: Record<string, number> = { 
    sm: 24, 
    md: 32, 
    lg: 40 
  };
  
  const h = heights[size];
  const fontSize = h * 0.8;

  const logoSrc = customUrl || localStorage.getItem("brandLogo");

  return (
    <span 
      className={`flex items-center gap-2 select-none group focus:outline-none ${className}`} 
      aria-label="Ltrixon"
    >
      {logoSrc ? (
        <img 
          src={logoSrc} 
          alt="Brand Logo" 
          style={{ height: `${h}px`, width: 'auto' }} 
          className="object-contain"
        />
      ) : (
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: `${fontSize}px`,
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
          className={`whitespace-nowrap transition-colors duration-300 ${
            light ? "text-slate-800 dark:text-white" : "text-white"
          }`}
        >
          LTRIX
          <span className="text-admin-primary">O</span>
          N
        </span>
      )}
    </span>
  );
};

export default LtrixonLogo;
