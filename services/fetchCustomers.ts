import { SupabaseClient } from "@supabase/supabase-js";

interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
  country: string;
  address: string;
  created_at: string;
  stripe_customer_id: string | null;
}

export async function fetchCustomers(
  client: SupabaseClient,
  search: string | null,
  pagination: { from: number; to: number }
): Promise<{ count: number | null; data: Customer[] }> {
  const { data, count, error } = 
    search === null
      ? await client
          .from("profiles")
          .select(
            "id, name, email, image_url, country, address, created_at, stripe_customer_id",
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .range(pagination.from, pagination.to)
      : await client
          .from("profiles")
          .select(
            "id, name, email, image_url, country, address, created_at, stripe_customer_id",
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .textSearch("name", `%${search.toLowerCase().trim()}%`);

  if (error) {
    throw error;
  }

  const enrichedData = data.map((customer) => ({
    ...customer,
    hasBusiness: customer.stripe_customer_id ? "Yes" : "No",
  }));

  return { count, data: enrichedData };
}
