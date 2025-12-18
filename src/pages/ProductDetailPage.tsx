import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useProductBySlug, useProductsQuery } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/products/ProductCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: products = [] } = useProductsQuery();
  const { addItem } = useCartStore();

  const [selectedDimensionId, setSelectedDimensionId] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Set initial dimension when product loads
  if (product && !selectedDimensionId && product.dimensions[0]) {
    setSelectedDimensionId(product.dimensions[0].id);
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">{t('product.notFound')}</h1>
          <Button asChild>
            <Link to="/products">{t('product.backToProducts')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const productName = language === 'en' && product.nameEn ? product.nameEn : product.name;
  const productDescription = language === 'en' && product.descriptionEn ? product.descriptionEn : product.description;
  const selectedDimension = product.dimensions.find((d) => d.id === selectedDimensionId) || product.dimensions[0];
  const displayPrice = product.salePrice || selectedDimension.price;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  const handleAddToCart = () => {
    addItem(product, selectedDimension, quantity);
    toast.success(`${productName} ${t('product.addedToCart')}`);
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const getCategoryName = (category: string) => {
    if (category === 'vanities') return t('category.vanities');
    if (category === 'mirrors') return t('category.mirrors');
    if (category === 'cabinets') return t('category.cabinets');
    return category;
  };

  return (
    <>
      <Helmet>
        <title>{productName} | PROBAGNO</title>
        <meta name="description" content={productDescription} />
      </Helmet>
      <Layout>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">{t('product.home')}</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-foreground">{t('nav.products')}</Link>
            <span className="text-muted-foreground">/</span>
            <span>{productName}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div 
                      key={image.id} 
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "aspect-square rounded-md overflow-hidden bg-muted cursor-pointer transition-all",
                        selectedImageIndex === index 
                          ? "ring-2 ring-primary" 
                          : "hover:ring-2 ring-primary/50"
                      )}
                    >
                      <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Badges */}
              <div className="flex gap-2">
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

              {/* Title & Price */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {getCategoryName(product.category)}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">{productName}</h1>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-semibold">€{displayPrice.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through">
                      €{product.basePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground">{productDescription}</p>

              {/* Dimensions Selector */}
              <div>
                <h3 className="font-medium mb-3">{t('product.selectDimensions')}</h3>
                <RadioGroup value={selectedDimensionId} onValueChange={setSelectedDimensionId}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.dimensions.map((dim) => (
                      <div key={dim.id}>
                        <RadioGroupItem value={dim.id} id={dim.id} className="peer sr-only" />
                        <Label
                          htmlFor={dim.id}
                          className={cn(
                            'flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all',
                            'hover:border-primary/50',
                            selectedDimensionId === dim.id
                              ? 'border-primary bg-accent'
                              : 'border-border'
                          )}
                        >
                          <span className="font-medium">
                            {dim.width} x {dim.height} x {dim.depth} cm
                          </span>
                          <span className="text-sm text-muted-foreground mt-1">SKU: {dim.sku}</span>
                          <span className="font-semibold mt-2">€{dim.price.toLocaleString()}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">{t('product.availableColors')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="px-3 py-1.5 bg-muted rounded-full text-sm">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center border border-input rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t('product.addToCart')}
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                {product.inStock ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">{t('product.inStock')}</span>
                  </>
                ) : (
                  <span className="text-destructive">{t('product.outOfStock')}</span>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.freeShipping')}</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.warranty')}</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.returns')}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="features">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
                <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  {t('product.features')}
                </TabsTrigger>
                <TabsTrigger value="materials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  {t('product.materials')}
                </TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  {t('product.shipping')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="pt-6">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="materials" className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {product.materials.map((material, i) => (
                    <span key={i} className="px-4 py-2 bg-muted rounded-lg">{material}</span>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('product.shippingInfo1')}</p>
                  <p>{t('product.shippingInfo2')}</p>
                  <p>{t('product.shippingInfo3')}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-semibold mb-8">{t('product.relatedProducts')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </section>
      </Layout>
    </>
  );
}