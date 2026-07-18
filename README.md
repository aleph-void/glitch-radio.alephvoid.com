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

The page deliberately mirrors chiptune-radio's structure — same layout skeleton, same section rhythm, same embed approach — so the stations read as siblings.

- **Palette** — the standard Aleph Void tokens, identical to `alephvoid.com`, `chiptune-radio`, `morphix`, and `virux`. Do not substitute per-site colors here; change them upstream and propagate.

  | Token | Value |
  | --- | --- |
  | `--bg-primary` / `--bg-secondary` / `--bg-card` | `#0a0a0f` / `#12121a` / `#16161f` |
  | `--border` | `#1e1e2e` |
  | `--text-primary` / `--text-secondary` / `--text-muted` | `#e4e4e7` / `#a1a1aa` / `#71717a` |
  | `--accent` / `--accent-light` / `--accent-lighter` | `#6d28d9` / `#8b5cf6` / `#a78bfa` |

- **Type** — Inter for body and JetBrains Mono for labels are shared brand faces. Archivo for display headings is specific to this site.
- **Motion** — the "GLITCH" wordmark separates into the two ends of the accent ramp and breaks loose for two frames every seven seconds, echoing a mis-registered signal. That plus the live-status dot are the only animations, and both respect `prefers-reduced-motion`.

The design commits to a single dark theme, matching the sibling.

## License

[MIT](LICENSE) © 2026 Aleph Void, LLC.
