import { SupabaseClient } from "@supabase/supabase-js";

interface Event {
  id: string;
  business_id: string;
  category_id: string;
  image_url: string | null;
  title: string;
  start_at: string;
  description: string | null;
  address: string;
  country: string;
  created_at: string;
  type: string;
  price: number | null;
}

interface PaginationRange {
  from: number;
  to: number;
}

export async function fetchEvents(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: Event[] }> {
  let query = client
    .from("events")
    .select(
      "id, business_id, category_id, image_url, title, start_at, description, address, country, created_at, type, price",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (pagination) {
    query = query.range(pagination.from, pagination.to - 1);
  }

  const { count, data, error } = await query;

  if (error) {
    throw error;
  }

  return { count, data: data || [] };
}
