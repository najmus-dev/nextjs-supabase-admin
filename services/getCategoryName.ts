import { SupabaseClient } from "@supabase/supabase-js";

export async function getCategoryNameById(
  client: SupabaseClient,
  categoryId: string
): Promise<string | null> {
  try {
    const trimmedCategoryId = categoryId.trim();
    console.log("Fetching category for UUID:", trimmedCategoryId);

    const { data, error } = await client
      .from("business_categories")
      .select("name")
      .eq("id", trimmedCategoryId);

    console.log("Supabase Response Data:", data);
    console.log("Supabase Response Error:", error);

    if (error) {
      throw new Error(error.message || "Error fetching category name");
    }

    if (!data || data.length === 0) {
      console.error("No category found for the given ID:", trimmedCategoryId);
      return null;
    }

    return data[0].name || null;
  } catch (error: any) {
    console.error("Error fetching category name:", error.message || error);
    return null;
  }
}
