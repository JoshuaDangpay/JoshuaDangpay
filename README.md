# Joshua G. Dangpay: Personal Portfolio

Plain HTML, CSS and JavaScript. No frameworks, no build step.

## Run it
Extract the zip fully, then double-click `index.html`. For best results use a local server: run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Replace or add photos
- The homepage photo is `assets/images/profile/profile-photo.webp`, a transparent cut-out that sits on the green gradient set by `.home .ph` in `css/style.css` (change the colors there).
- Photos live in `assets/images/` (`profile`, `achievements`, `work-immersion`, `family-friends`). To replace one, save the new file with the **same filename**. Keep images under about 1800 px on the long side.
- **Family & Friends:** in `family-friends.html`, copy one `<figure>...</figure>` inside `<div class="gal">`, change `src`, `alt` and the optional caption, and set `--ar` to width divided by height (for example `.75` for a 3:4 portrait, `1.3333` for 4:3). All photos stay on one screen: they are arranged in up to three rows and shrink as you add more, so keep it to about 8 photos.
- **Awards:** in `achievements.html`, copy an `<div class="item">...</div>` inside `.awards`. The grid is designed for five awards; with more, the thumbnails get smaller (the lightbox still shows each one full size).

## Edit your information
- **Introduction, personal details (height, weight, languages), contact, education, skills:** `personal.html`. The homepage intro is in `index.html`.
- **Age** is calculated from `data-birth="2008-01-07"`. The page also prints the birthday in text, so edit both if you change it.
- **Phone number and email:** the `tel:` and `mailto:` links in the Contact card. Delete the number's line if you'd rather not show it publicly.
- **Colors:** the variables at the top of `css/style.css`. The accent is `--ac`.

## Publish on GitHub Pages
Upload everything in this folder (the files and folders, not the parent folder) to your repository, commit, then use **Settings > Pages** with branch `main` and folder `/ (root)`. Changes appear a minute or two after each commit; press Ctrl+F5 to refresh.
