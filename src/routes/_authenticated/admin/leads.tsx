import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listWaitlistLeads, type WaitlistLead } from "@/lib/admin.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({ meta: [{ title: "Waitlist leads — Bruno admin" }] }),
  component: AdminLeadsPage,
});

type SortKey = "created_at" | "name" | "email" | "check_score" | "source";

function toCsv(leads: WaitlistLead[]): string {
  const header = ["name", "email", "check_score", "source", "created_at", "activated_at"];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = leads.map((l) =>
    [l.name, l.email, l.check_score, l.source, l.created_at, l.activated_at].map(escape).join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

function downloadCsv(leads: WaitlistLead[]) {
  const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bruno-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminLeadsPage() {
  const fetchLeads = useServerFn(listWaitlistLeads);
  const q = useQuery({ queryKey: ["admin", "leads"], queryFn: () => fetchLeads(), retry: false });

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const leads = q.data?.leads ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = term
      ? leads.filter(
          (l) =>
            l.name.toLowerCase().includes(term) ||
            l.email.toLowerCase().includes(term) ||
            (l.source ?? "").toLowerCase().includes(term),
        )
      : leads;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...base].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [leads, search, sortKey, sortDir]);

  const stats = useMemo(() => {
    const scored = leads.filter((l) => typeof l.check_score === "number");
    const avg = scored.length
      ? Math.round(scored.reduce((s, l) => s + (l.check_score ?? 0), 0) / scored.length)
      : null;
    const last7 = leads.filter(
      (l) => Date.now() - new Date(l.created_at).getTime() < 7 * 86_400_000,
    ).length;
    return { total: leads.length, scored: scored.length, avg, last7 };
  }, [leads]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "created_at" || key === "check_score" ? "desc" : "asc");
    }
  }

  if (q.isError) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {(q.error as Error)?.message ?? "You don't have access to this page."}
        </p>
        <Link to="/" className="mt-6 text-sm font-medium text-primary underline">
          Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">Waitlist leads</h1>
            <p className="text-xs text-muted-foreground">Bruno admin · internal</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => q.refetch()} disabled={q.isFetching}>
              {q.isFetching ? "Refreshing…" : "Refresh"}
            </Button>
            <Button onClick={() => downloadCsv(filtered)} disabled={!filtered.length}>
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total leads" value={q.isLoading ? "…" : String(stats.total)} />
          <Stat label="Last 7 days" value={q.isLoading ? "…" : String(stats.last7)} />
          <Stat label="Completed check" value={q.isLoading ? "…" : String(stats.scored)} />
          <Stat label="Avg. check score" value={q.isLoading ? "…" : stats.avg == null ? "—" : `${stats.avg}`} />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Input
            placeholder="Search name, email, or source…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-muted-foreground">
            {filtered.length} shown
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Name" k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortableHead label="Email" k="email" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortableHead label="Score" k="check_score" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortableHead label="Source" k="source" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortableHead label="Joined" k="created_at" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Loading leads…
                  </TableCell>
                </TableRow>
              )}
              {!q.isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No leads {search ? "match your search" : "yet"}.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-ink">{l.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${l.email}`} className="text-primary hover:underline">
                      {l.email}
                    </a>
                  </TableCell>
                  <TableCell className="tabular-nums">{l.check_score ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{l.source ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">{value}</p>
    </div>
  );
}

function SortableHead({
  label,
  k,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 font-semibold ${active ? "text-ink" : "text-muted-foreground"}`}
      >
        {label}
        {active && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </TableHead>
  );
}
