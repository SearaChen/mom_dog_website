# Dog Boarding Website

A single-page website for a small in-home dog boarding business, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). It's a static site hosted free on GitHub Pages, with no server to maintain.

- **Price table:** read from a Google Sheet, so prices can be changed without touching code.
- **Availability calendar:** shows open and booked days from a Google Calendar.
- **Booking request form:** sends requests straight to a Gmail inbox through [Web3Forms](https://web3forms.com).

## Preview locally

Install [Node.js](https://nodejs.org) (LTS), then:

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

## Filling in the real details

- Business name, phone, email: `src/site.ts`
- Prices: the Google Sheet (see setup below), or `src/data/prices.csv` until it's set up
- Service descriptions: `src/components/Services.astro`
- About us text: `src/components/About.astro`

Search `src/` for `TODO` to find every placeholder.

## One-time setup

### 1. Price table (Google Sheets)

1. In Google Sheets, choose **File → Import → Upload** and upload `src/data/prices.csv` (the current prices, with columns **Service**, **Price**, **Details**). Edit it however you like, but keep those three headings.
2. Click **Share** and set General access to **Anyone with the link: Viewer**.
3. Copy the sheet's ID (the long code in its address between `/d/` and `/edit`) into `pricesSheetId` in `src/site.ts`.

From then on, edit the sheet and the website updates on its own. Rows with an empty Service are skipped.

### 2. Availability calendar (Google Calendar)

1. In Google Calendar, create a new calendar called **Boarding availability**. Use a separate calendar so her personal events stay private.
2. In that calendar's settings, under **Access permissions**, tick **Make available to public**.
3. Under **Integrate calendar**, copy the **Calendar ID** (ends in `@group.calendar.google.com`).
4. In the [Google Cloud console](https://console.cloud.google.com), create a project, enable the **Google Calendar API**, and create an **API key**. Restrict the key to the Google Calendar API and to the website's address (HTTP referrers, e.g. `https://<username>.github.io/*`).

To block out a day, add an all-day event (e.g. "Full") on that calendar. The website shows it as booked. Events set to "Free" don't block a day.

### 3. Booking request form (Web3Forms)

Go to [web3forms.com](https://web3forms.com), enter the Gmail address that should receive inquiries, and copy the access key it emails you. The free plan covers 250 submissions a month.

### 4. Add the keys to GitHub

In the repo, go to **Settings → Secrets and variables → Actions → Variables** and add:

| Name | Value |
| --- | --- |
| `PUBLIC_GOOGLE_CALENDAR_ID` | Calendar ID from step 2 |
| `PUBLIC_GOOGLE_API_KEY` | API key from step 2 |
| `PUBLIC_WEB3FORMS_KEY` | Access key from step 3 |

For local testing, copy `.env.example` to `.env` and fill in the same values.

## Publishing on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and publishes the site at `https://<username>.github.io/<repo-name>/`. A custom domain can be added on the same page.
