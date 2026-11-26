import{I as a}from"./patterns-comments-ClgBnx1u.js";import{I as s}from"./patterns-trace-BW3f7Eaf.js";import"./index-B0WjJBI_.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-x-G-dxfr.js";import"./index-CwPCC0ZT.js";const i=a.find(r=>r.name==="Pattern: Commenting on the canvas"),u={title:"Examples/Comments/Commenting on the canvas",component:s["Pattern: Commenting on the canvas"],tags:["autodocs","needs-review"],parameters:{docs:{description:{component:`> ⚠️ **Needs review** — check these against Figma:
>
> - Editing your own reply now follows 12:47187: ⋯ → Edit/Delete, a white field with Cancel + Send, and no Mention button. Delete asks for confirmation, then shows Undo. Check it.
> - Posted @mentions are now a badge with the mention icon (12:46575). Check it.
> - Map nodes: the kit's NodeCard at zoom 0.6 is taller than Figma's 24px map bars.

**Figma:** Map - Overview - Comments panel unresolved / Comment open / Sent [patterns] (12:34047)

## Comments pattern


**For:** threaded comments anchored to elements of a canvas (framework map): pins, a thread callout opened in place, and a Comments drawer listing every thread. Not for Cooper chat or activity history.

**Parts:** \`CommentPin\`, \`CommentDrawerCard\`, \`CommentThread\`, \`Comment\`, \`CommentComposer\`, \`Drawer\`, \`SegmentedControl\`, \`SmartSearch\`, \`EmptyState\`, \`Menu\`, \`Badge\`, \`NodeCard\`, \`NodeHoverActions\` · helpers: \`CommentsPanel\` (drawer list, filter, search, empty states), \`CommentCallout\` (thread + ⋯ + @-mention picker + resolved look), \`CommentMentionMenu\`, \`useCommentThreads\`, \`searchComments\`.

**Rules:**

1. Comments mode: the header comment button or C opens the drawer; comment cursor over the canvas, default cursor over the drawer. The mode stays on after sending; closing the drawer (✕) turns it off.

2. Place: click the canvas → composer at the click, anchored to the nearest node → Enter sends (new pin, new row on top with a blue dot); Esc cancels.

3. Collapsed nodes show one roll-up pin (Inactive avatar with the thread count); expanding (node hover action, or clicking the roll-up pin) zooms to the node and shows each thread's author pin; collapsing returns.

4. Hover a pin: preview only (author, time, 3 lines, replies). Click a pin or row: the canvas scrolls to the anchor, the callout opens there, the row is Selected, unread cleared. One callout at a time; Esc or ✕ closes it.

5. Blue dot = unread; opening marks it read (it can stay unresolved). The comment button shows a dot while any unresolved thread is unread.

6. Drawer rows never expand and show only the first comment, truncated.

7. Reply in the callout (voice input works in the composer); \`@\` opens the people picker (↑/↓, Enter or Tab picks); posted mentions show as a Badge with the mention icon. Your own reply: ⋯ → Edit (field with Cancel + Send, no mention button) / Delete (confirm "Delete this comment?", body "The comment is deleted for all collaborators.": no "cannot be undone", since an Undo follows, rule 8.24; then "Comment deleted" + Undo).

8. Resolve: ✓ in the callout header or on row hover (tooltip "Resolve"); the next unresolved thread opens. Resolved threads: callout header ⋯ (Unresolve, Copy link) + ✕, Inactive avatars, text not dimmed, composer kept; drawer card Type=Resolved (no dot, no chip, ⋯ on hover); pins Read style.

9. Types are Action required, Question, Info; only Action required shows a chip; resolved threads show none. The type still drives filters and counts.

10. Search ("Search comments") filters the current tab (author, status, type, time, element, text); it doesn't answer in chat. Copy link → "✓ Copied" for 2s.

11. Empty: all resolved → "All comments have been resolved / Ready to proceed to review."; no match → "No results for “{term}”" + suggestion chip; none resolved → "No resolved comments".`}},design:{type:"figma",url:"https://www.figma.com/design/KmmVU2D0kqWr0dC1xXNzWw/IFS-Design-System-Patterns?node-id=12-34047"},layout:"fullscreen"}},e={name:"All variants & states",render:()=>i.render()};var n,t,o;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'All variants & states',
  render: () => section.render()
}`,...(o=(t=e.parameters)==null?void 0:t.docs)==null?void 0:o.source}}};const w=["AllVariants"];export{e as AllVariants,w as __namedExportsOrder,u as default};
