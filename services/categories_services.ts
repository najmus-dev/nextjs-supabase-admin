import { SupabaseClient } from "@supabase/supabase-js";

export async function getBusinessCategories(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: BusinessCategory[] }> {
  const { count, data, error } =
    search === null
      ? await client
          .from("business_categories")
          .select("*", { count: "exact" })
          .range(pagination!.from, pagination!.to)
          .order("created_at", { ascending: false })
      : await client
          .from("business_categories")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .textSearch("name", `%${search.toLowerCase().trim()}%`);
  if (error) {
    throw error;
  }
  console.log("count", count);

  // Fetch the subcategories for each category
  const categoriesWithSubcategories = await Promise.all(
    data.map(async (category) => {
      const { data: subCategories } = await getBusinessSubCategories(
        client,
        category.id
      );

      return { ...category, subCategories };
    })
  );

  return { count: count, data: categoriesWithSubcategories };
}

export async function getBusinessSubCategories(
  client: SupabaseClient,
  id: string
): Promise<{ data: BusinessSubCategory[] }> {
  const { data, error } = await client
    .from("business_sub_categories")
    .select("*")
    .eq("category_id", id)
    .order("created_at", { ascending: false })
    .returns<BusinessSubCategory[]>();
  if (error) {
    throw error;
  }
  return { data: data };
}

export async function addBusinessCategory(
  client: SupabaseClient,
  name: string,
  isFeatured: boolean
): Promise<void> {
  const { error } = await client.from("business_categories").insert({
    name: name,
    is_featured: isFeatured,
  });
  if (error) {
    throw error;
  }
}

export async function updateBusinessCategory(
  client: SupabaseClient,
  id: string,
  name: string,
  isFeatured: boolean
): Promise<void> {
  const { error } = await client
    .from("business_categories")
    .update({
      name: name,
      is_featured: isFeatured,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
}

export async function addSubBusinessCategory(
  client: SupabaseClient,
  name: string,
  categoryId: string
): Promise<void> {
  const { error } = await client.from("business_sub_categories").insert({
    name: name,
    category_id: categoryId,
  });
  if (error) {
    throw error;
  }
}

export async function updateSubBusinessCategory(
  client: SupabaseClient,
  id: string,
  name: string,
  categoryId: string
): Promise<void> {
  const { error } = await client
    .from("business_sub_categories")
    .update({
      name: name,
      category_id: categoryId,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteBusinessCategory(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client
    .from("business_categories")
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteBusinessSubCategory(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client
    .from("business_sub_categories")
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
}

export async function getPostsCategories(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: PostCategory[] }> {
  const { count, data, error } =
    search === null
      ? await client
          .from("post_categories")
          .select("*", { count: "exact" })
          .range(pagination!.from, pagination!.to)
          .order("created_at", { ascending: false })
      : await client
          .from("post_categories")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .textSearch("name", `%${search.toLowerCase().trim()}%`);
  if (error) {
    throw error;
  }

  return { count: count, data: data };
}

export async function addPostCategory(
  client: SupabaseClient,
  name: string
): Promise<void> {
  const { error } = await client.from("post_categories").insert({
    name: name,
  });
  if (error) {
    throw error;
  }
}

export async function updatePostCategory(
  client: SupabaseClient,
  id: string,
  name: string
): Promise<void> {
  const { error } = await client
    .from("post_categories")
    .update({
      name: name,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deletePostCategory(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client.from("post_categories").delete().eq("id", id);
  if (error) {
    throw error;
  }
}
