# Content design and formatting

How Catalyst screens use words and show values. Everything a screen shows (labels, messages, mock data, Cooper's answers) follows these rules. Values go through `IFS.format` (section 6), so a number looks the same on every screen.

Status: draft for review, v2.0. Capitalisation decided Nov 17, 2026: Title Case for titles, headings, navigation, buttons and dropdowns; sentence case for content; uppercase for column headers and status tags. Rules marked **(decide)** are waiting on a team decision (section 9).

People who read Catalyst: Portfolio Owners, Investment Owners, Asset Managers, finance leads and field SMEs. They are experts in their assets, short of time, and they make decisions worth millions with what the screen tells them. So the words must be exact, short and calm.

---

## 1. Voice and tone

Catalyst sounds like a **trusted planning analyst**: it knows the numbers, says the important thing first, and doesn't show off.

| Principle | Do | Don't |
|---|---|---|
| **Conclusion first.** Lead with the result, then the reason. | "Reliability is 1.1 min over target. The June storm caused most of it." | "Based on analysis of outage data, there may be some impact on reliability." |
| **Specific.** Name the thing, the number and the time. | "6 investments are 10 weeks late." | "Some investments are delayed." |
| **Plain and short.** Everyday words, sentences of about 20 words at most, no internal jargon. Domain terms users know (SAIDI, capex, NPV) are fine. | "How Cooper got this" | "Agentic synthesis of context" |
| **Talk to the user as "you".** Use "we" only for the company, rarely. | "You can't edit an active framework." | "The user cannot edit…" |
| **Calm.** No exclamation marks, hype or emoji. Success is stated, not celebrated. | "Plan ready for review." | "Awesome! Your plan is ready!" |
| **Honest about certainty.** Cooper shows where an answer comes from and how sure it is, and never pretends to be a person. | "Cooper recommends deferring (high confidence, 4 sources)." | "I think you might want to defer 😊" |
| **Consistent.** One term per idea everywhere. | "Scenario" on every screen | "Scenario" here, "What-if" there |

**Tone shifts with the moment; the voice doesn't.** Routine and success: brief and neutral. Warnings: direct, with the consequence. Errors and destructive actions: serious, specific and helpful, never cute.

**Words to avoid** (in every element; a quoted file or system name is the only exception):

| Avoid | Why / use instead |
|---|---|
| please, sorry, oops, whoops | Say the fact and the next step. ("Sorry" only when the product truly failed the user, and then once.) |
| simply, just, easy, obviously | What's easy for us may not be for them. Delete it. |
| seamless, powerful, robust, magic, smart, AI-powered | Say what it does. |
| leverage, utilize, facilitate, empower | use, help, let |
| click here, here, learn more (alone) | Name the destination: "See the storm report". |
| invalid, illegal, failed, fatal, abort, error (alone) | What went wrong and how to fix it. |
| chatbot, bot, the AI | Cooper |
| `!`, emoji, ALL CAPS for emphasis | A full stop; plain words ("isn't approved yet"). |

**Writing for everyone** (inclusive and global writing): use gender-neutral words (they, staff, people); don't describe people by ability ("see", "click" are fine for actions, but prefer "select" and "choose" in instructions that keyboard users follow too); avoid idioms, sports metaphors and culture-specific jokes; keep one idea per sentence so it translates; use common contractions (can’t, don’t, isn’t): they read as human and translate fine.

## 2. Capitalisation

Three cases, each for a job. The text's **role** decides the case, not the component.

| Case | For | Examples |
|---|---|---|
| **Title Case** | Anything that names a place or a block: page, section, card, chart, table, modal, drawer and panel titles; headings at every level (including empty-state, alert and toast headings); navigation (nav bar, side nav, tabs, breadcrumbs, stage names); page and panel headers; **buttons, links used as actions, and dropdowns** (the trigger and its options: the trigger shows the picked option, so both use the same string) | "Strategy Frameworks", "Portfolio Under This Framework", "Archive Investment?", "No Value Frameworks Yet", "Approval Chain", "Send for Approval", "Portfolio Level" |
| **Sentence case** | All content: body text, descriptions, messages, field labels, placeholders, helper and error text, tooltips, chips, table cell text, Cooper's answers, and Cooper prompt chips (they are questions the user would type) | "Add a model to start scoring investments.", "Total forecast spend", "Why did Northeast slip?" |
| **UPPERCASE** (CSS only) | Three short, structural labels: **table column and row headers**, **status tags**, **group labels** (eyebrows above a list, menu or section) | `STATUS`, `TOTAL VALUE`, `UNDER REVIEW`, `LIBRARY`, `PINNED` |

**Buttons, action menu items and dropdowns** are Title Case (decided Nov 17, 2026): "Send for Approval", "Add Model", "Rename…", dropdown "Portfolio Level". A link inside a sentence is part of the sentence and keeps its case ("Approvers are listed in the approval chain."). Cooper prompt chips stay sentence case: they are questions ("What could block this idea?").

### Title Case, exactly
Capitalise every word except *a, an, the, and, but, or, nor, for, of, on, in, at, to, by, as, vs, per, with* — unless it is the first or last word. Capitalise both parts of a hyphenated word ("Year-End Close", "Benefit-Cost Ratio"). A heading that is a question keeps its question mark: "Delete This Comment?". Long headings that read as sentences (more than about 8 words) are a sign the heading should be shorter, not a reason to switch case.

### Uppercase, exactly
- Only through the text styles **Label/S/UPPER**, **Caption/semibold/UPPER** or **Caption/regular/UPPER** (`text-transform: uppercase`). **Never type capitals in the source** for these: screen readers spell some all-caps words letter by letter, and copy-paste and search get the typed text. Type the source in the case its role would have without the transform: Title Case for column and row headers ("Total Value"), sentence case for status tags and group labels ("Under review", "Shown in table").
- Short: one to three words, about 24 characters at most. Never a sentence, a number or amount, a date, a person or record name, a title, a field label, a button or link, or a value the user typed.
- Acronyms and codes typed in capitals because they *are* capitals (FY27, SAIDI, BCR, USD, MEAS.) are not uppercase styling; they keep their capitals in any case.

**Proper nouns keep their capitals in any case:** Cooper, IFS, Copperleaf, Catalyst, the stage names (Command, Value, Explore, Build, Plan, Results), and names the user gave something ("Q2 2026 Strategy Framework", "Harbor Substation Upgrade" — keep a record's name exactly as it was entered). Role names stay lower case in running text ("Ask the investment owner") unless the product decides they are titles **(decide)**.

**Acronyms** as their owners write them: FY27, SAIDI, SME, NPV, capex (lower case in text, as a common noun) **(decide capex vs CAPEX)**.

### Every uppercase style in the kit (Nov 2026)

`main` has **72** CSS rules with `text-transform: uppercase`. The typography branch (`claude/type-usage-f43e8c`) already removes it from 36 of them; the list below says which. It disagrees with this rule on two: `.ifs-risk` and `.ifs-sankey__column` lose their uppercase there, but they are a status tag and a column header, so this rule keeps them. Verdicts follow the rule above.

**Keep uppercase — table column and row headers (12)**

| Class | Component | Shows |
|---|---|---|
| `.ifs-table__th` (`__th-btn`) | Table header cell | "STATUS", "TOTAL VALUE", "VALUE CHANGE" |
| `.ifs-table__group` | Table group row | "BIGGEST GAINERS", "UNCHANGED" |
| `.ifs-apc__th` | Approval chain table header | "USER", "LAST NOTIFIED" |
| `.ifs-timeline-chart__phase-head` | Timeline column header | phase names |
| `.ifs-canvas-column__label` | Framework map column header | "ENTERPRISE GOALS", "VALUE MODELS" |
| `.ifs-sankey-header__abbr` | Sankey column abbreviation | "OBJ.", "MOD.", "MEAS." |
| `.ifs-sankey__column` | Sankey column header | column names |
| `.ifs-readiness-facts__label` | Readiness facts, row header | "CURRENT VALUE" |
| `.ifs-peer-benchmark__key` | Peer benchmark summary, row header | summary row names |
| `.ifs-rec-impact__label` | Recommendation impact, row header | "TOTAL CAPITAL", "RISK COVERAGE" |
| `.ifs-calendar__weekday`, `.ifs-weekday` | Calendar weekday header | "MON", "TUE" (two styles for one thing: pick one) |

**Keep uppercase — status tags (6)**

| Class | Component | Shows |
|---|---|---|
| `.ifs-indicator--s` | Status indicator, size S | "UNDER REVIEW", "SHAPING" |
| `.ifs-badge--false` | Badge without fill (caption badge) | short tag |
| `.ifs-risk` | Risk tag | "HIGH", "MEDIUM" |
| `.ifs-version-card__label` | Version card tag | version state |
| `.ifs-avatar__base`, `.ifs-pin-dot__text` | Avatar initials, map pin counter | "JP", "12" (initials and numbers: uppercase changes nothing; harmless) |

**Keep uppercase — group labels and eyebrows (13)**

| Class | Component | Shows |
|---|---|---|
| `.ifs-nav-subtitle__label` | Nav section label | "LIBRARY" |
| `.ifs-menu__title` | Menu group label | group name |
| `.ifs-select__list-title` | Dropdown group label | "SUGGESTED" |
| `.ifs-history__date` | Cooper history group | "PINNED", "TODAY" |
| `.ifs-chat-card__category` | Cooper chat card category | "RISK REDUCTION" |
| `.ifs-floating-bar__category` | Floating bar category | "FOLDER" |
| `.ifs-page-top__eyebrow` | Page eyebrow | "COOPER" |
| `.ifs-column-settings__label` | Column settings group | "SHOWN IN TABLE" |
| `.ifs-column-filter__title` | Column filter group | column name |
| `.ifs-peer-benchmark__label` | Peer benchmark group | "SUMMARY" |
| `.ifs-trc-caption` | Trace step group | "SOLUTIONS" |
| `.ifs-timeline-phase__title` | Timeline phase label | phase name |
| `.ifs-agent__brand` | Cooper wordmark in the agent header | "COOPER" (brand treatment; the one allowed exception for a name) |

**Doesn't make sense — titles and headings → Title Case, no transform (24)** — all already changed on the typography branch, except `.ifs-search-modal__title` (check it there)

`.ifs-surface__title` (every Modal, Drawer and Panel title: "TRACE REPORT"), `.ifs-dv-header__title` (chart and DataVizCard titles: "PORTFOLIO UNDER THIS FRAMEWORK"), `.ifs-table-card__name`, `.ifs-data-table__title`, `.ifs-sidenav__title-text` ("VALUE"), `.ifs-chat-header__title` ("STRATEGY OVERVIEW"), `.ifs-history__title`, `.ifs-apc-panel__title`, `.ifs-thread__title`, `.ifs-empty__heading` (every empty-state heading), `.ifs-alert__title`, `.ifs-select__empty-title`, `.ifs-docs-popover__empty`, `.ifs-approval__brief-title`, `.ifs-collab-section__title`, `.ifs-evidence-section__title`, `.ifs-rec-group__title`, `.ifs-rec-impact__title`, `.ifs-compare-list__title`, `.ifs-cooper-msg__h` ("SAVED SCENARIOS"), `.ifs-cooper-options__head`, `.ifs-bottom-sheet__context-title` ("COOPER'S CONTEXT"), `.ifs-widget-chip__title`, `.ifs-search-modal__title` (still uppercase on the typography branch).

**Doesn't make sense — content, values and controls → sentence case, no transform (16)** — the first 11 already changed on the typography branch

| Class | Why it's wrong | Shows |
|---|---|---|
| `.ifs-quick-stat__caption`, `.ifs-compare-stat__cap` | A sentence of content | "357 GAINED • 519 LOST • 745 UNCHANGED" |
| `.ifs-stat-card__desc--below`, `.ifs-table__status-desc` | Descriptions | |
| `.ifs-file-card__date`, `.ifs-attachment__meta` | Dates and file meta | "NOV 12, 2026 · 860 KB" |
| `.ifs-map-field__value` | A value (asset or layer name) | |
| `.ifs-select--s .ifs-select__field` | The dropdown trigger: Title Case, no transform | "PORTFOLIO LEVEL" → "Portfolio Level" |
| `.ifs-compare-header__label` | Control label | "COMPARE TO" |
| `.ifs-cooper-msg__toggle`, `.ifs-history__see-all` | Controls | "ANALYZED YOUR REQUEST", "SEE ALL" |
| `.ifs-select__label`, `.ifs-map-field__label` | Field labels (every other field label is sentence case) | XL select label, bottom-sheet map field labels |
| `.ifs-evidence__caption` | Scale labels under a meter, read like axis labels (axes are never uppercase) | "<70% REJECT", "70–90% REVIEW" |
| `.ifs-bar-item` | Values | "40 %" (also: no space before %) |
| `.ifs-phone__country` | Country code: already capitals, transform does nothing | "US +1" (remove the transform; harmless) |

**Doesn't matter (1):** `.ifs-preview-widget__title` (7px mini preview, not readable at that size). Also outside the 72: `.t-label-s-upper` used for bar values in the demo Dashboard ("$192M"; the typography branch moved it to Label/S/medium).

Text styles behind these: `.t-label-s-upper` and `.t-caption-semibold-upper` stay for the three keep groups; `.t-label-m-upper`, `.t-heading-h3-uppercase`, `.t-heading-h4-upper` and `.t-label-l-upper` are title or heading sizes, so nothing should use them (the typography branch retires `t-label-m-upper`).

**Source text under the transform** today is a mix: "Enterprise Goals" (Title Case) next to "Shown in table" and "Cooper's Context". Under uppercase it looks the same, but screen readers and copy-paste see the source, so fix it to the rule above when the screen is next edited.

## 3. Labels: buttons, links and menus

- **Start with a verb and name the object** when it isn't obvious from context: "Add Model", "Send for Approval", "Archive Investment". One or two words are enough when the context names the object (a "Save" button at the bottom of an edit form).
- **Never** "OK", "Submit", "Yes" / "No" as the only label: say what happens. The secondary action of a dialog is "Cancel" (it closes without changes) or a real alternative ("Keep Draft").
- **Same action, same word:** "Delete" removes for good, "Remove" takes something out of a group without destroying it ("Remove Collaborator"), "Archive" hides it and can be undone. Create vs Add: "Create" makes something new from nothing ("Create Framework"), "Add" puts an existing or simple item in a container ("Add Model", "Add Note").
- **Ellipsis on a label** (`…`) only when the action needs more input before it happens ("Rename…" in a menu). Not on buttons that open a dialog with nothing to fill in.
- **Links** say where they go: "See the Storm Report" as a standalone link, never "click here" or a bare "Learn more". A link in a sentence is part of the sentence ("Approvers are listed in the approval chain.").
- **Icon-only buttons** get the same verb-object label as their `label` prop (it is the tooltip and the accessible name): "Delete File", "Retry Upload", "Previous Month" (the label doubles as the tooltip, so it follows the button rule).
- **Cooper prompt chips** are questions or requests in sentence case, as the user would type them: "Why did Northeast slip?", "Summarize unresolved gaps".
- **No end punctuation** on buttons, labels, titles, tabs or menu items. Full stops on full sentences in body text, descriptions, messages and tooltips (a tooltip of 1–3 words doesn't need one).

## 4. Message patterns

Each message answers up to three questions in this order: **what happened, why (if it helps), what to do next.** Put the most important words first: titles get skimmed.

### Error (Alert `type="error"`, inline field error, EmptyState `cause="error"`)
- Say what went wrong in the user's terms, and how to fix it. No blame ("You entered…"), no "Oops", no codes alone (add a code after the sentence when support needs it).
- Field errors say what's needed, not that it's wrong: "Enter a date after Jan 1, 2027." — not "Invalid date". Required field: "Enter a name" or "Name is required".
- System errors: heading "Couldn't Load Frameworks", body "The server didn't respond. Try again in a minute." Action button: **Try Again** (not Retry).
- Form summary: "3 fields need attention" then a list.

### Warning (Alert `type="warning"`)
- The risk and its consequence, then the way out: "Weighting is no longer balanced. The total strategic objective weight is above 100%." Button: "Rebalance Weights".

### Success (Alert `type="success"`, Snackbar / `IFS.toast`)
- Past tense, object first, 2–5 words, Title Case (it's the heading): "Investment Saved", "Framework Published", "3 Investments Moved to Plan". Add a description only if it says something new ("Collaborators were notified."). Offer **Undo** for reversible actions instead of a confirmation dialog.
- Don't toast what the screen already shows (the row appearing in the list is the confirmation).

### Info
- Neutral, short, and only when it changes what the user does next: "This framework is active, so it's read-only."

### Empty states (EmptyState)
Say why it's empty and what to do. The heading (Title Case) states the situation; the body (sentence case) gives the next step; the button does it.

| Cause | Heading | Body | Button |
|---|---|---|---|
| first-run | "No Value Frameworks Yet" | "Create your first framework to start planning." | "Create Framework" |
| empty-container | "No Models in This Framework" | "Add a model to start scoring investments." | "Add Model" |
| all-done | "All Caught Up" | "No frameworks are waiting for approval." | — |
| error | "Couldn't Load Frameworks" | "The server didn't respond. Try again in a minute." | "Try Again" |
| no-access | "You Don't Have Access to This Framework" | "Ask the framework owner to share it with you." | "Request Access" |
| no-results | "No Frameworks Match Your Filters" | "Try a different term, or clear filters to see all frameworks." | "Clear Filters" |
| no-results-similar | "No Results for “WDRM-2”" | "You might be looking for" + chips | — |

### Loading (Spinner, LoadingMore, LoadingRegion, Skeleton)
- Prefer a skeleton (no words). When text is needed: "Loading…" or "Loading investments…" with the ellipsis character `…`, not three dots. Long jobs say what's happening and how far: "Re-scoring 1,621 investments… 40%".
- Screen readers: LoadingRegion announces "Loading <label>" and "Loaded" — give it a `label` that names the content ("investments").

### Confirmation and destructive actions (Modal)
- Ask only when the action can't be undone or affects other people. Otherwise do it and offer Undo.
- **Title** (Title Case): the action and the object, as a question: "Delete This Comment?", "Archive Harbor Substation Upgrade?"
- **Body:** the consequence, specific: "The comment is deleted for all collaborators. This can't be undone." / "Chats move to Trash and are deleted after 30 days."
- **Buttons:** the primary button repeats the verb and object ("Delete Comment", "Remove Collaborator"), styled as destructive where Figma has it; secondary is "Cancel". Never "Yes" / "No" / "OK".
- Never "Are you sure?".

## 5. Terms

Use one term per idea across screens. The kit's mock data and labels use: **investment** (not project), **portfolio**, **scenario** (not what-if), **value framework**, **constraint**, **approve / approval** (not sign off), **sign in / sign out**, **email**, US spelling (optimization, prioritize). A full Catalyst glossary exists in the team's voice-check material and is not in this repo yet **(decide)**.

## 6. Numbers, money, dates and fiscal years

Use the helpers: they implement every rule below and follow the user's locale (en-US by default; set once with `IFS.format.configure({ locale, currency, fyStartMonth })`). Full API: `dist/api.md` → **format**.

### Money
| Rule | Example | Helper |
|---|---|---|
| Under $10,000: in full, no cents unless the amount has them | $8,450 · $12.50 | `money(8450)` |
| $10,000 and up: K / M / B with **3 significant digits** | $860K · $19.4M · $192M · $3.04B | `money(19.4e6)` |
| Zero | $0 | `money(0)` |
| Negative: **true minus sign** `−` (U+2212) before the symbol. No hyphen, no parentheses. | −$1.8M | `money(-1.8e6)` |
| A change: always signed | +$1.3M · −$600K · $0 | `change(1.3e6)` |
| A column, axis or comparison: **one unit for all values**, fixed decimals | $0.6M · $4.4M · $12.4M | `money(v, { unit: 'M', decimals: 1 })` |
| Exact amount (forms, exports, audit) | $19,400,000 | `money(v, { compact: false })` |
| No value | — | any helper with `null` |

- Abbreviations: **K** thousand, **M** million, **B** billion, capital letters, no space, no full stop. Never "MM", "mn" or "bn".
- Currency symbol: `$` is US dollars. When a portfolio has another currency, or users span countries that all use "$", show the code once in the column header or page ("Cost (CAD)") rather than on every value.
- Don't rely on colour alone for negatives: the minus sign is always there.

### Numbers
- Thousands separators from 1,000: "1,621 investments". Counts are never abbreviated unless space forces it (`number(v, { compact: true })` → "19.4K").
- Decimals: as many as the decision needs, the same within a column. Ratios like benefit-cost: "2.4" (the label says it's a ratio; no "x").
- Numerals for all numbers in UI ("3 investments", "0 results"), including one to nine. Spell out only in idioms ("one or two sentences").
- Units: a space between number and unit, short units in tables and cards, full words in sentences: "5.1 min" in a table, "5.1 minutes" in a sentence (`number(5.1, { unit: 'min' })`, non-breaking space).
- Ranges: en dash, no spaces: "28–35%", "$1.2M–$1.8M" (repeat the symbol and unit). In sentences, "from … to …".

### Percentages
- No space before `%`: "4.8%", not "4.8 %". Up to 1 decimal; whole numbers without one: "48%". Helper: `percent(4.8)` (or `percent(0.048, { ratio: true })`).
- A change in a percentage is in **points**: "Risk coverage rose 3 points (91% → 94%)". In tight tables "+3 pts".
- Signed change: `change(-2.1, 'percent')` → "−2.1%".

### Dates
| Use | Format | Helper |
|---|---|---|
| Default (tables, cards, metadata) | Nov 12, 2026 | `date(d)` |
| Sentences, formal documents | November 12, 2026 | `date(d, { style: 'long' })` |
| When the year is obvious (a timeline inside one year) | Nov 12 | `date(d, { style: 'short' })` |
| Month | Nov 2026 | `date(d, { style: 'month' })` |
| Range | Nov 12 – 18, 2026 · Nov 28, 2026 – Jan 4, 2027 | `dateRange(a, b)` |
| Exports and data only | 2026-11-12 | `date(d, { style: 'iso' })` |

- Never all-numeric dates in the UI (11/12/2026 is November in the US and December elsewhere).
- Dates from data as `YYYY-MM-DD` are calendar dates: the helpers read them in local time. (`new Date('2026-11-12')` is UTC midnight and shows **Nov 11** in the Americas — a real bug the helpers avoid.)
- Days of the week only when they matter for the decision ("Due Fri, Nov 13").

### Times
- "3:44 AM": 12-hour clock with AM/PM in en-US (the locale decides elsewhere), minutes always shown: "3:00 PM", not "3 PM". `time(d)`.
- Date and time: "Nov 12, 2026, 3:44 AM" (`dateTime(d)`).
- Add the time zone when people in several zones see the same deadline: "5:00 PM PT".
- **Relative time** for recent activity (comments, edits, notifications): "just now" (under 45 seconds), "5 minutes ago", "3 hours ago", "yesterday", "4 days ago"; from 7 days, the date. `relative(d)`. Show the exact date and time in a tooltip. Use absolute dates for deadlines and anything legal or financial.
- Durations: "2 hr 15 min" in tables, "2 hours 15 minutes" in sentences; countdowns "3h left".

### Fiscal years
| Use | Format | Helper |
|---|---|---|
| Default | FY27 | `fy(2027)`, `fy(date)` |
| Range (planning horizon) | FY27–FY31 (en dash, no spaces, FY repeated) | `fyRange(2027, 2031)` |
| Quarter | Q2 FY27 | `fy(date, { quarter: true })` |
| Where two digits are ambiguous (horizons past 2099, legal text) | FY2027 | `fy(2027, { style: 'long' })` |

- Never "FY 2027", "FY'27", "fy27" or "FY27-31".
- A fiscal year is named for the calendar year it **ends** in. The start month is per customer: `IFS.format.configure({ fyStartMonth: 10 })` makes Oct 1, 2026 the start of FY27. Calendar quarters are "Q1 2026" (no FY).

## 7. How the benchmarks compare

All five public systems publish content guidance; Notion has no public system.

| Topic | Atlassian | Material 3 | Carbon | Fluent 2 | Apple HIG | Catalyst |
|---|---|---|---|---|---|---|
| Voice principles | Voice and tone | Content design | Content | Content design | Writing | §1 |
| Capitalisation | Sentence case | Sentence case | Sentence case | Sentence case | **Title case** for titles, buttons and menus (macOS) | Title Case for titles, headings, navigation, buttons and dropdowns; sentence case for content; uppercase for column headers, status tags, group labels |
| Inclusive / global writing | Inclusive writing | Global writing | Yes | Yes | Inclusion | §1 (short) |
| Button labels: verb + object | Yes | Yes | Yes | Yes | Yes | §3 |
| Message patterns (error, success, empty, confirm) | Designing messages | Yes (dialogs, snackbars) | Notifications, empty states as patterns | Yes | Alerts | §4 |
| Date and time formats | **Dedicated page** | Style guide | Partial | Partial | — | §6 |
| Number, currency and unit formats | Style | Style guide | Yes | Partial | — | §6 (in more depth: abbreviation thresholds, true minus, fiscal years) |
| Formatting code helpers | — | — | — | — | — | **`IFS.format`** |

What Catalyst takes from each: Atlassian's message structure and date/time page, Carbon's treatment of empty/loading/error/disabled/read-only as patterns with set copy, Material 3's global-writing rules, Fluent's "lead with what matters", and Apple's split of Title Case for titles against sentence case for content (the other four use sentence case everywhere; Catalyst keeps Title Case for titles, headings and navigation because the product's object names read as names there). What only Catalyst needs: money abbreviations at portfolio scale, fiscal years and planning horizons, and Cooper's confidence and sources.

## 8. Findings in the kit (Nov 2026)

Changed on this branch:
- **`IFS.format` added** (`src/components/format.js`), loaded first by `index.js` and documented in `dist/api.md`.
- Components now use it: chart default number format (true minus, 3 significant digits, `—` for no value), Gauge and Funnel defaults; Calendar title and day labels and DatePicker's default `format`; Documents and Cooper file sizes; Approval table sort parser (`apNum`), which read "−$1.3M" (true minus) as **positive** before.
- Stories and demo: hand-rolled `$…M` and date formatters replaced with the helpers (charts, widget builder, activity, nav bar, table galleries; demo Library and Review); "4.8 %" → "4.8%" (24 places); "-$1.3M" hyphens → true minus in the Review demo; "$0.0M" → "$0".
- Copy: Spinner "Loading..." → "Loading…" (Figma's text has three dots); EmptyState `cause="error"` button "Retry" → "Try again"; destructive dialogs name the object ("Delete comment", "Remove collaborator", "Delete chat(s)", "Delete folder(s)", "Archive investment"); missing full stops in two empty-state bodies; EmptyState and Alert stories rewritten (no "Please", no "Close me.", specific headings).

Not changed (listed for decisions or other areas):
- **Real names in stories:** `src/gallery/patterns-nav-bar.jsx` uses "DC Water Capital Improvement Plan" / "DC Water capital" (a real utility), and `src/gallery/patterns-approval.jsx` uses "Jeff Pauska" as a person. The repo is public; replace both with made-up names unless they are cleared.
- **Titles in sentence case** (should be Title Case): most titles in the kit are typed in sentence case because they were displayed uppercase — "Trace report", "Readiness evaluation", "Portfolio under this framework", "Strategic objectives breakdown", "Framework coverage by measure type", "Saved scenarios", every EmptyState heading in components and stories ("No results found", "All comments have been resolved"), and Alert and toast titles ("Investment saved", "Unsaved changes"). Title-case titles already right: "Version History", "Approval Chain", "Strategy Frameworks", "Value Models" ("Readiness Evaluation" appears both ways). Not yet changed.
- **Buttons and dropdown values in sentence case** (should be Title Case): nearly all of them — "Add model", "Send for approval", "Request access", "Clear filters", "Try again", "Delete comment" (including the ones this branch rewrote earlier), and dropdown options. Not yet changed.
- **Status tags in Title Case** (should be sentence case): "Ready to Approve" next to "Ready to publish". Mixed source under uppercase: "Cooper's Context", "Enterprise Goals" vs "Shown in table".
- "Projects by value driver" (demo Dashboard chart title) uses "projects" where the glossary says "investments".
- **"N Documents"** (`patterns-documents.jsx` `docLabel`, BottomSheet stories) and **"4 Recommendations"** (CooperChip) are title case in Figma; sentence case would be "3 documents", "4 recommendations".
- **"No results found" + "You might be looking for"** repeats in five components. Clearer: "No results for “query”". Left as is because it matches the Figma empty-state text.
- Chart tables and Funnel use `–` (en dash) for a missing value, the helpers use `—` (em dash). Pick one with the data viz area (helpers: `configure({ empty })`).
- Benefit-cost ratio shown as "2.40x" in the widget stories and "2.4" elsewhere.
- Demo screens and stories still hold most amounts as preformatted strings ("$3.1M"). That's fine for mock data that mirrors Figma, but a real screen should keep numbers in the data and format them at render.

## 9. Decisions waiting

1. **Group labels and eyebrows** stay uppercase in this guide (with column headers and status tags); confirm, or move them to sentence case (none of the benchmarks uses uppercase for group labels any more; Atlassian keeps it only for status lozenges).
2. **Bring the Catalyst voice-check rules and glossary into this repo?** (Their substance is reflected here in our own words; the glossary's product terms are not copied.)
3. **Missing-value mark:** em dash `—` (helpers) or en dash `–` (charts).
4. **capex vs CAPEX**, and whether role names (Portfolio Owner) are capitalised.
5. **Fiscal-year start month** default (January today) and whether quarters are fiscal ("Q2 FY27") or calendar ("Q2 2026") by default.
6. **Accounting-style negatives** — parentheses "($1.8M)" in finance tables? This guide says no (true minus everywhere).
