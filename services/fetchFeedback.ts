import { SupabaseClient } from "@supabase/supabase-js";

interface Feedback {
  id: string;
  profile_id: string;
  rating: number;
  review: string;
  created_at: string;
  profile?: Profile;
}

interface Profile {
  id: string;
  name: string;
  image_url: string;
}

export async function fetchFeedbacks(
  client: SupabaseClient,
  search: string | null,
  pagination: { from: number; to: number }
): Promise<{ count: number | null; data: Feedback[] }> {
  let query = client
    .from("feedbacks")
    .select(
      "id, profile_id, rating, review, created_at, profiles(id, name, image_url)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(pagination.from, pagination.to);

  if (search) {
    query = query.ilike("review", `%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching feedbacks:", error);
    throw error;
  }

  const enrichedData = data?.map((feedback) => ({
    id: feedback.id,
    profile_id: feedback.profile_id,
    rating: feedback.rating,
    review: feedback.review,
    created_at: feedback.created_at,
    profile: feedback.profiles ? feedback.profiles[0] : undefined, // Extract the single profile
  }));

  return { count, data: enrichedData as Feedback[] };
}
