# glitch-radio.alephvoid.com

Landing page for **Aleph Void Glitch Radio** — a 24/7 glitch music stream on Twitch, operated by Aleph Void, LLC.

Live at [glitch-radio.alephvoid.com](https://glitch-radio.alephvoid.com/). Sibling station: [chiptune-radio.alephvoid.com](https://chiptune-radio.alephvoid.com/).

## What it is

A single static HTML page. No build step, no dependencies, no framework — `index.html` contains the markup, styles, and the one script that mounts the Twitch embeds. Deployed via GitHub Pages; `CNAME` pins the custom domain.

```
index.html      markup + inline CSS + embed script
assets/         Aleph Void logo (SVG favicon, PNG for Open Graph)
CNAME           glitch-radio.alephvoid.com
```

## Local development

The Twitch embed requires a real HTTP origin, so opening `index.html` via `file://` will leave the player and chat blank. Serve it instead:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000/>.

The embed builds its `parent` parameter from `window.location.hostname`, which is what Twitch checks against — so `localhost` works in development and the custom domain works in production, with no config to switch between them.

## Changing the channel

The Twitch channel is set once, in the script at the bottom of `index.html`:

```js
var channel = 'alephvoidglitchradio';
```

It also appears in the nav link, the player fallback note, and the Connect section. Update all four together.

## Design

The page deliberately mirrors chiptune-radio's structure — same layout skeleton, same section rhythm, same embed approach — so the stations read as siblings. What distinguishes them is color and display type:

- **Palette** — a channel split, since RGB separation is the visual signature of a glitch. Magenta `#ff2d95` accent against cyan `#2ee6d6` for labels and focus states, on a `#0b0910` ground biased toward magenta rather than a neutral grey. (Chiptune's purple `#6d28d9` stays chiptune's.)
- **Type** — Archivo for display, Inter for body, JetBrains Mono for labels and data. The latter two are shared brand faces.
- **Motion** — the "GLITCH" wordmark separates into its magenta and cyan channels and breaks loose for two frames every seven seconds. That plus the live-status dot are the only animations, and both respect `prefers-reduced-motion`.

The design commits to a single dark theme, matching the sibling.

## License

[MIT](LICENSE) © 2026 Aleph Void, LLC.
