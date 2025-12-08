import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Package, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useProductsQuery, useCategoriesQuery, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { Product, ProductImage } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const { isAdmin } = useAuth();
  
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: product.id, updates: product });
        toast.success('Το προϊόν ενημερώθηκε επιτυχώς');
      } else {
        await createProduct.mutateAsync(product);
        toast.success('Το προϊόν δημιουργήθηκε επιτυχώς');
      }
      setEditingProduct(null);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Σφάλμα κατά την αποθήκευση');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success('Το προϊόν διαγράφηκε');
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
          <h1 className="font-display text-3xl font-semibold">Προϊόντα</h1>
          <p className="text-muted-foreground mt-1">
            Διαχειριστείτε τον κατάλογο προϊόντων ({products.length} προϊόντα)
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Νέο Προϊόν
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="py-4">
            <p className="text-amber-700 text-sm">
              Δεν έχετε δικαιώματα διαχειριστή. Μπορείτε μόνο να προβάλετε τα προϊόντα.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση προϊόντων..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Εικόνα</TableHead>
                <TableHead>Όνομα</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>Τιμή</TableHead>
                <TableHead>Διαστάσεις</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">€{product.basePrice.toLocaleString()}</p>
                      {product.salePrice && (
                        <p className="text-sm text-destructive">
                          Sale: €{product.salePrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.dimensions.length} παραλλαγές</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.featured && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          Featured
                        </span>
                      )}
                      {product.inStock ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Out
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Επεξεργασία
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <a href={`/product/${product.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Προβολή
                          </a>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(product.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Διαγραφή
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <ProductEditDialog
        product={editingProduct}
        categories={categories}
        open={!!editingProduct || isCreateOpen}
        onClose={() => {
          setEditingProduct(null);
          setIsCreateOpen(false);
        }}
        onSave={handleSave}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Προϊόντος</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Ακύρωση
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? 'Διαγραφή...' : 'Διαγραφή'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Image Upload Component
interface ImageUploadSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

function ImageUploadSection({ images, onImagesChange }: ImageUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: ProductImage[] = [...images];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`Το αρχείο ${file.name} δεν είναι εικόνα`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Το αρχείο ${file.name} είναι πολύ μεγάλο (max 5MB)`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Αποτυχία upload: ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        newImages.push({
          id: crypto.randomUUID(),
          url: imageUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          isPrimary: newImages.length === 0, // First image is primary
        });
      }

      onImagesChange(newImages);
      toast.success('Οι εικόνες ανέβηκαν επιτυχώς');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Σφάλμα κατά το upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove && imageToRemove.url.includes('product-images')) {
      // Extract file path from URL and delete from storage
      try {
        const urlParts = imageToRemove.url.split('/product-images/');
        if (urlParts[1]) {
          await supabase.storage.from('product-images').remove([urlParts[1]]);
        }
      } catch (error) {
        console.error('Failed to delete from storage:', error);
      }
    }
    
    const newImages = images.filter(img => img.id !== imageId);
    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onImagesChange(newImages);
  };

  const handleSetPrimary = (imageId: string) => {
    const newImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Εικόνες Προϊόντος
      </Label>
      
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <div 
              key={image.id} 
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all",
                image.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border"
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetPrimary(image.id)}
                    title="Ορισμός ως κύρια"
                  >
                    ★
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(image.id)}
                  title="Διαγραφή"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {image.isPrimary && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Κύρια
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Ανέβασμα...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Ανέβασμα Εικόνων
            </>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          Υποστηριζόμενες μορφές: JPG, PNG, WebP (max 5MB)
        </span>
      </div>
    </div>
  );
}

interface ProductEditDialogProps {
  product: Product | null;
  categories: { id: string; name: string; slug: string }[];
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  isLoading: boolean;
}

