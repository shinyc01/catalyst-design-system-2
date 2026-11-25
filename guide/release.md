# Releases and versioning

Decided Nov 25, 2026 (G7, `prototypes/phase1-prep/foundation-gaps/DECISIONS.md`). One page: what each kind of release may change, how long old names live, how the changelog reads and how another product upgrades.

## The release line

| Release | When | What |
|---|---|---|
| 2.0.6 | Nov 25 | The remaining foundations: data viz, forced colours, contrast, glass, keyboard and focus, status messages, fonts, this policy |
| 2.0.7 | Nov 26 | G9 content foundations and the components (CircularButton D3, line-chart gaps, legend position …) |
| 2.1.0 | Nov 27 | Phase 1 done; the first release judged by this policy |

## Semantic versioning, from 2.1.0

Releases before 2.1.0 (2.0.0–2.0.6, and 2.0.7) are foundation-building and are not judged by this policy: they changed values and removed things in patch numbers.

| Kind | Example | May change |
|---|---|---|
| Patch | 2.1.1, 2.1.2 | Bug fixes that restore the intended look or behaviour. No new look, no API change |
| Minor | 2.2, 2.3 | New components; decided visual changes; behaviour changes; renames that keep the old name as an alias |
| Major | 3.0 | Removing a token or component, or changing what a token means |

## Deprecation

- A deprecated name keeps working for at least **2 minor releases and 60 days**, whichever is longer, and is removed only in a major.
- Deprecated tokens are marked `$deprecated` in `dist/tokens.json`, listed after the new names in `dist/tokens.txt`, and flagged by `node tools/color-lint.mjs` (deprecated = 0 in kit code).
- The 2.0.5 renames (old names in `src/foundations/deprecated.css`) stay until 3.0.

## Changelog

Every release in the README "Versions" list uses these headings, in this order, and leaves out the empty ones: **Added · Changed · Deprecated · Removed · Fixed**.

## Upgrading (another product)

- Pin an exact version (for example the `dist/` of tag `v2.1.0`), never "latest".
- Read the changelog between your version and the new one; act on Deprecated and Removed.
- Run the colour lint (or search for the names under Deprecated) before you upgrade across a major.
