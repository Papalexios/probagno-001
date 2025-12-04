import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Phone } from 'lucide-react';
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
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>210 6622215 | 210 6622218</span>
          </div>
          <Link to="/admin" className="hover:underline hidden sm:block">
            Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">PB</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-semibold tracking-tight">PROBAGNO</h1>
              <p className="text-xs text-muted-foreground">Since 1974</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors link-underline"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {itemCount}
                </motion.span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg font-medium py-2 border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="text-lg font-medium py-2 text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