function ProductEditDialog({ product, categories, open, onClose, onSave, isLoading }: ProductEditDialogProps) {
  const getDefaultFormData = () => ({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    category: 'cabinet',
    subcategory: '',
    basePrice: 0,
    salePrice: undefined,
    images: [] as { id: string; url: string; alt: string; isPrimary: boolean }[],
    dimensions: [{ id: 'dim-1', width: 60, height: 45, depth: 40, price: 0, sku: '' }],
    materials: [] as string[],
    colors: [] as string[],
    features: [] as string[],
    inStock: true,
    featured: false,
    bestSeller: false,
  });
  
  const [formData, setFormData] = useState<Partial<Product>>(getDefaultFormData());

  // CRITICAL: Reset form data when product changes or dialog opens
  useEffect(() => {
    if (open) {
      if (product) {
        // Deep clone the product to avoid mutating the original
        setFormData({
          ...product,
          images: [...(product.images || [])],
          dimensions: [...(product.dimensions || [])],
          materials: [...(product.materials || [])],
          colors: [...(product.colors || [])],
          features: [...(product.features || [])],
        });
      } else {
        setFormData(getDefaultFormData());
      }
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
    
    // Ensure all required fields are present
    const completeProduct: Product = {
      id: product?.id || crypto.randomUUID(),
      name: formData.name || '',
      nameEn: formData.nameEn || '',
      slug,
      description: formData.description || '',
      descriptionEn: formData.descriptionEn || '',
      category: formData.category || 'cabinet',
      subcategory: formData.subcategory,
      basePrice: formData.basePrice || 0,
      salePrice: formData.salePrice,
      images: formData.images || [],
      dimensions: formData.dimensions || [],
      materials: formData.materials || [],
      colors: formData.colors || [],
      features: formData.features || [],
      inStock: formData.inStock ?? true,
      featured: formData.featured ?? false,
      bestSeller: formData.bestSeller ?? false,
      createdAt: product?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(completeProduct);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {product ? 'Επεξεργασία Προϊόντος' : 'Νέο Προϊόν'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Όνομα (GR)</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Name (EN)</Label>
              <Input
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="epiplo-963"
              />
            </div>
            <div className="space-y-2">
              <Label>Κατηγορία</Label>
              <select
                value={formData.category || 'cabinet'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Περιγραφή (GR)</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Image Upload Section */}
          <ImageUploadSection
            images={formData.images || []}
            onImagesChange={(images) => setFormData({ ...formData, images })}
          />

          <div className="space-y-2">
            <Label>Χρώματα (διαχωρισμένα με κόμμα)</Label>
            <Input
              value={formData.colors?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
              placeholder="Oak Vanilla, White, Interior Grey"
            />
          </div>

          <div className="space-y-2">
            <Label>Υλικά (διαχωρισμένα με κόμμα)</Label>
            <Input
              value={formData.materials?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
              placeholder="CDF Swiss Krono, Corian"
            />
          </div>

          <div className="space-y-2">
            <Label>Χαρακτηριστικά (διαχωρισμένα με κόμμα)</Label>
            <Input
              value={formData.features?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
              placeholder="LED φωτισμός, Soft-close συρτάρια"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Βασική Τιμή (€)</Label>
              <Input
                type="number"
                value={formData.basePrice || ''}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Τιμή Έκπτωσης (€)</Label>
              <Input
                type="number"
                value={formData.salePrice || ''}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) || undefined })}
                placeholder="Προαιρετικό"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <Label>Διαστάσεις & Παραλλαγές</Label>
            {formData.dimensions?.map((dim, index) => (
              <div key={dim.id} className="grid grid-cols-5 gap-2 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs">Πλάτος (cm)</Label>
                  <Input
                    type="number"
                    value={dim.width}
                    onChange={(e) => {
                      const newDims = [...(formData.dimensions || [])];
                      newDims[index] = { ...dim, width: Number(e.target.value) };
                      setFormData({ ...formData, dimensions: newDims });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Ύψος (cm)</Label>
                  <Input
                    type="number"
                    value={dim.height}
                    onChange={(e) => {
                      const newDims = [...(formData.dimensions || [])];
                      newDims[index] = { ...dim, height: Number(e.target.value) };
                      setFormData({ ...formData, dimensions: newDims });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Βάθος (cm)</Label>
                  <Input
                    type="number"
                    value={dim.depth}
                    onChange={(e) => {
                      const newDims = [...(formData.dimensions || [])];
                      newDims[index] = { ...dim, depth: Number(e.target.value) };
                      setFormData({ ...formData, dimensions: newDims });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Τιμή (€)</Label>
                  <Input
                    type="number"
                    value={dim.price}
                    onChange={(e) => {
                      const newDims = [...(formData.dimensions || [])];
                      newDims[index] = { ...dim, price: Number(e.target.value) };
                      setFormData({ ...formData, dimensions: newDims });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={dim.sku}
                    onChange={(e) => {
                      const newDims = [...(formData.dimensions || [])];
                      newDims[index] = { ...dim, sku: e.target.value };
                      setFormData({ ...formData, dimensions: newDims });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newDim = {
                  id: `dim-${Date.now()}`,
                  width: 60,
                  height: 45,
                  depth: 40,
                  price: formData.basePrice || 0,
                  sku: '',
                };
                setFormData({
                  ...formData,
                  dimensions: [...(formData.dimensions || []), newDim],
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Προσθήκη Διάστασης
            </Button>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
              <Label>Σε Απόθεμα</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.bestSeller}
                onCheckedChange={(checked) => setFormData({ ...formData, bestSeller: checked })}
              />
              <Label>Best Seller</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Αποθήκευση...' : product ? 'Αποθήκευση' : 'Δημιουργία'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
