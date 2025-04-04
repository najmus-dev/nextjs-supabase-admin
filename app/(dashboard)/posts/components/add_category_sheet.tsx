"use client";

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
  addPostCategory,
  updatePostCategory,
} from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function AddCategorySheet({
  category,
  button,
}: {
  category?: PostCategory | null;
  button: ReactNode;
}) {
  const client = createClient();
  const queryClient = useQueryClient();

  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category ? category.name : "",
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string }) => addPostCategory(client, data.name),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: ["posts_categories"],
      });
      form.reset();
      setOpenSheet(false);
      toast.success("Category added successfully");
    },
    onError: (_) => {
      toast.error("Failed to add category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      updatePostCategory(client, data.id, data.name),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: ["posts_categories"],
      });
      form.reset();
      setOpenSheet(false);
      toast.success("Category updated successfully");
    },
    onError: (_) => {
      toast.error("Failed to update category");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (category !== null && category !== undefined) {
      updateMutation.mutate({
        id: category.id,
        name: values.name,
      });
    } else {
      addMutation.mutate({ name: values.name });
    }
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {category ? "Update Posts Category" : "Add Posts Category"}
          </SheetTitle>
          <SheetDescription>
            {category
              ? "Update category to organize your posts"
              : "Create a new category to organize your posts."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-10 flex flex-col gap-10">
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
