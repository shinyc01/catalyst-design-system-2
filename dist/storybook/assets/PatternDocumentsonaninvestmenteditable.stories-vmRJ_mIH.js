import{I as a}from"./patterns-documents-Bhp9gUfy.js";import{I as s}from"./patterns-trace-Cud-xh3_.js";import"./index-B0WjJBI_.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-x-G-dxfr.js";import"./index-CwPCC0ZT.js";const i=a.find(r=>r.name==="Pattern: Documents on an investment (editable)"),u={title:"Examples/Documents/Documents on an investment (editable)",component:s["Pattern: Documents on an investment (editable)"],tags:["autodocs","needs-review"],parameters:{docs:{description:{component:`> ⚠️ **Needs review** — check these against Figma:
>
> - One dev note says errors use a snackbar; the frames and the other notes use alert-organism. The kit uses the alert.

**Figma:** Investment overview — Add Attachments / Delete / Error states [patterns] (168:426794)

## Documents pattern


**For:** the files attached to a record (investment, value framework) that build Cooper's context. They live in the bottom sheet, never on their own page; not a general file manager.

**Parts:** \`BottomSheet type="documents"\` with \`DocumentsContext\` ("Cooper's Context", optional coverage \`ProgressBar\`, documents Tertiary M \`Button\`, Upload Tertiary M \`IconButton\`) · \`DocumentsPopover\` (\`Popover\` "Documents" + \`Counter\`, search, ✕) of \`DocumentRow\`s (\`FileCard\` row: name, upload date; hover ⋯ Download / Remove when editable, Download when read-only; error rows Remove + Retry; uploading rows skeleton) · \`DocumentsDropArea\` (\`DropZone\` + \`NodeCard type="document"\` ghosts while dragging) · \`DocumentsFeedback\` (\`Alert\`, \`Snackbar\`, top-right under the page header) · state \`useDocuments({ defaultDocuments, editable, required })\`.

**Rules:**

1. The button reads "1 Document" / "N Documents" and is hidden at 0. The popover opens 4 above the bottom sheet, clear of canvas tools, at most 360 tall: 1–7 documents no scroll, 8–9 scroll, 10+ search appears. Newest upload first. Search filters by name; no match "No results found" with no counter.

2. A row opens a preview in a separate window; Download downloads; ✕, Esc or outside click closes the popover.

3. Attach by Upload (multiple files) or by dropping files on the content (purple dashed overlay while dragging). Each file is checked first; a rejected file never enters the list or the count. Accepted files show as loading rows and the button icon spins; on success the count goes up and the list opens with the new file on top.

4. Rejection messages (error \`Alert\`, rule 7.12; also closes on the next action): «Can't add "{file}" — supported formats are {list}.» (PDF, DOCX, XLSX, PPTX, TXT, CSV); «Can't add "{file}" — the file is {size}, the limit is {limit}.» (25 MB, no Retry); several: «{n} of {total} files added. {m} files were skipped — unsupported format or too large.» + See details.

5. Network failure: the row stays with "Upload failed" + retry (tooltip "Try again"), uncounted and outside Cooper's context until it uploads; retry resends that file, one row at a time; completed files stay; the row goes only when removed.

6. Remove (editable): the row goes, the count drops, snackbar "The document has been removed" + Undo (rule 7.12).

7. Empty: depends on whether Cooper's context is required to leave the stage. Required: coverage bar + Upload (the bar fills as documents are processed; 25% per usable document). Optional: Upload only. The counter appears with the first document and the list replaces the empty state; at 100% coverage the empty state gives way to the normal state.

8. Editable up to publication; read-only once Active, Scheduled or Archived: no Upload, drop or ⋯ (rule 9.10); rows keep Download; search and counter still work; the list never disappears. To change documents, create a new version.

9. Long names truncate in the middle, never wrap; rows keep one height; the date never truncates; the tooltip anchors to the row.`}},design:{type:"figma",url:"https://www.figma.com/design/KmmVU2D0kqWr0dC1xXNzWw/IFS-Design-System-Patterns?node-id=168-426794"}}},e={name:"All variants & states",render:()=>i.render()};var t,o,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  name: 'All variants & states',
  render: () => section.render()
}`,...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const w=["AllVariants"];export{e as AllVariants,w as __namedExportsOrder,u as default};
