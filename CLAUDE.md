# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page brochure site for a small family-home dog boarding business in Milton, Ontario, run by the repo owner's mom, Weiping (primary caregiver), with her husband Kevin helping. They host one family's dogs at a time. Services: boarding and daycare at her home; house sitting, drop-in visits and dog walking at the client's home. The business is called "Mama Paws" (domain idea: mamapaws.ca). Built with **Astro + Tailwind CSS**, output as a fully static site and hosted on GitHub Pages. There are **no backend servers**: anything dynamic happens in the visitor's browser against a third-party service (Google Calendar for availability, a Google Sheet for prices, Web3Forms for the booking form).

The page has the four sections from the owner's planning doc, **About us** (with the hero above it), **Services**, **Prices** and **Booking** (calendar + request form), plus **Reviews** and **Good to know** (which dogs she hosts, meet-and-greet, cancellation, home details). Services, prices, rules and reviews come from her Rover profile (`site.roverUrl`); if they need refreshing, re-check that profile rather than guessing. Booking works by email: the client sends a request, and Weiping confirms by email and then sends payment details. There's no online payment.

Copy should sound like Weiping: warm, personal, first person, short sentences, plain words. Ideas in the planning doc that are on hold because they'd need a backend and accounts: online self-booking with payment, per-dog photo albums with owner login, and private dog profiles/notes for the owner.

## Goals for every change

- **Look and feel:** a family business, not a company or a template: warm, homey, personal, grown-up (no emoji icons, no cutesy decoration). Cream/sand backgrounds, brown text, warm orange accent, Fraunces headings, Nunito body text. Real photos are shown as printed snapshots (`Snapshot`), which is the one decorative idea on the page, with small paw prints (`Paw`) as the only other ornament; keep everything else plain. The page should read like Weiping introducing herself, not like a sales page: no checkmark lists, and no big filled "Book now" buttons outside the booking form itself. Invitations to book are ordinary links in her own words.
- **Easy to read for older visitors:** many clients are middle-aged or older. Body text is 19px with generous line height, links are underlined, buttons and form fields are large, controls have words not just icons, and layouts are a single clear column on phones.
- **Accessible:** semantic HTML (`section` + heading, `nav`, `label` on every input, real `button`s), visible focus styles, text contrast of at least 4.5:1 (check new colors before using them), and `prefers-reduced-motion` respected.
- **Low maintenance:** the owner isn't a developer. Keep components small, semantic and easy to read. Prefer plain Astro components and a few lines of vanilla TypeScript over adding UI frameworks or npm packages. Don't add a dependency unless it removes real complexity.

## Running locally

Needs Node.js (22.23+). Not installed globally on this Mac at the time of writing.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

`.claude/launch.json` defines the dev server under the name `site`.

## Structure

- `src/site.ts`: business details (name, owner, town, phone, email, time zone, price sheet ID) and the nav list. Change details here, not in components.
- `src/pages/index.astro`: the page, which just lists the section components in order.
- `src/layouts/BaseLayout.astro`: `<head>`, fonts, skip link, header and footer.
- `src/components/`: `Hero`, `About`, `Services`, `Prices`, `Reviews`, `GoodToKnow`, `Booking` (which uses `AvailabilityCalendar` and `InquiryForm`), plus `Section` (shared wrapper with id, heading and intro) `Snapshot` (a photo shown as a print with a caption) and `Paw` (small paw-print decoration). Short editable lists (service descriptions, guest photos, booking steps) are plain arrays at the top of each component.
- `src/assets/photos/`: photos from Weiping's Rover profile, resized and compressed at build time by Astro.
- `src/lib/bookedDays.ts`: fetches the availability calendar and turns events into booked days.
- `src/lib/csv.ts`: tiny CSV parser and `priceRows()` for the price sheet.
- `src/data/prices.csv`: default prices (from Rover), shown until a Google Sheet is connected, and the template to import into that sheet.
- `src/styles/global.css`: Tailwind import plus the theme in `@theme` (colors, fonts, shadow). Restyle by changing those tokens, not by hardcoding hex values in components. Shared `.btn`, `.btn-ghost` and `.field` classes live here too.
- `public/`: files served as-is (favicon).

Section ids (`about`, `services`, `prices`, `reviews`, `good-to-know`, `booking`) are anchor targets. If you add or rename a section, update `nav` in `src/site.ts`.

## Price table

The owner must be able to change prices and services herself, with no code. So prices live in a Google Sheet (columns `Service`, `Price`, `Details`, matched by heading), shared as "Anyone with the link can view". `Prices.astro` fetches `docs.google.com/spreadsheets/d/<id>/export?format=csv` in the browser (this endpoint allows cross-origin requests), so edits show up without a rebuild. Sheet text is inserted with `textContent`, never `innerHTML`. With no `pricesSheetId`, rows from `src/data/prices.csv` are shown.

## Availability calendar

`AvailabilityCalendar.astro` reads a **dedicated** Google Calendar ("Boarding availability"), not the owner's personal one, through the Google Calendar API with a browser API key. Any day with an event on it shows as booked; events set to "Free" are ignored. Only start/end times are requested, never titles. The calendar must be public; a dedicated calendar keeps her personal events private. If the env vars are missing, the section shows a "call us" message instead.

## Booking request form

`InquiryForm.astro` posts to Web3Forms, which emails the submission to the Gmail address the access key was created with. It works without JavaScript (plain form post) and is enhanced with `fetch` to show the result inline. It includes a hidden `botcheck` honeypot. If the key is missing, it shows a fallback message.

## Configuration

Three `PUBLIC_` env vars (see `.env.example`): `PUBLIC_GOOGLE_CALENDAR_ID`, `PUBLIC_GOOGLE_API_KEY`, `PUBLIC_WEB3FORMS_KEY`. They end up in the public page, so they're not secrets, but keep them out of the repo anyway (GitHub flags committed Google API keys). Locally use `.env` (gitignored). On GitHub they're repository **Variables**, passed in by the workflow.

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `main` (Pages source must be set to "GitHub Actions"). It sets `SITE_URL` and `BASE_PATH` so the site works under `/<repo-name>/`. That means links to files in `public/` must be prefixed with `import.meta.env.BASE_URL`. In-page `#anchor` links don't need it.

## Placeholder content

Still placeholders: phone and email. They're marked with `TODO` comments, so search for `TODO` in `src/` to find them.

Until the keys in **Configuration** are set, the booking section shows an example calendar and an example form (`src/components/preview/`), each clearly labelled "Example only". The example form sends nothing. They disappear by themselves once the keys are set. To remove them for good: delete `src/components/preview/`, then delete the two lines marked `EXAMPLE` in `AvailabilityCalendar.astro` and the two in `InquiryForm.astro`.

Photos come from Weiping's Rover profile and live in `src/assets/photos/`. To add or swap one, put the file there, import it in the component and pass it to `Snapshot` with a descriptive `alt` and a short caption that only describes what's in the picture.

Don't invent business facts (prices, policies, hours, reviews or testimonials). Leave a placeholder and ask the user instead. Reviews come only from Weiping's real Rover profile (`site.roverUrl`), copied word for word with the reviewer's name as shown there, and the section links back to Rover. Show the reviewers' own words only: don't summarize or paraphrase reviews, and don't add rating counts, badges or superlatives in our own words. Alternate section backgrounds (`alt`) so neighbouring sections differ. Photos of client dogs need the owners' permission.
