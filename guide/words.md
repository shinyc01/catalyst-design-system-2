# Catalyst Design System 2.0.7 — word list

Generated from `words.json` by `tools/gen-words.mjs` (2026-11-26); edit the JSON, not this file. Rules: [rules.md](rules.md) section 8 (rule 8.9 is the summary, rule 8.43 how to use this list).

The Catalyst word list (rule 8.43). Terms are settled; a definition with "confirmed": false is a draft waiting for a product owner pass (BACKLOG). A term's definition doubles as its hint-tooltip text (rule 8.49).

**Organisation settings that change words**
- entity name (USER-SETTINGS row 15): investment or project, default investment. An organisation may rename "investment" to "project"; copy takes the name from the setting.

## 1. Terms

| Term | Definition (= hint-tooltip text) | Don't use | Notes | Rule | Definition confirmed |
|---|---|---|---|---|---|
| investment | A piece of work that competes for funding, with one or more alternatives. | request, initiative, job | An organisation may rename it "project" (USER-SETTINGS row 15): copy takes the entity name from the setting and never hard-codes "investment" or "project". "Project" is not a banned word. | 8.9 | not yet (product owner) |
| program | An investment type that groups related work. | — | A real investment type (decided Nov 26), not a level of portfolio. Whether an organisation may rename it is in the backlog. | 8.9 | yes |
| alternative | One way to carry out an investment, with its own cost, timing and value. | option, variant, version, scenario | Distinct from scenario (a whole plan). "Option" stays fine for menu and radio choices, never for an alternative. | 8.9 | yes |
| selected alternative | The alternative the plan currently uses for an investment. | chosen option, active alternative, preferred | One number per investment = the selected alternative. | 8.43 | not yet (product owner) |
| scenario | One version of the portfolio plan, under its own constraints and assumptions. | what-if, plan version, case, run | Names as entered ("02_Optimized"). | 8.9 | not yet (product owner) |
| portfolio | A group of investments planned and funded together. Portfolios can contain other portfolios. | bucket, folder | "Program" is an investment type, not a portfolio (decided Nov 26), so it is no longer on this list. | 8.9 | yes |
| planning group | A set of investments in a scenario that the optimization treats the same way. | tier, category, bucket | — | 8.43 | not yet (product owner) |
| value | A score from the value framework, not money. Higher is better. | benefit, ROI, worth, $ value | Never with a currency symbol; K / M allowed ("Value 15.85M", rules 8.26, 8.43). | 8.43 | not yet (product owner) |
| value framework | Your organization's model for measuring the value of investments against its goals. | scoring model, value model (for the whole), framework (alone, on first use) | — | 8.9 | not yet (product owner) |
| value model | A calculation in a value framework that scores investments on one measure. | formula, calculator | — | 8.43 | not yet (product owner) |
| value measure | One thing the value framework measures, such as reliability risk or aggregate risk. | metric, KPI (for value measures), criterion | Measure names as entered ("Reliability-Risk"). | 8.43 | not yet (product owner) |
| constraint | A limit the optimization must respect, such as a yearly capex cap. | rule, restriction, limit (as a noun label), guardrail | The umbrella word: "14 constraints". A spend limit is a budget. | 8.9 | not yet (product owner) |
| budget | A constraint that limits spend, such as the FY27 budget. | budget (for value or other limits) | One kind of constraint (decided Nov 26): "budget" for a spend limit, "constraint" as the umbrella; never "budget" for value or other limits. | 8.9 | yes |
| optimization | A run that picks alternatives and timing to get the most value within the constraints. | optimisation, solver run, AI plan, calculation | US spelling. Verb "optimize", adjective "optimized"; re-optimize is hyphenated (rule 8.42). | 8.9 | not yet (product owner) |
| deferred | Status: the investment starts later than requested. | pushed out, delayed (for this status), postponed | Optimizer status. | 8.43 | not yet (product owner) |
| brought forward | Status: the investment starts earlier than requested. | pulled in, accelerated, advanced | Optimizer status. | 8.43 | not yet (product owner) |
| alternative changed | Status: the plan uses a different alternative than requested. | swapped, option changed | Optimizer status. | 8.43 | not yet (product owner) |
| as requested | Status: no change from the request. | unchanged, original, baseline | "Requested" is the scenario name. | 8.43 | not yet (product owner) |
| spend forecast | The planned spend of an alternative by year. | cash flow, spend profile, burn | — | 8.43 | not yet (product owner) |
| capex / opex | Capital and operating expenditure. | CAPEX, CapEx, OPEX, OpEx, capital costs (in labels) | "capex" in running text, "Capex" to start a label. Demo measure names keep their source spelling. | 8.9 | yes |
| total investment cost | Capex plus opex over the life of an alternative. | TIC, total cost of ownership | Spell it out (rule 8.34). | 8.43 | not yet (product owner) |
| milestone | A dated point in an alternative's schedule. | checkpoint, deliverable | — | 8.43 | not yet (product owner) |
| stage | A step in an investment's life cycle, such as Concept or Approved. | phase, state, status (for stages) | Stage names as entered. | 8.43 | not yet (product owner) |
| gate | An approval point between stages. | checkpoint, hurdle | "Approved at every gate" (rule 14.12). | 8.43 | not yet (product owner) |
| approval chain | The ordered people who approve an investment or framework. | sign-off chain, workflow, approval flow | — | 8.43 | not yet (product owner) |
| approve / approval | Agree that the item can move on. | sign off, accept, OK | — | 8.9 | not yet (product owner) |
| needs revision | Status: an approver sent the item back to its author to revise. | Revisions required, Revision required, Revision requested, Revisions requested (as a status), Changes requested | The send-back pair (decided Nov 26): the asker's button "Request revisions", their snackbar "Revisions requested" (description "Sent back to {name}."), the status everyone sees "Needs revision". A status that asks for action may start with "Needs" (rule 8.52). | 8.9 | yes |
| risk | The chance and impact of an unwanted event, such as an asset failure. | threat, hazard, exposure | — | 8.43 | not yet (product owner) |
| residual risk | The risk left after an investment is done. | remaining risk, leftover risk | — | 8.43 | not yet (product owner) |
| risk register | The list of identified risks and their scores. | risk log, risk list | — | 8.43 | not yet (product owner) |
| asset | A physical thing the organization owns and maintains, such as a transformer or pole. | equipment, item, unit | Asset names as entered ("Transformer T-118"). | 8.43 | not yet (product owner) |
| condition | How healthy an asset is today, on the organization's scale. | health score, state | — | 8.43 | not yet (product owner) |
| evidence | The sources that support a score, a recommendation or Cooper's answer. | proof, backup, references | "Supporting evidence" in CooperMessage (rule 8.59). | 8.43 | not yet (product owner) |
| confidence | How sure Cooper or the system is about an inference: High, Medium or Low. | certainty, accuracy, trust score | — | 8.58 | not yet (product owner) |
| Cooper | The IFS Copperleaf assistant. | the AI, the bot, chatbot, assistant, Copilot, agent (alone) | Always capitalised. "I" only for its own actions and limits; third person outside the chat ("Suggested by Cooper"). | 8.6 | yes |
| people | The people who use Copperleaf, when UI text talks about others ("People with access"); the reader is "you". | users, user (in UI text) | Decided Nov 26. "User" stays fine in code and prop names; the approval column is "Person". | 8.9 | yes |
| Other | The group a chart folds its smallest series or slices into. | Misc, Rest, Others | Grey --color-data-viz-other (rules 10.1, 10.7). | 8.44 | yes |
| No data | A missing data point in a chart tooltip. Only there; empty states follow rules 8.22 and 8.51. | 0, N/A, blank | Rule 10.10. | 8.44 | yes |
| collaborator | A person working on a record with you. | member, participant, contributor | — | 8.43 | not yet (product owner) |
| owner | The person responsible for a record. | creator, manager (unless the role is "Investment manager"), assignee | Role names are labels in sentence case ("Portfolio owner"), lowercase mid-sentence (rule 8.33). | 8.43 | not yet (product owner) |

