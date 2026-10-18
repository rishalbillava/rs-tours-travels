# Asset and reference notes

The owner's supplied RS Tours & Travels logo is preserved in `public/assets/rs-tours-logo.png`. The header, footer and favicon use `public/assets/rs-tours-logo-transparent.png`, a background-removed edit made with the built-in image generation tool. The surrounding cream-yellow field was removed while retaining the green and gold illustration and lettering. The PNG alpha channel is verified, and the result was inspected against white and sage backgrounds.

The layout uses https://www.utsavatravels.com/ as a reference for the upfront booking form, services and fleet sections. All RS business copy, vehicle selection and contact details are specific to this project. No Utsava testimonials, prices, statistics, addresses or branded fleet photographs are reused.

Representative model imagery, locally hosted:

- Ciaz: https://imgd-ct.aeplcdn.com/1056x660/n/qcu6isa_1467597.jpg?q=80 (model colour image)
- Etios: https://www.rhfleetindia.com/images/cars/e-sedan/3-toyota-etios.png (model image)
- Swift Dzire: https://saraswathicarrental.com/images/vehicle-images/dzire.webp (model cutout)
- Ertiga: https://saraswathicarrental.com/images/vehicle-images/ertiga.webp (model cutout)
- Innova Crysta: https://saraswathicarrental.com/images/vehicle-images/crysta.webp (model cutout)
- Urbania: https://saraswathicarrental.com/images/vehicle-images/urbania.webp (model cutout)
- Tempo Traveller: https://www.forcemotors.com/wp-content/uploads/2025/02/Traveller-Wider-Body-3350WB-main-img.webp (manufacturer model image)
- Innova: https://www.vhv.rs/dpng/d/475-4757313_thumb-image-innova-car-png-transparent-png.png (reference model cutout; checkerboard background replaced with white using the built-in image generation editor)

The website explicitly describes model photos as representative, subject to actual vehicle colour, variant, seating and availability. Model photos are not presented as photos of the owner's individual vehicles.

## Generated artwork

`public/assets/india-diorama.webp` retains the original generated miniature Indian landscape from the initial site, retained as the previous About-section illustration.

`public/assets/travel-hero.webp` is the retained previous hero asset, generated using the built-in image generation tool with this prompt:

“Use case: photorealistic-natural. Asset type: wide premium Indian road travel website hero photograph. Create a cinematic ultra-realistic landscape photo, 1536x1024. A beautiful curving asphalt road winds through lush green Western Ghats hills and tea-country scenery in South India, warm morning sunshine and atmospheric mist in distant mountain layers. One clean pearl-white Indian-style family MPV (generic unbranded vehicle, like a comfortable tourist car) is seen in front three-quarter view on the road in the lower RIGHT quadrant. The MPV is facing toward the camera and the LEFT, fully visible, reasonably large but occupying only 25 percent of the entire frame. Road guardrail and distant hillside landscape lead the eye. Put most detailed green scenery and road on right half, keep upper LEFT half mostly dark forested slopes with no objects so white website heading can be overlaid clearly. Natural colours, rich emerald greens, muted golden light, real automotive travel photography, refined and aspirational, believable proportions. No people. No typography, no logo, no branding, no watermark, no collage, no illustration, no graphical overlays.”

`public/assets/vehicle-innova.webp` was edited with the built-in tool using:

“Edit target: the attached Toyota Innova cutout vehicle image. Change only the background. Replace the baked light-grey-and-white checkerboard behind the vehicle with pure solid white (#FFFFFF). Preserve the exact vehicle, front three-quarter camera angle, proportions, silver-white body paint, wheels, headlights, grille, Toyota emblem and INNOVA plate text. Retain a subtle realistic ground shadow under the tires. Do not add any graphics, branding, scenery or other objects. Keep the entire car visible, with comfortable white margin on every side. Output a clean professional product catalogue image.”

## About section refresh

`public/assets/about-road-journey.png` is a new image made with the built-in image generation tool, replacing the miniature illustration in the About section. Prompt: “Photorealistic premium Indian road-travel photograph, landscape 3:2; a clean pearl-white unbranded family MPV on a winding Western Ghats road, emerald tea hills, tropical trees, mountains and warm morning sunlight; entire vehicle visible; no people, text, logos, watermark, UI or miniature diorama.” It is labeled as illustrative imagery on the site.

The user supplied the displayed business figures: 500+ customers, 4+ years of experience and 1,000+ trips.

## Updated travel-story logo

The header, footer and browser icon now use `public/assets/rs-travel-story-logo.png`, based on the user’s new uploaded teal-and-gold RS design with coastal scenery, winding road, airplane motifs and the handwritten slogan. The built-in image tool removed the cream paper background while preserving the foreground design and lettering. Genuine PNG alpha transparency was checked, and the image was inspected against the site’s light background. Earlier logo assets are retained but no longer referenced by the interface.

The home showcase now uses the locally hosted vehicle photos listed above. The procedural 3D car models, WebGL viewer and rotation controls have been removed.

## Premium motion upgrade

The updated hero and interactive fleet continue to use the existing representative vehicle photos. No new car imagery was generated for the upgrade. The real-photo viewer has an empty sequence manifest until the owner supplies genuine, ordered full-turn photography; a single photo is never advertised as a 360-degree view. The small car in the scroll journey is a decorative two-dimensional SVG map symbol, not a vehicle model or product photograph.

The current logo is unchanged. Next.js Image uses locally generated responsive WebP versions of the existing raster assets; transparency is preserved. Customer reviews and customer trip-photo arrays are empty, and their placeholders are labelled. Generated scenic artwork retained from the existing site remains explicitly illustrative.

## Logo clarity correction

The current header, footer and favicon use `public/assets/rs-logo-clear.png`, edited directly from the owner's new `image(5).png` upload with the built-in image editor. The cream paper background was removed with genuine PNG alpha. The prompt required preservation of the teal-and-gold illustration, original lettering, slogan, road, beach, aircraft and ornaments, removal of paper shadows, and clean transparent edges without redesign or recolouring.

The full-resolution PNG is served directly in the header and footer, avoiding lossy resized logo variants. The footer now uses a light neutral background so the original dark teal lettering remains readable; the logo itself has no background tile, blur filter or glow. Its display size is increased on desktop and mobile.
