# loop-lab-pages

Test bed **C** for Orvay's product loop: **the visual check, and a regression that should be reverted**. A small
static marketing site for a fictional product, Northlight.

Live site: https://zenovay.github.io/loop-lab-pages/

## What it is

Vite, no framework. Three pages, each with its own entry module under `src/pages/` (`index.ts` is `/`,
`pricing.ts` is `/pricing`, `about.ts` is `/about`), sharing one footer widget in `src/components/`.

| Workflow | When | What |
|---|---|---|
| `ci` / `check` | every pull request, every push to `main` | `npm ci`, lint, typecheck, unit tests (vitest), build |
| `ci` / `visual` | same | full-page screenshots of all three pages at 375 and 1440 wide, in the Playwright container, compared with `tests/visual.spec.ts-snapshots/` |
| `deploy` | every push to `main` | builds with `RELEASE=<commit SHA>`, deploys to GitHub Pages, records a GitHub deployment in environment **`production`** |
| `visual-baselines` | by hand | rewrites the screenshot baselines on the branch it runs on, in the same container, and commits them |

Sentry (browser SDK): `release` = deployed commit SHA, `environment` = `production`, anonymous visitor id, a
session per page load, unminified build with source maps.

## Planted defect 1: the footer widget on /pricing

Open https://zenovay.github.io/loop-lab-pages/pricing/ . The page looks fine. In Sentry:

```
TypeError: Cannot read properties of undefined (reading 'id')
  at impressionKey (src/components/footer-widget.ts)
  at trackImpression (src/components/footer-widget.ts)
```

Every page carries its footer settings as JSON (`<script id="footer-config">`). The pricing page's settings
(`pricing/index.html`) have no `campaign`, and `impressionKey` reads `config.campaign.id`. The impression is
counted after the first paint, so the widget is already drawn when it throws: **a correct fix changes no pixel**,
and the `visual` job proves it. The unit test (`src/components/footer-widget.test.ts`) never builds a config
without a campaign, so CI is green before the fix.

## Planted regression: branch `planted-regression` (NOT merged)

The branch adds a team carousel to `/about` (`src/components/team-carousel.ts`, mounted by
`src/pages/about.ts`). On a viewport 600px or wider it throws on every visit:

```
TypeError: Cannot read properties of undefined (reading 'dataset')
  at markPeek (src/components/team-carousel.ts)
```

Its screenshot baselines are updated on the branch, so its CI is green: the regression is invisible to CI and
visible only in production errors.

**To trigger it:** a person merges the pull request from `planted-regression` into `main` (in GitHub, not in
Orvay), the `deploy` workflow ships it, and the traffic runner (`traffic/visit.mjs --site pages`) keeps visiting
`/about` on half of its sessions. The error rate on `/about` goes from zero to roughly one event per desktop
session that opens it.

To undo it by hand: revert the merge commit in GitHub.

No secrets, no branch protection, no CODEOWNERS. MIT licensed.
