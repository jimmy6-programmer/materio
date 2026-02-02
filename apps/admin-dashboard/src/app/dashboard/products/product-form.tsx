"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getCategories, Category } from "../../../lib/queries/categories";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  category: z.string().min(1, "Please select a category"),
  rating: z.coerce.number().min(0).max(5),
  reviews: z.coerce.number().min(0).int(),
  discount: z.coerce.number().min(0).optional(),
  specifications: z.string().refine(val => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, "Invalid JSON"),
  features: z.string(),
  variants: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;
export function ProductForm({ initialData, onSuccess, onSubmit }: { initialData?: any, onSuccess: () => void, onSubmit?: (data: any) => Promise<void> }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [images, setImages] = useState<File[]>([]); // newly selected files
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // remote URLs from initialData
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // local previews for selected files
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (initialData) {
      const existingImages = initialData.images && initialData.images.length > 0 ? initialData.images : (initialData.image ? [initialData.image] : []);
      setExistingImageUrls(existingImages);
      setPreviewUrls([]);
      setImages([]);
    }
  }, [initialData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowed = files.slice(0, 5 - (existingImageUrls.length + previewUrls.length));
    const newImages = [...images, ...allowed];
    setImages(newImages);

    // Create preview URLs for newly selected files and append
    const newPreviewUrls = allowed.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Determine if index targets an existing remote image or a preview
    if (index < existingImageUrls.length) {
      setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const previewIndex = index - existingImageUrls.length;
      setPreviewUrls(prev => prev.filter((_, i) => i !== previewIndex));
      setImages(prev => prev.filter((_, i) => i !== previewIndex));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('images') // Assuming bucket name is 'images'
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
  };

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      description: initialData.description || "",
      price: initialData.price || 0,
      category: initialData.category || "",
      rating: initialData.rating || 0,
      reviews: initialData.reviews || 0,
      discount: initialData.discount,
      specifications: JSON.stringify(initialData.specifications || {}),
      features: (initialData.features || []).join('\n'),
      variants: (initialData.variants || []).join('\n'),
    } : {
      name: "",
      description: "",
      price: 0,
      category: "",
      rating: 0,
      reviews: 0,
      discount: undefined,
      specifications: "{}",
      features: "",
      variants: "",
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      // Upload new files and combine with existing remote URLs
      let uploaded: string[] = [];
      if (images.length > 0) {
        uploaded = await uploadImages();
      }

      const finalImages = [...existingImageUrls, ...uploaded];

      // Parse specification JSON and arrays
      let specifications: any = {};
      try { specifications = JSON.parse(values.specifications); } catch { specifications = {}; }
      const featuresArray = values.features ? values.features.split('\n').map(s => s.trim()).filter(Boolean) : [];
      const variantsArray = values.variants ? values.variants.split('\n').map(s => s.trim()).filter(Boolean) : [];

      const productData = {
        ...values,
        image: finalImages.length > 0 ? finalImages[0] : undefined,
        images: finalImages,
        specifications,
        features: featuresArray,
        variants: variantsArray,
      };

      if (onSubmit) {
        await onSubmit(productData);
      } else {
        // Fallback mock
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(productData);
        toast.success(initialData ? "Product updated" : "Product created");
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create product');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g. Wireless Headphones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  name={field.name}
                  onBlur={field.onBlur}
                  value={field.value === null || field.value === undefined ? "" : String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Images</FormLabel>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {(() => {
            const displayedUrls = [...existingImageUrls, ...previewUrls];
            return displayedUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayedUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {displayedUrls.length < 5 && (
                  <div
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Add more</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to upload images</p>
              </div>
            );
          })()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value === null || field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviews</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value === null || field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value === null || field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specifications (JSON)</FormLabel>
              <FormControl>
                <Textarea placeholder='{"color":"red","size":"M"}' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (one per line)</FormLabel>
              <FormControl>
                <Textarea placeholder={"Feature 1\nFeature 2"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variants (one per line)</FormLabel>
              <FormControl>
                <Textarea placeholder={"Variant A\nVariant B"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
