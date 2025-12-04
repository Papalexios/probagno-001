import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Αρχική', href: '/' },
  { name: 'Προϊόντα', href: '/products' },
  { name: 'Έργα', href: '/projects' },
  { name: 'Κατάλογος', href: '/catalog' },
  { name: 'Probagno', href: '/about' },
  { name: 'Επικοινωνία', href: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-md border-b border-border/50" 
            : "bg-transparent"
        )}
      >
        {/* Top Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "bg-primary text-primary-foreground py-2 transition-all duration-300",
            isScrolled ? "py-1.5" : "py-2"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm">
            <a href="tel:+302106622215" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">210 6622215 | 210 6622218</span>
              <span className="xs:hidden">210 6622215</span>
            </a>
            <Link to="/admin" className="hover:underline hidden sm:block font-medium">
              Admin Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Main Header */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-16" : "h-18 sm:h-20"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <span className="text-primary-foreground font-display font-bold text-lg sm:text-xl">PB</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg sm:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                  PROBAGNO
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Since 1974</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                      isActive 
                        ? "text-primary" 
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex w-10 h-10 rounded-full">
                <Search className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10 rounded-full"
                onClick={toggleCart}
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-10 h-10 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-display text-lg font-semibold">Μενού</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2">
                  {navigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-accent"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                          <ChevronRight className={cn(
                            "w-5 h-5 transition-transform",
                            isActive && "text-primary"
                          )} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border space-y-3">
                  <Link
                    to="/admin"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <a 
                    href="tel:+302106622215" 
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent rounded-xl font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    210 6622215
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}