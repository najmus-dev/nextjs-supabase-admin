"use client";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getBusinessCategories,
  getBusinessSubCategories,
} from "@/services/categories_services";
import { createClient } from "@/utils/supabase/client";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { getPagination } from "@/lib/utils";
import Loading from "@/components/loading";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { AddCategorySheet } from "./components/add_category_sheet";
import { AddSubCategorySheet } from "./components/add_sub_category_sheet";

export default function BusinessCategories() {
  const client = createClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["business_categories", pagination],
    queryFn: () =>
      getBusinessCategories(
        client,
        null,
        getPagination(pagination.pageIndex, pagination.pageSize)
      ),
  });

  // Handle loading and error states
  if (isLoading) return <Loading />;
  if (error) return <p>Error fetching categories</p>;

  const categories = categoriesData!.data;

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-xl font-medium tracking-normal">
            All Businesses
            </h2>
            <p className="text-muted-foreground">
            Here’s a list of your businesses!
            </p>
          </div>
          <div className="flex gap-5">
            <AddCategorySheet button={<Button>Add Category</Button>} />
            <AddSubCategorySheet
              button={<Button variant={"outline"}>Add SubCategory</Button>}
              categoryId={null}
            />
          </div>
        </div>
        <DataTable
          count={categoriesData?.count || 0}
          data={categories}
          columns={columns}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}




