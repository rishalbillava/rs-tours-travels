# RS Tours & Travels — Premium Next.js Upgrade

An upgrade of the existing six-page RS website, preserving its logo, business information, eight vehicles, services, tour ideas and WhatsApp enquiry flow. The interface uses dark navy, white and champagne gold, real representative vehicle photography, layered 3D card effects and accessible motion.

## Run and build

Use Node.js 22 or newer (the lockfile records the tested dependencies).

```bash
npm install
npm run dev
```

Open http://localhost:3000. Generate the production website with:

```bash
npm run check
npm run build
node scripts/verify-export.mjs
```

The build exports the complete site to `out/`. `predev` and `prebuild` generate local responsive WebP assets automatically using Sharp. Do not use `next start` with this static export. No secret keys, database or external font service are required.

## GitHub and Vercel

1. Extract the ZIP and upload the contents of the `RS-Tours-Travels` folder to a GitHub repository. Keep `package.json` at the repository root.
2. Import that repository into Vercel and select the **Next.js** framework preset.
3. Use `npm install` and `npm run build`. This project uses Next.js `output: 'export'`; the generated static directory is `out`.
4. No environment variables are needed. Vercel supplies the deployment URL after a successful build.

Do not upload `node_modules`, `.next`, `out`, local environment files or private credentials. The ZIP excludes these. Existing `/fleet.html`, `/contact.html` and other legacy links redirect to the App Router pages while preserving their query strings and fragments.

## Technology and structure

- Next.js App Router and React, with TypeScript for routes and interactive components. Existing static JSX sections and tested JavaScript data helpers are retained.
- Tailwind CSS utilities and custom responsive CSS in `app/premium.css`.
- Motion for React loaded with `LazyMotion`, with route entrance transitions and fleet filtering.
- GSAP / ScrollTrigger loaded dynamically for scroll reveals and parallax. The illustrated car journey uses a lightweight native scroll controller on every device.
- Lenis smooth wheel scrolling on capable desktop devices. Mobile keeps native touch scrolling.
- Next.js Image with responsive, locally generated WebP sizes, compatible with static hosting.
- CSS perspective, lighting and pointer tilt provide useful 3D effects; no Three.js dependency or artificial car model is needed.

`app/` contains Home, Fleet, Services, Tour Ideas, About and Contact. `components/` contains shared sections and interactions. `lib/` holds business configuration, fleet data, photo manifest, customer content and WhatsApp helpers. `public/assets/` holds the existing transparent logo and imagery.

## Business and booking

- **RS Tours & Travels**
- WhatsApp and contact: **+91 7892835142**
- Email, displayed as information: **rahulgowda2429@gmail.com**

The form validates the name, mobile number, pickup, destination, passenger count and date order. It includes the chosen vehicle, trip type, travel and return dates, pickup time and special requests in a formatted WhatsApp draft. The visitor reviews and sends it in WhatsApp. A preview and copy fallback are provided. The site never confirms a booking, takes payment, stores the enquiry or sends email. Availability, seating, luggage and complete fares are confirmed by the business.

Fleet: Toyota Etios, Maruti Suzuki Ciaz, Swift Dzire, Toyota Innova, Force Urbania, Tempo Traveller, Maruti Suzuki Ertiga and Toyota Innova Crysta. Displayed business milestones are the owner's supplied **500+ customers, 4+ years and 1,000+ trips**.

## Add genuine 360° photographs

The current assets are individual, representative vehicle photographs. They are deliberately labelled **Vehicle photograph**, without invented angles or a misleading rotation effect.

The working viewer supports drag, mobile swipe, arrow keys and previous/next buttons. To supply an actual photo sequence:

1. Photograph one real vehicle from evenly spaced angles, completing the entire turn. Keep camera height, framing, lighting and background consistent. Prefer 24–72 frames, approximately 1,000–1,600 pixels wide, compressed as WebP. Avoid duplicate or generated angles.
2. Place the ordered frames inside `public/assets/360/<vehicle-id>/`. IDs are `etios`, `ciaz`, `dzire`, `innova`, `urbania`, `tempo`, `ertiga`, `crysta`.
3. Edit the matching entry in `lib/vehicle-photos.ts`:

