
import { SupabaseClient } from "@supabase/supabase-js";

interface PaginationRange {
  from: number;
  to: number;
}

interface Business {
  id: string;
  user_id: string;
  name: string;
  phone_number: string | null;
  owner_name: string | null;
  years_in_business: number | null;
  bio: string | null;
  address: string | null;
  country: string | null;
  socials: string | null;
  is_registered: boolean;
  proof_url: string | null;
  status: string;
  created_at: string;
  is_hiring: boolean;
  category_id: string;
  image_url: string | null;
  stripe_connect_id: string | null;
  business_categories?: { name: string }[];  // Add this line
}

// interface Business {
//   id: string;
//   user_id: string;
//   name: string;
//   phone_number: string | null;
//   owner_name: string | null;
//   years_in_business: number | null;
//   bio: string | null;
//   address: string | null;
//   country: string | null;
//   socials: string | null;
//   is_registered: boolean;
//   proof_url: string | null;
//   status: string;
//   created_at: string;
//   is_hiring: boolean;
//   category_id: string;
//   image_url: string | null;
//   stripe_connect_id: string | null;
// }

// export async function fetchBusinesses(
//   client: SupabaseClient,
//   search: string | null,
//   pagination: PaginationRange | null
// ): Promise<{ count: number | null; data: Business[] }> {
//   const { count, data, error } =
//     search === null
//       ? await client
//           .from("businesses")
//           .select(
//             "id, user_id, name, phone_number, owner_name, years_in_business, bio, address, country, socials, is_registered, proof_url, status, created_at, is_hiring, category_id, image_url, stripe_connect_id",
//             { count: "exact" }
//           )
//           .range(pagination!.from, pagination!.to)
//           .order("created_at", { ascending: false })
//       : await client
//           .from("businesses")
//           .select(
//             "id, user_id, name, phone_number, owner_name, years_in_business, bio, address, country, socials, is_registered, proof_url, status, created_at, is_hiring, category_id, image_url, stripe_connect_id",
//             { count: "exact" }
//           )
//           .order("created_at", { ascending: false })
//           .textSearch("name", `%${search.toLowerCase().trim()}%`);

//   if (error) {
//     throw error;
//   }

//   return { count, data: data || [] };
// }

export async function fetchBusinesses(
  client: SupabaseClient,
  search: string | null,
  pagination: PaginationRange | null
): Promise<{ count: number | null; data: Business[] }> {

  const { count, data, error } = search === null
    ? await client
        .from("businesses")
        .select(`
          id, user_id, name, phone_number, owner_name, years_in_business, bio, address, country, socials, 
          is_registered, proof_url, status, created_at, is_hiring, category_id, image_url, stripe_connect_id,
          business_categories(name)`)  // Add business_categories here
        .range(pagination!.from, pagination!.to)
        .order("created_at", { ascending: false })
    : await client
        .from("businesses")
        .select(`
          id, user_id, name, phone_number, owner_name, years_in_business, bio, address, country, socials, 
          is_registered, proof_url, status, created_at, is_hiring, category_id, image_url, stripe_connect_id,
          business_categories(name)`)  // Add business_categories here
        .order("created_at", { ascending: false })
        .textSearch("name", `%${search.toLowerCase().trim()}%`);

  if (error) {
    throw error;
  }

  return { count, data: data || [] };
}
