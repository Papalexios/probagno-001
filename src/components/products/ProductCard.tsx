import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const { addItem } = useCartStore();
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const defaultDimension = product.dimensions[0];
  const displayPrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultDimension) {
      addItem(product, defaultDimension);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
          <motion.img
            src={primaryImage?.url}
            alt={primaryImage?.alt || product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            {product.bestSeller && (
              <span className="px-3 py-1 bg-gold text-charcoal text-xs font-medium rounded-full">
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                Sale
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2"
          >
            <Button
              size="sm"
              className="flex-1 gap-2"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="w-4 h-4" />
              Προσθήκη
            </Button>
            <Button size="sm" variant="secondary" className="px-3">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="px-3">
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category === 'vanities' && 'Έπιπλα Μπάνιου'}
            {product.category === 'mirrors' && 'Καθρέπτες'}
            {product.category === 'cabinets' && 'Ντουλάπια'}
            {product.category === 'accessories' && 'Αξεσουάρ'}
          </p>
          <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg">€{displayPrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                €{product.basePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.dimensions.length > 1 && (
            <p className="text-xs text-muted-foreground">
              {product.dimensions.length} διαστάσεις διαθέσιμες
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
