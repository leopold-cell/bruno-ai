import { Link } from "@tanstack/react-router";
import { BrunoMark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <BrunoMark className="h-8 w-8" />
            <span className="font-display text-xl font-semibold tracking-tight">bruno</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A pocket CBT coach for the moments therapy can't reach. Built on cognitive behavioral therapy. Private by design. Not a replacement for professional care — if you're in crisis, please call or text <a className="underline" href="tel:988">988</a> in the US, or your local emergency number.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
            <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Articles</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/" hash="check" className="text-muted-foreground hover:text-foreground">Free mental health check</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Fine print</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            <li><a href="mailto:hi@brunomind.com" className="text-muted-foreground hover:text-foreground">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Bruno AI. Made with care.</p>
          <p>Launching September 2026 on iOS, Android, and Web.</p>
        </div>
      </div>
    </footer>
  );
}
