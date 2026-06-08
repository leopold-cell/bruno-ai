import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/about", "/blog", "/privacy", "/terms"];
        const { posts } = await listPublishedPosts();
        const postPaths = posts.map((p) => `/blog/${p.slug}`);
        const urls = [...staticPaths, ...postPaths]
          .map(
            (p) =>
              `  <url><loc>${p}</loc><changefreq>weekly</changefreq></url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          status: 200,
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
