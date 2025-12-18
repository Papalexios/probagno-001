import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, X, ChevronDown, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProductsQuery, useCategoriesQuery } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const { language, t } = useLanguage();
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(3);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 3000;
    const prices = products.map((p) => p.salePrice || p.basePrice);
    return Math.ceil(Math.max(...prices) / 100) * 100;
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Enhanced search filter - searches across multiple fields
    if (search) {
      const lowerSearch = search.toLowerCase().trim();
      result = result.filter((p) => {
        // Search in names
        const nameMatch = p.name.toLowerCase().includes(lowerSearch) ||
                          p.nameEn.toLowerCase().includes(lowerSearch);
        
        // Search in description
        const descMatch = p.description.toLowerCase().includes(lowerSearch) ||
                          p.descriptionEn?.toLowerCase().includes(lowerSearch);
        
        // Search in colors
        const colorMatch = p.colors.some(color => 
          color.toLowerCase().includes(lowerSearch)
        );
        
        // Search in materials
        const materialMatch = p.materials.some(material => 
          material.toLowerCase().includes(lowerSearch)
        );
        
        // Search in features
        const featureMatch = p.features.some(feature => 
          feature.toLowerCase().includes(lowerSearch)
        );
        
        // Search in tags/categories
        const tagMatch = p.tags?.some(tag => 
          tag.toLowerCase().includes(lowerSearch)
        );
        
        // Return true if ANY field matches
        return nameMatch || descMatch || colorMatch || materialMatch || featureMatch || tagMatch;
      });
    }

    // Category filter (using tags)
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes('all')) {
        result = result.filter((p) => 
          p.tags?.some((tag) => selectedCategories.includes(tag))
        );
      }
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) =>
          selectedColors.includes(color.toLowerCase().trim())
        )
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      result = result.filter((p) =>
        p.materials.some((material) =>
          selectedMaterials.includes(material.trim())
        )
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice || p.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategories, selectedColors, selectedMaterials, priceRange, sortBy]);

  // Toggle functions
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setPriceRange([0, maxPrice]);
    setSortBy('featured');
  };

  // Check if any filters are active
  const hasFilters: boolean =
    !!search ||
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedMaterials.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <>
      <Helmet>
        <title>{language === 'el' ? 'Προϊόντα | PROBAGNO - Έπιπλα Μπάνιου' : 'Products | PROBAGNO - Bathroom Furniture'}</title>
        <meta
          name="description"
          content={language === 'el' 
            ? 'Εξερευνήστε την πλήρη συλλογή επίπλων μπάνιου PROBAGNO. Νιπτήρες, καθρέπτες, ντουλάπια και αξεσουάρ υψηλής ποιότητας.'
            : 'Explore the complete PROBAGNO bathroom furniture collection. High-quality sinks, mirrors, cabinets and accessories.'}
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="pt-8 pb-8 sm:pt-12 sm:pb-12 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4">
                {language === 'el' ? 'Τα Προϊόντα μας' : 'Our Products'}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {language === 'el' 
                  ? 'Ανακαλύψτε τη συλλογή μας από επιλεγμένα έπιπλα μπάνιου υψηλής αισθητικής'
                  : 'Discover our collection of high-aesthetic bathroom furniture'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-4 mb-6 sm:mb-8"
            >
              {/* Search Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={language === 'el' ? 'Αναζήτηση προϊόντων...' : 'Search products...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-11 h-11 sm:h-12 rounded-xl text-base"
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Filters */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="lg:hidden gap-2 h-11 sm:h-12 rounded-xl flex-1 sm:flex-none relative"
                      >
                        <Filter className="w-4 h-4" />
                        <span>{t('products.filter')}</span>
                        {activeFilterCount > 0 && (
                          <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                          >
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85%] sm:w-[380px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="text-left flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5" />
                          {language === 'el' ? 'Φίλτρα Προϊόντων' : 'Product Filters'}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <ProductFilters
                          products={products}
                          categories={categories}
                          selectedCategories={selectedCategories}
                          selectedColors={selectedColors}
                          selectedMaterials={selectedMaterials}
                          priceRange={priceRange}
                          maxPrice={maxPrice}
                          onCategoryChange={toggleCategory}
                          onColorChange={toggleColor}
                          onMaterialChange={toggleMaterial}
                          onPriceChange={setPriceRange}
                          onClearFilters={clearFilters}
                          hasFilters={hasFilters}
                        />
                      </div>
                      
                      {/* Sticky Apply Button */}
                      <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t mt-6 -mx-6 -mb-6">
                        <Button
                          className="w-full h-12 rounded-xl"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          {language === 'el' ? `Εμφάνιση ${filteredProducts.length} Προϊόντων` : `Show ${filteredProducts.length} Products`}
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-11 sm:h-12 w-full sm:w-auto px-4 pr-10 rounded-xl border border-input bg-background text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="featured">{language === 'el' ? 'Προτεινόμενα' : 'Featured'}</option>
                      <option value="newest">{t('products.sort.newest')}</option>
                      <option value="price-asc">{language === 'el' ? 'Τιμή ↑' : 'Price ↑'}</option>
                      <option value="price-desc">{language === 'el' ? 'Τιμή ↓' : 'Price ↓'}</option>
                      <option value="name">{t('products.sort.name')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Grid Toggle - Desktop */}
                  <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl border border-input bg-background">
                    <button
                      onClick={() => setGridCols(2)}
                      className={cn(
                        'p-2.5 rounded-lg transition-colors',
                        gridCols === 2 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        'p-2.5 rounded-lg transition-colors',
                        gridCols === 3 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Filter Chips (Mobile) */}
              <AnimatePresence>
                {hasFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden flex flex-wrap gap-2"
                  >
                    {selectedCategories.map((slug) => {
                      const cat = categories.find((c) => c.slug === slug);
                      return (
                        <Badge
                          key={slug}
                          variant="secondary"
                          className="gap-1.5 pr-1.5 cursor-pointer"
                          onClick={() => toggleCategory(slug)}
                        >
                          {cat?.name || slug}
                          <X className="w-3 h-3" />
                        </Badge>
                      );
                    })}
                    {selectedColors.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedColors.length} {language === 'el' ? 'χρώματα' : 'colors'}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColors([])} />
                      </Badge>
                    )}
                    {selectedMaterials.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedMaterials.length} {language === 'el' ? 'υλικά' : 'materials'}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedMaterials([])} />
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <Badge variant="secondary" className="gap-1">
                        €{priceRange[0]}-€{priceRange[1]}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, maxPrice])} />
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={clearFilters}
                    >
                      {language === 'el' ? 'Καθαρισμός' : 'Clear'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-6 lg:gap-10">
              {/* Desktop Sidebar - Sticky with scroll */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2">
                  <ProductFilters
                    products={products}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    selectedColors={selectedColors}
                    selectedMaterials={selectedMaterials}
                    priceRange={priceRange}
                    maxPrice={maxPrice}
                    onCategoryChange={toggleCategory}
                    onColorChange={toggleColor}
                    onMaterialChange={toggleMaterial}
                    onPriceChange={setPriceRange}
                    onClearFilters={clearFilters}
                    hasFilters={hasFilters}
                  />
                </div>
              </aside>

              {/* Products */}
              <div className="flex-1 min-w-0">
                {/* Results Count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between mb-4 sm:mb-6"
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredProducts.length}</span>{' '}
                    {language === 'el' 
                      ? (filteredProducts.length === 1 ? 'προϊόν' : 'προϊόντα')
                      : (filteredProducts.length === 1 ? 'product' : 'products')}
                    {hasFilters && (language === 'el' ? ' (φιλτραρισμένα)' : ' (filtered)')}
                  </p>
                </motion.div>

                {isLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] rounded-2xl bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {t('products.noResults')}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'el' 
                        ? 'Δοκιμάστε να αλλάξετε τα φίλτρα σας'
                        : 'Try changing your filters'}
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      {t('products.clearFilters')}
                    </Button>
                  </motion.div>
                ) : (
                  <div
                    className={cn(
                      'grid gap-4 sm:gap-6',
                      gridCols === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-2 lg:grid-cols-3'
                    )}
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
