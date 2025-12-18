import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderTree, Package, Loader2 } from 'lucide-react';
import { useProductsQuery, useCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useProducts';
import { Category } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminCategories() {
  // Use Supabase data for accurate counts
  const { data: dbProducts = [] } = useProductsQuery();
  const { data: dbCategories = [], isLoading } = useCategoriesQuery();
  
  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Build categories with accurate counts from Supabase data
  const categoriesWithCounts = dbCategories.map(cat => {
    const tagMap: Record<string, string> = {
      'led-mirrors': 'Καθρέπτης LED',
      'mirror-cabinets': 'Καθρέπτης με ντουλάπι',
      'bathroom-columns': 'Κολώνα μπάνιου',
      'metal-bases': 'Μεταλλική βάση',
      'cabinets': 'Ντουλάπι',
      'drawers': 'Συρτάρι',
    };
    
    let count = 0;
    if (cat.slug === 'all') {
      count = dbProducts.length;
    } else {
      const tagToMatch = tagMap[cat.slug];
      if (tagToMatch) {
        count = dbProducts.filter(p => p.tags?.includes(tagToMatch)).length;
      } else {
        count = dbProducts.filter(p => p.category === cat.slug).length;
      }
    }
    
    return { ...cat, productCount: count };
  });

  const getProductCount = (slug: string) => {
    const found = categoriesWithCounts.find(c => c.slug === slug);
    return found?.productCount || 0;
  };

  const handleSave = async (category: Category) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: category.id, updates: category });
        toast.success('Η κατηγορία ενημερώθηκε');
      } else {
        await createCategory.mutateAsync(category);
        toast.success('Η κατηγορία δημιουργήθηκε');
      }
      setEditingCategory(null);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά την αποθήκευση');
    }
  };

  const handleDelete = async (id: string) => {
    const category = categoriesWithCounts.find(c => c.id === id);
    const count = category ? category.productCount : 0;
    if (count > 0) {
      toast.error(`Δεν μπορείτε να διαγράψετε κατηγορία με ${count} προϊόντα`);
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await deleteCategoryMutation.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success('Η κατηγορία διαγράφηκε');
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά τη διαγραφή');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Κατηγορίες</h1>
          <p className="text-muted-foreground mt-1">
            Διαχειριστείτε τις κατηγορίες προϊόντων ({categoriesWithCounts.length} κατηγορίες)
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Νέα Κατηγορία
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithCounts.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderTree className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirm(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.nameEn}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  {getProductCount(category.slug)} προϊόντα
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <CategoryDialog
        category={editingCategory}
        open={!!editingCategory || isCreateOpen}
        onClose={() => {
          setEditingCategory(null);
          setIsCreateOpen(false);
        }}
        onSave={handleSave}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Κατηγορίας</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;
              Βεβαιωθείτε ότι δεν έχει προϊόντα.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Ακύρωση
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? 'Διαγραφή...' : 'Διαγραφή'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CategoryDialogProps {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  isLoading?: boolean;
}

function CategoryDialog({ category, open, onClose, onSave, isLoading }: CategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
  });

  // Reset form when dialog opens with a category
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          nameEn: category.nameEn,
          slug: category.slug,
          description: category.description || '',
        });
      } else {
        setFormData({
          name: '',
          nameEn: '',
          slug: '',
          description: '',
        });
      }
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || formData.slug.trim() === '') {
      toast.error('Το slug είναι υποχρεωτικό');
      return;
    }
    
    onSave({
      id: category?.id || crypto.randomUUID(),
      name: formData.name || '',
      nameEn: formData.nameEn || '',
      slug: formData.slug || '',
      description: formData.description,
      productCount: category?.productCount || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Επεξεργασία Κατηγορίας' : 'Νέα Κατηγορία'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Όνομα (GR)</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Έπιπλα Μπάνιου"
            />
          </div>

          <div className="space-y-2">
            <Label>Name (EN)</Label>
            <Input
              value={formData.nameEn || ''}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              placeholder="Bathroom Vanities"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug (URL)</Label>
            <Input
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="vanities"
            />
            <p className="text-xs text-muted-foreground">
              URL identifier (e.g., vanities). Must be unique.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Περιγραφή</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Περιγραφή κατηγορίας..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Αποθήκευση...' : category ? 'Αποθήκευση' : 'Δημιουργία'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
