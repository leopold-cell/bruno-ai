import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/blog.functions";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const staticEntries = [
          { path: "/", changefreq: "daily" },
          { path: "/blog", changefreq: "daily" },
          { path: "/about", changefreq: "monthly" },
          { path: "/privacy", changefreq: "yearly" },
          { path: "/terms", changefreq: "yearly" },
        ];
        const { posts } = await listPublishedPosts();

        const staticUrls = staticEntries.map(
          (e) =>
            `  <url><loc>${SITE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq></url>`,
        );
        const postUrls = posts.map(
          (p) =>
            `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${(p.publishedAt || today).slice(0, 10)}</lastmod><changefreq>monthly</changefreq></url>`,
        );

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...postUrls].join("\n")}\n</urlset>`;
        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
