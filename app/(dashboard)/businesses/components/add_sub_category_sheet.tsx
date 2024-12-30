"use client";

import { CategoriesDropDown } from "@/components/category_dropdown";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  addSubBusinessCategory,
  updateSubBusinessCategory,
} from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function AddSubCategorySheet({
  subcategory,
  categoryId,
  button,
}: {
  subcategory?: BusinessSubCategory | null;
  categoryId: string | null;
  button: ReactNode;
}) {
  const client = createClient();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<string | null>(categoryId);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategory ? subcategory.name : "",
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; categoryId: string }) =>
      addSubBusinessCategory(client, data.name, data.categoryId),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: ["business_categories"],
      });
      form.reset();
      setOpenSheet(false);
      toast.success("Sub Category added successfully");
    },
    onError: (_) => {
      toast.error("Failed to add sub category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; categoryId: string }) =>
      updateSubBusinessCategory(client, data.id, data.name, data.categoryId),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: ["business_categories"],
      });
      form.reset();
      setOpenSheet(false);
      toast.success("Sub Category updated successfully");
    },
    onError: (_) => {
      toast.error("Failed to update sub category");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (category === null) {
      toast.error("Please select a category");
      return;
    }
    console.log(values);
    if (subcategory !== null && subcategory !== undefined) {
      updateMutation.mutate({
        id: subcategory.id,
        name: values.name,
        categoryId: categoryId!,
      });
    } else {
      addMutation.mutate({ name: values.name, categoryId: category });
    }
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Business SubCategory</SheetTitle>
          <SheetDescription>
            Create a new sub category to organize your businesses.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-10">
              <CategoriesDropDown
                className="mt-10"
                initialCategoryId={category}
                onChange={(value) => setCategory(value)}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <div className="flex items-center justify-center w-full mt-10">
                  <Button
                    disabled={addMutation.isPending || updateMutation.isPending}
                    loading={addMutation.isPending || updateMutation.isPending}
                    size={"lg"}
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
