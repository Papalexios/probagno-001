import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types/product';
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

export default function AdminProducts() {
  const { products, updateProduct, deleteProduct, addProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product.id, product);
      toast.success('Το προϊόν ενημερώθηκε επιτυχώς');
    } else {
      addProduct(product);
      toast.success('Το προϊόν δημιουργήθηκε επιτυχώς');
    }
    setEditingProduct(null);
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    toast.success('Το προϊόν διαγράφηκε');
  };

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
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Νέο Προϊόν
        </Button>
      </div>

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
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Επεξεργασία
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/product/${product.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Προβολή
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Διαγραφή
                        </DropdownMenuItem>
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
        open={!!editingProduct || isCreateOpen}
        onClose={() => {
          setEditingProduct(null);
          setIsCreateOpen(false);
        }}
        onSave={handleSave}
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
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

function ProductEditDialog({ product, open, onClose, onSave }: ProductEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      category: 'vanities',
      basePrice: 0,
      images: [],
      dimensions: [{ id: 'dim-1', width: 60, height: 45, depth: 40, price: 0, sku: '' }],
      materials: [],
      colors: [],
      features: [],
      inStock: true,
      featured: false,
      bestSeller: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    onSave({
      id: product?.id || `prod-${Date.now()}`,
      createdAt: product?.createdAt || now,
      updatedAt: now,
      ...formData,
    } as Product);
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
                value={formData.category || 'vanities'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="vanities">Έπιπλα Μπάνιου</option>
                <option value="mirrors">Καθρέπτες</option>
                <option value="cabinets">Ντουλάπια</option>
                <option value="accessories">Αξεσουάρ</option>
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
            <Button type="submit">
              {product ? 'Αποθήκευση' : 'Δημιουργία'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
