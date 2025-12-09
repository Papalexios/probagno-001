import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16'
  };

  const taglineSizes = {
    sm: 'text-[7px] sm:text-[8px]',
    md: 'text-[8px] sm:text-[10px]',
    lg: 'text-xs sm:text-sm'
  };

  return (
    <Link to="/" className={`group flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Logo Mark - Elegant Diamond with P */}
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05, rotate: 3 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className={`${iconSizes[size]} relative`}>
          {/* Outer diamond - marble texture effect */}
          <div className="absolute inset-0 rotate-45 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-[3px] shadow-lg">
            {/* Inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-[3px]" />
          </div>
          
          {/* Inner diamond accent */}
          <div className="absolute inset-[15%] rotate-45 border border-primary-foreground/40 rounded-[2px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-[2px]" />
          </div>
          
          {/* P letter - elegant serif style */}
          <span className="absolute inset-0 flex items-center justify-center font-serif text-primary-foreground font-bold tracking-tight drop-shadow-sm"
            style={{ fontSize: size === 'lg' ? '1.75rem' : size === 'md' ? '1.25rem' : '1rem' }}
          >
            P
          </span>
        </div>
      </motion.div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <motion.span 
          className={`font-serif font-semibold tracking-[0.08em] ${sizeClasses[size]}`}
          whileHover={{ letterSpacing: '0.12em' }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-primary">PRO</span>
          <span className="text-foreground">BAGNO</span>
        </motion.span>
        {showTagline && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${taglineSizes[size]} tracking-[0.25em] text-muted-foreground uppercase mt-0.5 font-light`}
          >
            Depuis 1974
          </motion.span>
        )}
      </div>
    </Link>
  );
}
