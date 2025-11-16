import { createBrowserClient } from "@supabase/ssr";
import type { BlogPage } from "@/types/page";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Blog Pages functions for client components
export async function getAllPages(): Promise<BlogPage[]> {
  const client = createClient();

  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getPageBySlug(slug: string): Promise<BlogPage | null> {
  const client = createClient();

  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}
