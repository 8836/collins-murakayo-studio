import { Link } from "@tanstack/react-router";

import { profile } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 rule-top">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display-lg max-w-sm">Let's build something precise.</p>
          <a
            href={`mailto:${profile.email}`}
            className="link-underline mt-6 inline-block text-sm text-accent"
          >
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow">Site</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/projects" className="link-underline hover:text-foreground">Projects</Link></li>
            <li><Link to="/services" className="link-underline hover:text-foreground">Services</Link></li>
            <li><Link to="/about" className="link-underline hover:text-foreground">About</Link></li>
            <li><Link to="/resume" className="link-underline hover:text-foreground">Resume</Link></li>
            <li><Link to="/contact" className="link-underline hover:text-foreground">Contact</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline hover:text-foreground">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.behance} target="_blank" rel="noreferrer" className="link-underline hover:text-foreground">
                Behance
              </a>
            </li>
            <li>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="link-underline hover:text-foreground">
                WhatsApp
              </a>
            </li>
          </ul>
          <p className="mt-8 text-xs text-muted-foreground">{profile.location}</p>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-6 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p className="font-mono tracking-[0.14em] uppercase">Multidisciplinary Design Practice</p>
      </div>
    </footer>
  );
}
