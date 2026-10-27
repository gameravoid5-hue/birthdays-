# My Chotu 💖 — Romantic Story Website

A responsive, animated, single-page surprise website made with plain HTML, CSS, and JavaScript. It works as a static site and can be hosted on GitHub Pages.

## 1. Add your media files

Put these files in the **same folder as `index.html`**:

- `my_gif.gif` — optional decorative GIF
- `bg_music.mp3` — looping background music
- `ring_audio.mp3` — audio for the ring reveal
- `letter_audio.mp3` — audio for the letter
- `bite.mp3` — optional cake-bite sound effect
- `img1.jpg`, `img2.jpg`, `img3.jpg`, `img4.jpg` — four photos
- `voice1.mp3`, `voice2.mp3`, `voice3.mp3`, `voice4.mp3` — voice notes for the photos

All references are relative filenames. If you don't have a sound file yet, the story still advances using fallback timers. Photo placeholders appear when image files are missing.

## 2. Run on your PC

1. Extract the ZIP.
2. Open the `my_chotu_love_website` folder in VS Code.
3. Install/use **Live Server** if you want to preview it locally.
4. Right-click `index.html` → **Open with Live Server**.

You can also open `index.html` directly in a browser, but autoplay restrictions mean audio usually starts only after you tap the book.

## 3. Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and your media files to the repository root.
3. In the repository, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose your main branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

## Personalize the letter and captions

- Edit the `letterText` string in `script.js` to change the typewriter letter.
- Edit the caption text inside each `.polaroid` in `index.html`.
- Edit the secret message in the `#secret-message` section in `index.html`.

Use audio and photos you have permission to share. Browsers may block audio until the visitor interacts with the page.
