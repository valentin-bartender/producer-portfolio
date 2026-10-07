# Cinematic Brand Stories
English seven-chapter pitch website, designed for iPad in landscape and portrait.
Live: https://valentin-bartender.github.io/producer-portfolio/cinematic-stories/

## Presentation
Swipe horizontally or use the bottom arrows / chapter buttons. Keyboard arrows work too.
On iPad, open in Safari. Share → Add to Home Screen provides a standalone presentation.
The Present button uses fullscreen where supported and displays iPad instructions otherwise.
Small viewports allow vertical scrolling within a chapter. Reduced motion is respected.
The existing producer portfolio stays at the repository root.

## Replace film placeholders
1. Upload MP4 videos and optional poster images into cinematic-stories/media/ through GitHub.
2. Edit cinematic-stories/works.js.
3. Fill in each src (for example media/film-01.mp4), title, category, and optional poster.
4. Commit changes. GitHub Pages republishes automatically.
HTTPS MP4 URLs also work. YouTube/Vimeo page links are not MP4 URLs.
Videos use native controls and inline playback on iPad; playback stops when changing chapters.
Empty slots remain clearly labeled placeholders.

## Editing
Copy, layout, CSS and presentation interactions live in index.html.
design-direction.png is an AI-generated design reference; the opening image is a CSS crop of
its café photo area and explicitly labeled as an AI moodboard, not a portfolio work.
No framework, build command, external font or tracking dependency is needed.

## Validation
Seven chapters and JavaScript syntax checked before commit.
Browser-based visual checks and physical iPad testing were not available in this session.
