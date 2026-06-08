// Shared blog content schema. This is the contract between the website (which
// renders posts) and the bruno-autopilot (which generates posts as JSON and
// writes them to the `blog_posts` table). Keep these types in sync with the
// autopilot's content generator output.

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  category: "Anxiety" | "Depression" | "CBT" | "Sleep" | "Self-check";
  tldr: string[];
  body: BlogBlock[];
};

// Shape of a row coming back from Supabase `blog_posts` (snake_case).
export type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  reading_minutes: number;
  tldr: unknown;
  body: unknown;
  published_at: string | null;
  created_at: string;
};

// Map a DB row to the BlogPost shape the UI components already expect.
export function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    description: row.description,
    category: row.category as BlogPost["category"],
    readingMinutes: row.reading_minutes,
    publishedAt: row.published_at ?? row.created_at,
    tldr: Array.isArray(row.tldr) ? (row.tldr as string[]) : [],
    body: Array.isArray(row.body) ? (row.body as BlogBlock[]) : [],
  };
}
