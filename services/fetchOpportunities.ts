import { SupabaseClient } from "@supabase/supabase-js";

interface Opportunity {
  id: string;
  category_id: string;
  image_url: string | null;
  title: string;
  description: string | null;
  address: string;
  country: string;
  created_at: string;
  business_id: string;
}

interface PaginationRange {
  from: number;
  to: number;
}

export async function fetchOpportunities(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: Opportunity[] }> {
  const { count, data, error } = 
    search === null
      ? await client
          .from("opportunities")
          .select(
            "id, category_id, image_url, title, description, address, country, created_at, business_id",
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .range(pagination!.from, pagination!.to)
      : await client
          .from("opportunities")
          .select(
            "id, category_id, image_url, title, description, address, country, created_at, business_id",
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .textSearch("title", `%${search.toLowerCase().trim()}%`);

  if (error) {
    throw error;
  }

  return { count, data: data || [] };
}
