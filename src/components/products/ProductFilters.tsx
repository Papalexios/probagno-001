import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronDown, Palette, Layers, Box, Euro, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';

// Color name to visual representation mapping
const colorMapping: Record<string, { hex: string; pattern?: string; label: string }> = {
  'white': { hex: '#FFFFFF', label: 'Λευκό' },
  'λευκό': { hex: '#FFFFFF', label: 'Λευκό' },
  'λευκό γυαλιστερό': { hex: '#FFFFFF', label: 'Λευκό Γυαλ.' },
  'corian white': { hex: '#F5F5F5', label: 'Corian' },
  'corian': { hex: '#F0EDE8', label: 'Corian' },
  'black': { hex: '#1a1a1a', label: 'Μαύρο' },
  'μαύρο': { hex: '#1a1a1a', label: 'Μαύρο' },
  'anthracite': { hex: '#383838', label: 'Ανθρακί' },
  'ανθρακί': { hex: '#454545', label: 'Ανθρακί' },
  'interior grey': { hex: '#8B8B8B', label: 'Γκρι' },
  'γκρι': { hex: '#8B8B8B', label: 'Γκρι' },
  'oak vanilla': { hex: '#D4C4A8', label: 'Δρυς Βανίλια' },
  'natural oak': { hex: '#C4A77D', label: 'Φυσική Δρυς' },
  'oak': { hex: '#B8956C', label: 'Δρυς' },
  'δρυς': { hex: '#B8956C', label: 'Δρυς' },
  'walnut': { hex: '#5D4037', label: 'Καρυδιά' },
  'καρυδιά': { hex: '#5D4037', label: 'Καρυδιά' },
  'matrix/s4': { hex: '#E8E4DE', pattern: 'texture', label: 'Matrix/S4' },
  'lacquer gloss': { hex: '#FAFAFA', label: 'Λάκα Γυαλ.' },
  'lacquer gloss white': { hex: '#FFFFFF', label: 'Λάκα Λευκή' },
  'mdf veneer': { hex: '#C9B896', label: 'MDF Καπλαμάς' },
  'χρωματιστό': { hex: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #FFE66D)', pattern: 'gradient', label: 'Χρωματιστό' },
  'χρωματιστό γυαλιστερό': { hex: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #FFE66D)', pattern: 'gradient', label: 'Χρωματιστό' },
};

const normalizeColorName = (color: string): string => color.toLowerCase().trim();

const getColorDisplay = (colorName: string) => {
  const normalized = normalizeColorName(colorName);
  if (colorMapping[normalized]) return colorMapping[normalized];
  for (const [key, value] of Object.entries(colorMapping)) {
    if (normalized.includes(key) || key.includes(normalized)) return value;
  }
  return { hex: '#D4D4D8', label: colorName };
};

interface ProductFiltersProps {
  products: Product[];
  categories: Category[];
  selectedCategories: string[];
  selectedColors: string[];
  selectedMaterials: string[];
  priceRange: number[];
  maxPrice: number;
  onCategoryChange: (slug: string) => void;
  onColorChange: (color: string) => void;
  onMaterialChange: (material: string) => void;
  onPriceChange: (range: number[]) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function ProductFilters({
  products,
  categories,
  selectedCategories,
  selectedColors,
  selectedMaterials,
  priceRange,
  maxPrice,
  onCategoryChange,
  onColorChange,
  onMaterialChange,
  onPriceChange,
  onClearFilters,
  hasFilters,
}: ProductFiltersProps) {
  const { language, t } = useLanguage();
  
  const colorOptions = useMemo(() => {
    const colorCounts = new Map<string, number>();
    products.forEach((product) => {
      product.colors.forEach((color) => {
        const normalized = normalizeColorName(color);
        colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
      });
    });
    return Array.from(colorCounts.entries())
      .map(([color, count]) => ({ value: color, display: getColorDisplay(color), count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // SIMPLE material options - no fancy categorization yet
  const materialOptions = useMemo(() => {
    const materialCounts = new Map<string, number>();
    products.forEach((product) => {
      product.materials.forEach((material) => {
        const normalized = material.trim();
        materialCounts.set(normalized, (materialCounts.get(normalized) || 0) + 1);
      });
    });
    
    return Array.from(materialCounts.entries())
      .map(([material, count]) => ({
        value: material,
        label: material.length > 30 ? material.slice(0, 27) + '...' : material,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const tagCategories = useMemo(() => {
    const tagDefs = [
      { slug: 'all', name: 'Probagno', nameEn: 'Probagno' },
      { slug: 'Καθρέπτης LED', name: 'Καθρέπτης LED', nameEn: 'LED Mirror' },
      { slug: 'Καθρέπτης με ντουλάπι', name: 'Καθρέπτης με ντουλάπι', nameEn: 'Mirror Cabinet' },
      { slug: 'Κολώνα μπάνιου', name: 'Κολώνα μπάνιου', nameEn: 'Bathroom Column' },
      { slug: 'Μεταλλική βάση', name: 'Μεταλλική βάση', nameEn: 'Metal Base' },
      { slug: 'Ντουλάπι', name: 'Ντουλάπι', nameEn: 'Cabinet' },
      { slug: 'Συρτάρι', name: 'Συρτάρι', nameEn: 'Drawer' },
    ];
    return tagDefs.map((tag) => ({
      ...tag,
      id: tag.slug,
      dynamicCount: tag.slug === 'all' ? products.length : products.filter((p) => p.tags?.includes(tag.slug)).length,
    }));
  }, [products]);

  const activeFilterCounts = {
    categories: selectedCategories.length,
    colors: selectedColors.length,
    materials: selectedMaterials.length,
    price: priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0,
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {hasFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('products.activeFilters')}</span>
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">{t('products.clearAll')}</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((slug) => {
                const cat = tagCategories.find((c) => c.slug === slug);
                return (
                  <motion.div key={`cat-${slug}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                    <Badge variant="secondary" className="gap-1.5 pr-1.5 cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => onCategoryChange(slug)}>
                      <Tag className="w-3 h-3" />{cat?.name || slug}<X className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </motion.div>
                );
              })}
              {selectedColors.map((color) => {
                const display = getColorDisplay(color);
                return (
                  <motion.div key={`color-${color}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                    <Badge variant="secondary" className="gap-1.5 pr-1.5 cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => onColorChange(color)}>
                      <span className="w-3 h-3 rounded-full border border-border/50" style={{ background: display.pattern === 'gradient' ? display.hex : display.hex }} />
                      {display.label}<X className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </motion.div>
                );
              })}
              {selectedMaterials.map((material) => (
                <motion.div key={`mat-${material}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  <Badge variant="secondary" className="gap-1.5 pr-1.5 cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => onMaterialChange(material)}>
                    <Layers className="w-3 h-3" />{material.length > 15 ? material.slice(0, 12) + '...' : material}<X className="w-3 h-3 ml-0.5" />
                  </Badge>
                </motion.div>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  <Badge variant="secondary" className="gap-1.5 pr-1.5 cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => onPriceChange([0, maxPrice])}>
                    <Euro className="w-3 h-3" />€{priceRange[0]} - €{priceRange[1]}<X className="w-3 h-3 ml-0.5" />
                  </Badge>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Accordion type="multiple" defaultValue={['categories', 'colors']} className="space-y-2">
        <AccordionItem value="categories" className="border rounded-xl px-4 bg-card/50">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3"><Box className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">{t('filter.categories')}</span>
              {activeFilterCounts.categories > 0 && <Badge variant="default" className="h-5 px-1.5 text-xs">{activeFilterCounts.categories}</Badge>}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2.5">
              {tagCategories.map((category) => (
                <label key={category.id} className={cn('flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all', 'hover:bg-accent/50', selectedCategories.includes(category.slug) && 'bg-primary/5 ring-1 ring-primary/20')}>
                  <Checkbox id={category.slug} checked={selectedCategories.includes(category.slug)} onCheckedChange={() => onCategoryChange(category.slug)} className="rounded-md" />
                  <span className="text-sm flex-1">{language === 'el' ? category.name : category.nameEn}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{category.dynamicCount}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className="border rounded-xl px-4 bg-card/50">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3"><Palette className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">{t('filter.color')}</span>
              {activeFilterCounts.colors > 0 && <Badge variant="default" className="h-5 px-1.5 text-xs">{activeFilterCounts.colors}</Badge>}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map((color) => {
                const isSelected = selectedColors.includes(color.value);
                const isGradient = color.display.pattern === 'gradient';
                const isTexture = color.display.pattern === 'texture';
                return (
                  <button key={color.value} onClick={() => onColorChange(color.value)} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left', 'hover:bg-accent/50 group', isSelected && 'bg-primary/5 ring-1 ring-primary/20')}>
                    <div className="relative">
                      <div className={cn('w-7 h-7 rounded-full border-2 transition-all shadow-sm', isSelected ? 'border-primary scale-110' : 'border-border/50 group-hover:border-border', isTexture && 'ring-2 ring-inset ring-border/30')} style={{ background: isGradient ? color.display.hex : color.display.hex, ...(isTexture && { backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23999' fill-opacity='0.15'%3E%3Cpath d='M5 0h1L0 5V0h5zM6 5v1H5L0 0h1l5 5z'/%3E%3C/g%3E%3C/svg%3E")` }) }}>
                        {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center"><Check className={cn('w-3.5 h-3.5', color.display.hex === '#FFFFFF' || color.display.hex === '#F5F5F5' || color.display.hex === '#FAFAFA' ? 'text-foreground' : 'text-white')} strokeWidth={3} /></motion.div>}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0"><span className="text-xs font-medium truncate block">{color.display.label}</span><span className="text-[10px] text-muted-foreground">{color.count} {t('products.results')}</span></div>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="materials" className="border rounded-xl px-4 bg-card/50">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3"><Layers className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">{t('filter.material')}</span>
              {activeFilterCounts.materials > 0 && <Badge variant="default" className="h-5 px-1.5 text-xs">{activeFilterCounts.materials}</Badge>}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {materialOptions.map((material) => (
                <label key={material.value} className={cn('flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all', 'hover:bg-accent/50', selectedMaterials.includes(material.value) && 'bg-primary/5 ring-1 ring-primary/20')}>
                  <Checkbox checked={selectedMaterials.includes(material.value)} onCheckedChange={() => onMaterialChange(material.value)} className="rounded-md" />
                  <span className="text-sm flex-1 truncate" title={material.value}>{material.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{material.count}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border rounded-xl px-4 bg-card/50">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center gap-3"><Euro className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">{t('filter.price')}</span>
              {activeFilterCounts.price > 0 && <Badge variant="default" className="h-5 px-1.5 text-xs">1</Badge>}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-6 pt-2">
              <Slider value={priceRange} onValueChange={onPriceChange} min={0} max={maxPrice} step={50} className="cursor-pointer" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1"><Label className="text-xs text-muted-foreground mb-1 block">{language === 'el' ? 'Από' : 'From'}</Label><div className="px-3 py-2 rounded-lg bg-muted font-medium text-sm">€{priceRange[0].toLocaleString()}</div></div>
                <div className="text-muted-foreground pt-5">—</div>
                <div className="flex-1"><Label className="text-xs text-muted-foreground mb-1 block">{language === 'el' ? 'Έως' : 'To'}</Label><div className="px-3 py-2 rounded-lg bg-muted font-medium text-sm">€{priceRange[1].toLocaleString()}</div></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 1500, 2000].map((price) => (<Button key={price} variant={priceRange[1] === price && priceRange[0] === 0 ? 'default' : 'outline'} size="sm" className="h-7 text-xs rounded-full" onClick={() => onPriceChange([0, price])}>{language === 'el' ? `Έως €${price}` : `Up to €${price}`}</Button>))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AnimatePresence>
        {hasFilters && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <Button variant="outline" onClick={onClearFilters} className="w-full rounded-xl h-11 mt-4"><X className="w-4 h-4 mr-2" />{language === 'el' ? 'Καθαρισμός Όλων των Φίλτρων' : 'Clear All Filters'}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
