import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, Grid2X2, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const { products, categories } = useProductStore();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(3);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.nameEn.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice || p.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
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
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-4">Κατηγορίες</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={category.slug} className="text-sm cursor-pointer flex-1">
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground">({category.productCount})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-4">Τιμή</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={3000}
          step={50}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
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
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
                Τα Προϊόντα μας
              </h1>
              <p className="text-muted-foreground">
                Ανακαλύψτε τη συλλογή μας από επιλεγμένα έπιπλα μπάνιου υψηλής αισθητικής
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Αναζήτηση προϊόντων..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Φίλτρα
                      {hasFilters && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Φίλτρα</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-4 rounded-md border border-input bg-background text-sm"
                >
                  <option value="featured">Προτεινόμενα</option>
                  <option value="price-asc">Τιμή: Χαμηλή → Υψηλή</option>
                  <option value="price-desc">Τιμή: Υψηλή → Χαμηλή</option>
                  <option value="name">Όνομα</option>
                </select>

                {/* Grid Toggle */}
                <div className="hidden md:flex items-center gap-1 border border-input rounded-md p-1">
                  <button
                    onClick={() => setGridCols(2)}
                    className={cn(
                      'p-2 rounded',
                      gridCols === 2 ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={cn(
                      'p-2 rounded',
                      gridCols === 3 ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <FilterContent />
              </aside>

              {/* Products */}
              <div className="flex-1">
                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-6">
                  {filteredProducts.length} προϊόντα
                </p>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground mb-4">
                      Δεν βρέθηκαν προϊόντα με αυτά τα κριτήρια
                    </p>
                    <Button onClick={clearFilters}>Καθαρισμός Φίλτρων</Button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'grid gap-6',
                      gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
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