## 2. UI verbs (rules 8.10–8.12)

| Use | For | Don't use | Rule |
|---|---|---|---|
| Create | making a new object ("Create scenario") | New (as a verb), Make, Add (for new objects), Generate (unless Cooper writes it) | 8.12 |
| Add | putting an existing or new item into a container ("Add model") | Insert, Attach (except files), Include | 8.12 |
| Remove | taking out of a group, without deleting ("Remove collaborator") | Delete (for this), Unassign | 8.12 |
| Delete | removing for good ("Delete scenario") | Remove (for this), Erase, Destroy, Trash | 8.12 |
| Archive / Restore | hiding and undoing it | Hide, Retire | 8.12 |
| Edit | changing fields of an object | Modify, Change (as a button) | 8.12 |
| Rename… | changing the name only (rule 8.13 ellipsis) | Edit name | 8.12 |
| Duplicate | making a copy in the same place ("Duplicate scenario") | Copy (for objects), Clone | 8.12 |
| Copy | the clipboard ("Copy link") | Duplicate (for clipboard) | 8.12 |
| Save | keeping edits; the FormCard fallback label | Submit, Apply (for forms), OK, Done (in edit forms) | 8.10 |
| Apply | applying filters or a setting without leaving | Save (for filters), OK, Apply (for a Cooper suggestion: name the change) | 8.10 |
| Send for approval | starting the approval chain | Submit, Sign off | 8.10 |
| Approve / Request revisions / Reject | approver decisions; "Request revisions" sends the item back to its author. After "Request revisions" the status is "Needs revision" and the snackbar "Revisions requested" (description "Sent back to {name}."). | Accept, Decline, Return, Sign off, Request changes, Request more information, Request more info | 8.9 |
| Export / Import | files out of or into the product ("Export plan (CSV)") | Download (for export), Upload (for import) | 8.12 |
| Download / Upload | moving a file as a file | Export, Import | 8.12 |
| Share | giving people access | Invite (except a new collaborator: "Invite collaborators") | 8.12 |
| Request access | asking for access (rule 8.22) | Ask for permission | 8.12 |
| Select | choosing, in instructions | Click, Tap, Hit, Press (except keys) | 9.26 |
| Choose | a decision between options, in instructions | Pick | 8.8 |
| Try again | repeating a failed load or action | Retry, Reload, Refresh (except the data's own Refresh) | 8.18 |
| Cancel | leaving without changes | Close (in dialogs with edits), Abort, Discard (unless edits are lost: "Discard changes") | 8.11 |
| Undo | reversing the last action (snackbar) | Revert, Roll back | 8.20 |
| Optimize / Re-optimize | starting an optimization | Run, Solve, Calculate, Reoptimize | 8.42 |
| Re-score | recalculating value | Recalculate, Rescore | 8.42 |

## 3. Words we don't use

| Don't use | Use instead | Rule |
|---|---|---|
| please, sorry (more than once, or when nothing failed), oops | the fact and the next step | 8.7 |
| simply, just, easy, obviously, quick | (leave out) | 8.7 |
| seamless, powerful, robust, magic, smart, AI-powered, revolutionary | say what it does | 8.7 |
| leverage, utilize, facilitate, empower | use, help, let | 8.7 |
| click here, here, read more, learn more (alone) | the destination ("See the storm report") | 8.14 |
| click, tap, hit | select | 9.26 |
| invalid, illegal, failed, fatal, abort, error (alone) | say what's wrong ("Enter a date after Jan 1, 2027") | 8.18 |
| Submit, OK, Yes / No (alone) | verb + object ("Send for approval"); "Save" in a form | 8.11 |
| Apply, Do it (on a Cooper suggestion) | the change, named in full ("Defer 3 investments") | 8.60 |
| Retry | Try again | 8.18 |
| Are you sure? | the consequence ("This can't be undone.") | 8.24 |
| No data, No data found, Nothing here, No results found | the rule 8.22 heading for the cause ("No results for “WDRM-2”", "No matches for these filters") | 8.51 |
| Insufficient data | "Not enough data yet" + when it will appear | 8.51 |
| Success!, Error:, Warning:, Info:, Notification: | the message itself | 8.54 |
| user, users (in UI text) | people ("People with access"), you, or the person's name | 8.9 |
| the AI, bot, chatbot, assistant | Cooper | 8.6 |
| As an AI…, I think, I feel, I'd love to, Great question | (leave out) | 8.61 |
| e.g., i.e., etc., vs. (in sentences) | for example, that is, the full list, compared with | 8.34 |
| & (outside names) | and | 8.38 |
| and/or, / for "or" | or, and | 8.39 |
| N/A | — (missing value) or "Doesn't apply" | 8.39 |
| ... (three dots) | … (one character) | 8.40 |
| straight quotes and apostrophes (" ' ) in UI strings | curly ones (“ ” ’) | 8.40 |
| CAPEX, CapEx, OPEX, OpEx | capex, Capex, opex, Opex | 8.9 |
| optimisation, prioritise, colour (in UI) | optimization, prioritize, color | 8.9 |
| log in, login, log out, sign on | sign in, sign out | 8.9 |
| e-mail | email | 8.9 |
| sign off (approval) | approve | 8.9 |
| Request more information, Request more info, Request changes | Request revisions | 8.9 |
| Revisions required, Revision required, Revision requested, Changes requested (as a status) | Needs revision | 8.9 |
| budget (for value or other limits) | constraint, or the limit's own name | 8.9 |
| what-if | scenario | 8.9 |
| option (for an alternative) | alternative | 8.9 |
| whitelist, blacklist | allowlist, blocklist | 8.8 |
| master, slave | primary, main, replica | 8.8 |
| sanity check | quick check | 8.8 |
| dummy (data, value) | sample, placeholder | 8.8 |
| kill, execute, hang (processes) | stop, run, stop responding | 8.8 |
| grandfathered | existing, kept | 8.8 |
| native (speaker) | first-language | 8.8 |
| he / she (generic) | they, you | 8.8 |
| ALL CAPS, Title Case, emoji, ! | sentence case (rule 2.9), no emoji, a full stop | 2.9 |
| ~, approx. | about | 8.35 |
| 12th Nov, Nov 12th, 11/12/2026 | Nov 12, 2026 | 8.36 |
