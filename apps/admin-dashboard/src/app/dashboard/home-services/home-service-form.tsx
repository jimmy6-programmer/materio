"use client";

import { useForm, type Resolver } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const schema = z.object({
  title: z.string().min(2),
  category: z.string().min(1),
  description: z.string().optional(),
  price_from: z.coerce.number().min(0),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export function HomeServiceForm({ initialData, onSubmit, onSuccess }: { initialData?: any, onSubmit?: (data: any) => Promise<void>, onSuccess?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initialData ? {
      title: initialData.title || "",
      category: initialData.category || "",
      description: initialData.description || "",
      price_from: initialData.price_from || 0,
      image_url: initialData.image_url || "",
      status: initialData.status || "draft",
    } : {
      title: "",
      category: "",
      description: "",
      price_from: 0,
      image_url: "",
      status: "draft",
    }
  });

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `home-services/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      form.setValue('image_url', url);
      setImagePreview(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      toast.success('Saved');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="price_from" render={({ field }) => (
          <FormItem>
            <FormLabel>Price From</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="image_url" render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <div>
                <div className="flex items-center gap-4">
                  <input id="hs-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('hs-image-upload')?.click()}>
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                {imagePreview && (
                  <div className="mt-3 relative w-full max-w-xs">
                    <Image src={imagePreview} alt="preview" width={300} height={200} className="rounded-md object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => { setImagePreview(null); form.setValue('image_url', ''); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <select {...field} className="w-full border rounded-md p-2">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div>
          <Button type="submit" className="w-full">Save</Button>
        </div>
      </form>
    </Form>
  );
}
