import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BlogPage } from "@/types/page";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Blog Pages functions
export async function getPageBySlug(slug: string): Promise<BlogPage | null> {
  const client = await createClient();

  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getAllPages(): Promise<BlogPage[]> {
  const client = await createClient();

  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getPageSlugs(): Promise<string[]> {
  const client = await createClient();

  const { data, error } = await client
    .from("pages")
    .select("slug")
    .eq("published", true);

  if (error) return [];
  return data.map(p => p.slug);
}
