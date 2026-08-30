# YT Quick Uploader — phone-only setup

This is a small installable web app that uploads videos from your phone to YouTube.

## Important YouTube limitation

For YouTube API projects that have not passed YouTube's API compliance audit, videos uploaded with the API are restricted to **Private**. The app therefore uploads as Private. You can then open YouTube Studio and change the visibility manually when YouTube permits it.

## What you need

- A GitHub account
- A Google account that owns the YouTube channel
- A Google Cloud project with the YouTube Data API v3 enabled
- An OAuth 2.0 **Web application** Client ID

Do NOT put a Google client secret into this app.

## A. Put the app on GitHub Pages from your phone

1. Open GitHub in your phone browser.
2. Create a new repository, for example: `yt-quick-uploader`.
3. Upload these files to the repository root:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon.svg`
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then Save.
7. Your site address will normally be:
   `https://YOUR-GITHUB-USERNAME.github.io/yt-quick-uploader/`

Keep that address — you need it for Google OAuth setup.

## B. Create the Google OAuth Client ID

1. Open Google Cloud Console in your phone browser.
2. Create/select a project.
3. Enable **YouTube Data API v3**.
4. Configure the Google Auth Platform / OAuth consent screen.
5. If the app is in Testing, add your own Google account as a test user.
6. Create **OAuth client ID → Web application**.
7. Under **Authorized JavaScript origins**, add:
   `https://YOUR-GITHUB-USERNAME.github.io`
8. Create the credential.
9. Copy the Client ID. It ends in:
   `.apps.googleusercontent.com`

You do not need a client secret in the web app.

## C. Use the uploader

1. Open your GitHub Pages site.
2. Paste the OAuth Client ID into the app and tap **Save Client ID**.
3. Tap **Sign in with Google**.
4. Choose the Google/YouTube account you want.
5. Pick a video from your phone.
6. Enter title, description and tags.
7. Set whether it is made for kids.
8. Tap **Upload to YouTube**.
9. When complete, tap **Open YouTube Studio** to review the video and set its visibility.

## Install it like an app

In Chrome on Android:
- Open the GitHub Pages site.
- Use the browser menu.
- Choose **Add to Home screen** or **Install app**.

## Security notes

- The OAuth Client ID is public by design; it is stored only in your phone browser by this app.
- Never paste a Google client secret into this page.
- Access tokens are kept only in memory and are not stored by the app.
- Sign-in tokens expire; if an upload says authorization expired, sign in again.

## Files

- `index.html` — the whole uploader interface and YouTube upload logic
- `manifest.webmanifest` — installable-app metadata
- `sw.js` — caches the app shell
- `icon.svg` — app icon
