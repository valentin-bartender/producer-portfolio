# Cinematic Brand Stories — Valentin Producer
A seven-chapter English pitch website for iPad.
Live: https://valentin-bartender.github.io/producer-portfolio/cinematic-stories/

## Presentation
Swipe horizontally or use the arrows and chapter buttons.
For standalone iPad presentation: Safari → Share → Add to Home Screen.
Both landscape and portrait layouts are supported. Chapters scroll vertically when needed.
Keyboard arrows navigate chapters. Vertical arrow keys navigate the brand moodboard tabs.
The brand chapter has six interactive sections, including four visual styles and four moods.

## Photographs
Eight real photographs are stored locally in media/ as standard JPEGs.
They come from Pexels. Photographer names, source pages and license URLs are in photo-sources.json.
The Photo references button opens the credits in the presentation.
The opening picture is now an ordinary local JPEG with object-fit:cover,
instead of cropping the old AI-generated design screenshot.
The old design reference PNG is no longer used by the presentation.
Subtle CSS colour, vignette and VHS-inspired scanlines give the photos an analog feel.
These photographs are illustrative references, not claims about the team's past work.

## Replace film placeholders
Upload MP4 videos and optional poster images into cinematic-stories/media/.
Edit works.js: set src, title, category, and optional poster.
Example: src: "media/film-01.mp4".
The three work placeholders remain available. Empty src values leave a visible placeholder.
HTTPS MP4 URLs also work; YouTube/Vimeo page links require a different embed.
Native inline video controls are used on iPad, and playback pauses when changing chapters.

## Photo maintenance
The cache-cinematic-photos workflow downloads and verifies the manifest's photographs,
normalises JPEG orientation, and sizes the longest edge to 1600px for iPad.
It commits only the local media files. No generation model is used for the photographs.
A change to photo-sources.json or cache_photos.py reruns that workflow.
Changes pushed to main are deployed by the existing GitHub Pages configuration.

## Verification
The check-cinematic-ipad workflow uses Playwright WebKit with touch/mobile contexts:
1024×768, 1194×834, and 768×1024.
It verifies actual JPEG decoding, seven-chapter navigation, six moodboard tabs,
three film placeholders, credits, missing assets, and viewport overflow.
Screenshots and a JSON report are saved as the ipad-safari-checks Actions artifact.
This is browser-engine verification; physical iPad hardware is not available in this session.

## Naming
The presentation's visible producer identity is Valentin Producer.
The GitHub account login valentin-bartender and repository producer-portfolio are separate names.
Changing the GitHub login requires the account settings; it is not a page title change.
