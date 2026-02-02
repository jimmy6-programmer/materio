"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Pencil, Trash, ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "@/lib/actions";
import { Product } from "@/lib/queries/products";
import { ProductForm } from "./product-form";
import { toast } from "sonner";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async (productData: any) => {
    try {
      // Get category ID from name
      const categories = await getCategories();
      const category = categories.find(c => c.name === productData.category);
      if (!category) {
        throw new Error('Category not found');
      }

      // Build payload matching Product type in DB
      const payload: any = {
        name: productData.name,
        description: productData.description,
        category_id: category.id,
        price: productData.price,
        image: productData.image,
        images: productData.images || [],
        rating: typeof productData.rating === 'number' ? productData.rating : Number(productData.rating) || 0,
        reviews: typeof productData.reviews === 'number' ? productData.reviews : parseInt(productData.reviews) || 0,
        discount: productData.discount !== undefined ? Number(productData.discount) : null,
        specifications: productData.specifications || {},
        features: productData.features || [],
        variants: productData.variants || [],
      };

      await createProduct(payload);
      const data = await getProducts();
      setProducts(data);
      toast.success('Product created successfully');
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      // Get category ID from name
      const categories = await getCategories();
      const category = categories.find(c => c.name === productData.category);
      if (!category) {
        throw new Error('Category not found');
      }

      const payload: any = {
        name: productData.name,
        description: productData.description,
        category_id: category.id,
        price: productData.price,
        image: productData.image,
        images: productData.images || undefined,
        rating: productData.rating !== undefined ? Number(productData.rating) : undefined,
        reviews: productData.reviews !== undefined ? Number(productData.reviews) : undefined,
        discount: productData.discount !== undefined ? Number(productData.discount) : undefined,
        specifications: productData.specifications !== undefined ? productData.specifications : undefined,
        features: productData.features !== undefined ? productData.features : undefined,
        variants: productData.variants !== undefined ? productData.variants : undefined,
      };

      await updateProduct(id, payload);
      const data = await getProducts();
      setProducts(data);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.id}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary">{(row.original as any).category || 'N/A'}</Badge>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.price.toFixed(2)}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setCurrentProduct(product);
                setIsEditOpen(true);
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for your new product.
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsAddOpen(false)} onSubmit={handleCreateProduct} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading products...</div>
        </div>
      ) : (
        <DataTable columns={columns} data={products} searchKey="name" />
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <ProductForm
              initialData={currentProduct}
              onSuccess={() => setIsEditOpen(false)}
              onSubmit={(data) => handleUpdateProduct(currentProduct.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
