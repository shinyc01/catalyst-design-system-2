# Fonts

Self-hosted web fonts for the kit (G6, Nov 25, 2026; rule 2.1). `build.mjs` copies them to `dist/fonts/`; `src/foundations/fonts.css` declares them.

| File | Family | Weights | Subset | Bytes | sha256 |
|---|---|---|---|---|---|
| `inter-latin.woff2` | Inter (Google Fonts v20) | 400–600 (variable) | latin | 48,256 | `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62` |
| `inter-latin-ext.woff2` | Inter (Google Fonts v20) | 400–600 (variable) | latin-ext | 85,068 | `34b9c504cab7a73e37b746343a449132e56cf7b5481af2cb81dc74dcff25c956` |
| `jetbrains-mono-latin.woff2` | JetBrains Mono (Google Fonts v24) | 400–500 (variable) | latin | 31,432 | `83c005d49d8a6a50474c73a5a36ac0468076e9c4a29da7bdb14995d80560a5be` |
| `jetbrains-mono-latin-ext.woff2` | JetBrains Mono (Google Fonts v24) | 400–500 (variable) | latin-ext | 11,624 | `db5ff4db83e580426280e9337a58dc57d3a83784a1b03ad80914651594441d52` |

Source: the Google Fonts CSS API (`family=Inter:wght@400..600`, `family=JetBrains+Mono:wght@400..500`), vendored with these checksums.

**Licence:** both families are under the SIL Open Font License 1.1 (Inter © The Inter Project Authors, https://github.com/rsms/inter; JetBrains Mono © The JetBrains Mono Project Authors, https://github.com/JetBrains/JetBrainsMono). The OFL lets the fonts be bundled and redistributed with software; the licence text must travel with them: add the two `OFL.txt` files from those repositories here before release (not fetched in the offline build of Nov 25).

**Later:** the G6 recommendation names Inter 4.1 from rsms.me (`InterVariable`); these are Google's Inter v20 subsets of the same design. Swap the files and re-measure the fallback overrides in `fonts.css` if the source changes.
