import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const defaultDimension = product.dimensions[0];
  const displayPrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultDimension) {
      addItem(product, defaultDimension);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
          <motion.img
            src={primaryImage?.url}
            alt={primaryImage?.alt || product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Gradient Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <motion.span 
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold rounded-full shadow-lg"
              >
                Featured
              </motion.span>
            )}
            {product.bestSeller && (
              <motion.span 
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1.5 bg-gold text-charcoal text-[10px] sm:text-xs font-semibold rounded-full shadow-lg"
              >
                Best Seller
              </motion.span>
            )}
            {hasDiscount && (
              <motion.span 
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="px-3 py-1.5 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-semibold rounded-full shadow-lg"
              >
                Sale
              </motion.span>
            )}
          </div>

          {/* Quick Actions - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 left-4 right-4 hidden sm:flex gap-2"
          >
            <Button
              size="sm"
              className="flex-1 gap-2 rounded-xl h-11 shadow-lg"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="w-4 h-4" />
              Προσθήκη
            </Button>
            <Button size="sm" variant="secondary" className="px-3 rounded-xl h-11 shadow-lg bg-background/90 backdrop-blur-sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="px-3 rounded-xl h-11 shadow-lg bg-background/90 backdrop-blur-sm">
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Mobile Quick Add */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 px-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {product.category === 'vanities' && 'Έπιπλα Μπάνιου'}
            {product.category === 'mirrors' && 'Καθρέπτες'}
            {product.category === 'cabinets' && 'Ντουλάπια'}
            {product.category === 'accessories' && 'Αξεσουάρ'}
          </p>
          <h3 className="font-display text-base sm:text-lg font-medium group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-lg sm:text-xl">€{displayPrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                €{product.basePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.dimensions.length > 1 && (
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {product.dimensions.length} διαστάσεις διαθέσιμες
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}