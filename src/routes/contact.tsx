import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { profile, services } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Collins Murakayo" },
      {
        name: "description",
        content:
          "Start a brand identity, marketing design or data reporting project with Collins Murakayo — based in Nairobi, working with teams worldwide.",
      },
      { property: "og:title", content: "Contact — Collins Murakayo" },
      {
        property: "og:description",
        content: "Available for brand, campaign and business reporting engagements.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(services[0]?.group ?? "Brand & Identity");
  const [message, setMessage] = useState("");

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    `${service} enquiry — ${name || "New project"}`,
  )}&body=${encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)}`;

  return (
    <section className="shell pt-16 pb-28">
      <p className="eyebrow">Contact</p>
      <h1 className="display-xl mt-6 max-w-3xl">Let's talk about the work.</h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <form
          className="space-y-8 lg:col-span-7"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = mailto;
          }}
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Name" id="name">
              <input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input-line"
              />
            </Field>
            <Field label="Email" id="email">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-line"
              />
            </Field>
          </div>

          <Field label="What do you need?" id="service">
            <select
              id="service"
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="input-line"
            >
              {services.map((group) => (
                <option key={group.group} value={group.group}>
                  {group.group}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Project details" id="message">
            <textarea
              id="message"
              rows={6}
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="input-line resize-none"
            />
          </Field>

          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Send enquiry
          </button>
          <p className="text-xs text-muted-foreground">
            This opens your email client with the details pre-filled.
          </p>
        </form>

        <aside className="space-y-10 lg:col-span-5">
          <div>
            <h2 className="eyebrow">Direct</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${profile.email}`} className="link-underline text-foreground">
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-underline text-foreground">
                  {profile.phone}
                </a>
              </li>
              <li>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Elsewhere</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.instagram} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  Instagram
                </a>
              </li>
              <li>
                <a href={profile.tiktok} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  TikTok
                </a>
              </li>
              <li>
                <a href={profile.showreel} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  Showreel (YouTube)
                </a>
              </li>

            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Location</h2>
            <p className="mt-4 text-sm text-muted-foreground">{profile.location}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}
