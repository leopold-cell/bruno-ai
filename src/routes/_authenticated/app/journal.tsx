import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listJournalEntries, saveJournalEntry } from "@/lib/journal.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/journal")({
  head: () => ({ meta: [{ title: "Journal — Bruno" }] }),
  component: JournalPage,
});

function JournalPage() {
  const qc = useQueryClient();
  const fetchEntries = useServerFn(listJournalEntries);
  const save = useServerFn(saveJournalEntry);
  const entries = useQuery({ queryKey: ["journal"], queryFn: () => fetchEntries() });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await save({
        data: {
          title: title || null,
          body,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
        },
      });
      toast.success("Saved");
      setTitle(""); setBody(""); setTags(""); setOpen(false);
      qc.invalidateQueries({ queryKey: ["journal"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Journal">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink">Journal</h1>
          <Button onClick={() => setOpen((v) => !v)}>{open ? "Close" : "New entry"}</Button>
        </div>
        {open && (
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <Label htmlFor="t">Title (optional)</Label>
            <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
            <Label htmlFor="b" className="mt-3 block">Body</Label>
            <Textarea id="b" rows={6} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1.5" placeholder="What's on your mind?" />
            <Label htmlFor="tg" className="mt-3 block">Tags (comma-separated)</Label>
            <Input id="tg" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1.5" placeholder="anxiety, work, sleep" />
            <Button onClick={submit} disabled={!body || loading} className="mt-4 w-full">{loading ? "..." : "Save"}</Button>
          </div>
        )}
        <div className="space-y-3">
          {entries.data?.entries.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No entries yet. Write whatever's loud in your head.
            </p>
          )}
          {entries.data?.entries.map((e) => (
            <div key={e.id} className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
              {e.title && <p className="mt-1 font-display text-lg font-semibold text-ink">{e.title}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{e.body}</p>
              {e.tags && e.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
