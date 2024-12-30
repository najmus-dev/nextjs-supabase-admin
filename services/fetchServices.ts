

import { SupabaseClient } from "@supabase/supabase-js";

interface Service {
  id: string;
  business_id: string;
  category_id: string;
  sub_category_id: string | null;
  image_url: string | null;
  title: string;
  price_type: string;
  fixed_price: number | null;
  min_price_range: number | null;
  max_price_range: number | null;
  price_duration: string | null;
  description: string | null;
  address: string;
  country: string;
  created_at: string;
  accepting_bookings: boolean;
}

interface PaginationRange {
  from: number;
  to: number;
}

export async function fetchServices(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: Service[] }> {
  let query = client
    .from("services")
    .select(
      "id, business_id, category_id, sub_category_id, image_url, title, price_type, fixed_price, min_price_range, max_price_range, price_duration, description, address, country, created_at, accepting_bookings",
      { count: "exact" }
    );

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (pagination) {
    query = query.range(pagination.from, pagination.to - 1);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return { count, data: data || [] };
}
