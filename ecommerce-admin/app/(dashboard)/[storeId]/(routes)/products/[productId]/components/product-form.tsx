"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { SelectField } from "@/components/select-field";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client"
import axios from "axios";
import { log } from "console";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod"

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData, 
    categories, 
    sizes, 
    colors
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false
        }
    });

    const onDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            setLoading(false);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success('Product deleted.')
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard.")
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)   
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
        router.refresh();
        router.push(`/${params.storeId}/products`)
        setLoading(false);
        toast.success(toastMessage);
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setLoading(false);
      }
    }

    return(
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                               <FormMessage /> 
                            </FormItem>
                        )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading} 
                                        placeholder="Product name" 
                                        {...field} 
                                    />
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
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number" 
                                        disabled={loading} 
                                        placeholder="9.99" 
                                        {...field} 
                                    />
                                </FormControl>
                               <FormMessage /> 
                            </FormItem>
                        )}
                    />
                     <SelectField
                        label="Categpry" 
                        control={form.control}
                        name="categoryId"
                        disabled={loading}
                        placeholder="Select a category"
                        data={categories}
                     />
                     <SelectField
                        label="Size" 
                        control={form.control}
                        name="sizeId"
                        disabled={loading}
                        placeholder="Select size"
                        data={sizes}
                     />
                     <SelectField
                        label="Color" 
                        control={form.control}
                        name="colorId"
                        disabled={loading}
                        placeholder="Select color"
                        data={colors}
                     />
                      <FormField 
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem 
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Featured
                                </FormLabel>
                                <FormDescription>
                                    This product will appear on the home page.
                                </FormDescription>
                              </div>
                            </FormItem>
                        )}
                    />
                     <FormField 
                        control={form.control}
                        name="isArchived"
                        render={({ field }) => (
                            <FormItem 
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Archived
                                </FormLabel>
                                <FormDescription>
                                    This product will not appear anywhere in the store.
                                </FormDescription>
                              </div>
                            </FormItem>
                        )}
                    />
                </div>
                <Button 
                    disabled={loading}
                    className="ml-auto"
                    type="submit"
                >
                    {action}
                </Button>
             </form>
            </Form>
        </>
    )
}