```ts
crysta: {
  frames: Array.from({ length: 36 }, (_, i) =>
    `/assets/360/crysta/${String(i + 1).padStart(2, '0')}.webp`
  ),
  fullTurn: true
}
```

Only set `fullTurn: true` after verifying full coverage. At least 12 frames are required before the interface shows a 360° label; the count alone does not prove coverage. Partial sets remain labelled as a photo gallery. A single frame remains a normal photograph. If a frame cannot load, the viewer falls back to the standard photo. Sequence images are served as the pre-compressed files supplied, with adjacent frames preloaded. No upload server or public upload endpoint is included.

## Customer reviews and trip photographs

`lib/customer-content.ts` contains empty, typed `customerReviews` and `tripPhotos` arrays. Add only genuine feedback and photographs you have permission to publish. Review fields are `name`, `trip`, `quote`; trip image fields are `src`, `alt`, `caption`, `category`.

Until real content is supplied, review cards explicitly say that customer feedback is coming soon. The fullscreen gallery shows labelled representative fleet photographs and a trip-photo placeholder. No customer names, quotes, ratings or trips have been fabricated. Existing generated scenic artwork is retained and labelled illustrative; the hero and fleet use the existing representative vehicle photographs. See `ASSETS.md` for provenance.

## Motion and accessibility

- Word and letter entrances run once per mounted text block and always leave text readable.
- Statistics animate only when scrolled into view; final values are available without animation.
- Device reduced-motion settings take priority. The footer includes a clearly labelled, persistent Animations on/off control.
- Custom pointer decoration, magnetic buttons and tilt are desktop-only; the native cursor stays visible.
- Data-saving or lower-resource devices skip heavier scrolling and pointer effects, while the lightweight journey car still follows native touch scrolling. On narrow screens its map stays visible until the route is complete.
- Touch scrolling remains native, including vertical swipes over the vehicle viewer.
- Decorative animation pauses in background tabs. Event listeners, timers, animation frames and GSAP contexts clean up on navigation.
- Native modal dialogs support keyboard focus containment and Escape. Mobile navigation includes focus management and Escape-to-close.
- Images have reserved dimensions and responsive sizes. No artificial page-loading delay is added.

## Verification

`npm run check` performs TypeScript validation, nine Node tests and sixteen DOM interaction tests. Coverage includes message encoding, all eight deep links, India date boundaries, animation cancellation, mobile navigation/focus, photo drag/swipe/keyboard controls, single-photo labelling, fleet filtering/details, fullscreen gallery, mobile-number and date validation, complete WhatsApp enquiries, reduced-motion preferences, and the journey car on lower-resource mobile devices.

`npm run build` prerenders all six routes. `scripts/verify-export.mjs` checks local image references, internal navigation, WhatsApp destinations, page headings and transparent branding in the generated output. Automated DOM checks do not establish visual quality or frame rate on physical devices. Live browser/device QA was unavailable in the managed environment; check iOS Safari, Android Chrome and desktop before a public launch.


## Airport & Bengaluru additions

The home and Services pages now include the airport transfers and Bengaluru sightseeing information supplied in the reference screenshots:

- Keyboard-accessible airport / city sightseeing tabs.
- BLR Terminal 1 and Terminal 2 pickup and drop information.
- Airport drop, airport pickup, direct outstation and airport + city sightseeing enquiry cards.
- Direct airport route enquiries for Nandi Hills, Mysore, Coorg, Chikmagaluru, Ooty and Wayanad.
- Mobile Call, Book Ride and WhatsApp actions using the existing business number.
- SVG arrows throughout the interface to avoid mobile emoji substitution.

Edit `components/AirportTravel.tsx` for the new copy and routes, and `app/airport.css` for its layout. All enquiry buttons prepare WhatsApp messages for +91 7892835142. The existing logo, contact details, fleet, animations and booking form are retained. Existing project imagery illustrates the new sections; the screenshot terminal photograph is not a separate supplied asset.
