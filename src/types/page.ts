export interface BlogPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // markdown content
  author?: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  image_url?: string;
  published?: boolean;
}
