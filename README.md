# Cường's Graduation Invitation

A bilingual graduation invitation built with React, TypeScript, Vite, Tailwind CSS, Supabase, and Mapbox.

## Features

- Vietnamese and English interface with a language toggle.
- Vietnamese UI text uses Chakra Petch for consistent rendering of accented characters.
- Live graduation countdown and ceremony schedule.
- Dress code and color palette section.
- Mapbox campus wayfinding with walking and driving routes.
- Guestbook with Supabase persistence, affiliation filters, search, tags, and confetti feedback.
- Responsive layout for desktop and mobile screens.

## Requirements

- Node.js 18 or newer
- npm
- A Supabase project for Guestbook persistence
- A Mapbox access token for the map and directions features

## Getting Started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create `.env.local` in the project root:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   VITE_MAPBOX_TOKEN=your-mapbox-access-token
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open <http://localhost:3000> in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run lint` | Run the TypeScript compiler without emitting files |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run clean` | Remove generated build and server files |

## Project Structure

```text
src/
  App.tsx
  index.css
  components/
    Header.tsx
    HeroSection.tsx
    ScheduleSection.tsx
    DressCodeSection.tsx
    WayfindingSection.tsx
    GuestbookSection.tsx
    Footer.tsx
  services/
    guestbook.ts
  utils/
    supabase.ts
```