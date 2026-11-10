# Joshua G. Dangpay: Personal Portfolio

Plain HTML, CSS and JavaScript. No frameworks, no build step.

## Run it
Open `index.html` in a browser. For best results use a local server: `python3 -m http.server` in this folder, then visit http://localhost:8000.

## Replace or add photos
- Put new files in the matching folder under `assets/images/` (`profile`, `achievements`, `work-immersion`, `family-friends`).
- To replace a photo, save the new one with the **same filename**.
- Keep each image under about 1800 px on its longest side so pages load fast.
- **Add a family or friends photo:** in `family-friends.html`, copy one `<figure>...</figure>` inside `<div class="gal">`, change the `src`, `alt`, optional caption (`data-cap` and `<figcaption>`), and set `--ar` to width divided by height (for example `.75` for a 3:4 portrait). Four photos show per page (two on phones); page controls appear automatically.
- **Add an award:** in `achievements.html`, copy an `<div class="item">...</div>` inside `.awards`. Lightbox navigation picks it up automatically.

## Edit your information
- **Personal details, education, interests, goals:** `personal.html`.
- **Age** is calculated from `data-birth="2008-01-07"` in `personal.html`. The page shows only the birthday (January 7), but the birth year is in the page source. Remove that attribute and type your age if you want it hidden.
- **Intro text:** `index.html`.
- **Work immersion office:** the certificate says Human Resource Office. Change it in `achievements.html` if you prefer another wording.
- **Colors:** the variables at the top of `css/style.css`. The accent is `--ac`.

## Publish on GitHub Pages
1. Create a GitHub account and a new public repository (for example `portfolio`).
2. Upload everything in this folder (the files, not the folder itself) with **Add file > Upload files**, then commit.
3. Open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute or two your site appears at `https://YOUR-USERNAME.github.io/portfolio/`.

Note: a public site shows your photos and details to anyone, so remove anything you don't want shared.
