import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, X, ChevronDown, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductsQuery, useCategoriesQuery } from '@/hooks/useProducts';
import { productTypes, productMaterials } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(3);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.nameEn.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter((p) => {
      const price = p.salePrice || p.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

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
      case 'featured':
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceRange([0, 3000]);
    setSortBy('featured');
  };

  const hasFilters = search || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 3000;

  const FilterContent = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Κατηγορίες</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
                className="rounded-md"
              />
              <Label htmlFor={category.slug} className="text-sm cursor-pointer flex-1">
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {category.productCount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Τύπος</h3>
        <div className="space-y-3">
          {productTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-3">
              <Checkbox id={`type-${type.id}`} className="rounded-md" />
              <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer flex-1">
                {type.name}
              </Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {type.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Υλικό</h3>
        <div className="space-y-3">
          {productMaterials.map((material) => (
            <div key={material.id} className="flex items-center gap-3">
              <Checkbox id={`mat-${material.id}`} className="rounded-md" />
              <Label htmlFor={`mat-${material.id}`} className="text-sm cursor-pointer flex-1">
                {material.name}
              </Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {material.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Τιμή</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={3000}
          step={50}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-muted font-medium">€{priceRange[0]}</span>
          <span className="text-muted-foreground">—</span>
          <span className="px-3 py-1.5 rounded-lg bg-muted font-medium">€{priceRange[1]}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-xl h-11">
          Καθαρισμός Φίλτρων
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Προϊόντα | PROBAGNO - Έπιπλα Μπάνιου</title>
        <meta name="description" content="Εξερευνήστε την πλήρη συλλογή επίπλων μπάνιου PROBAGNO. Νιπτήρες, καθρέπτες, ντουλάπια και αξεσουάρ υψηλής ποιότητας." />
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
                Τα Προϊόντα μας
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Ανακαλύψτε τη συλλογή μας από επιλεγμένα έπιπλα μπάνιου υψηλής αισθητικής
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
                    placeholder="Αναζήτηση προϊόντων..."
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2 h-11 sm:h-12 rounded-xl flex-1 sm:flex-none">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Φίλτρα</span>
                        {hasFilters && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            !
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="text-left">Φίλτρα</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
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
                      <option value="featured">Προτεινόμενα</option>
                      <option value="price-asc">Τιμή ↑</option>
                      <option value="price-desc">Τιμή ↓</option>
                      <option value="name">Όνομα</option>
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
            </motion.div>

            <div className="flex gap-6 lg:gap-10">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28 bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                  <FilterContent />
                </div>
              </aside>

              {/* Products */}
              <div className="flex-1 min-w-0">
                {/* Results Count */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground mb-4 sm:mb-6"
                >
                  <span className="font-semibold text-foreground">{filteredProducts.length}</span> προϊόντα
                </motion.p>

                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 sm:py-20"
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Δεν βρέθηκαν προϊόντα με αυτά τα κριτήρια
                    </p>
                    <Button onClick={clearFilters} className="rounded-xl h-11">
                      Καθαρισμός Φίλτρων
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