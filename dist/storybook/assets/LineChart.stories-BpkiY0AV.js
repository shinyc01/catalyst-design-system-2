import{I as r}from"./charts-CyFoVB8-.js";import{I as i}from"./patterns-trace-DVww7oUm.js";import"./index-B0WjJBI_.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-x-G-dxfr.js";import"./index-CwPCC0ZT.js";const o=r.find(n=>n.name==="LineChart"),g={title:"Data Visualisation/LineChart",component:i.LineChart,tags:["autodocs","needs-review"],parameters:{docs:{description:{component:`> ⚠️ **Needs review** — check these against Figma:
>
> - The y-axis starts at 80; Figma's starts at 60.

**Figma:** chart-line (9863:11650)


Use: Change over time — spend/burn tracking, actual (solid) vs planned (dashed), trend and rate of change. \`endLabels\` (default on) names each line at its end; when the names collide or don't fit, a vertical legend sits on the end side of the plot (line / dashed swatches), in the order the lines end (top line first); the tooltip lists the series by value at the hovered point, highest first. Every line up to 12 has its own colour (keep it to 8: guidance); the 13th and later grey with one "Other" entry. Missing values (2.0.7): the line breaks at a gap, a lone value is a dot, the tooltip says "No data"; \`connectGaps\` joins across with a dotted bridge (rule 10.10). \`forecastFrom\` (the last actual point, index or label) dashes every line after it, with a "Today" marker and "Forecast" in the legend, tooltip and table (rule 10.13).`}},design:{type:"figma",url:"https://www.figma.com/design/atgUmwcA1AE5sjFoWBT7ar/IFS-Design-System?node-id=9863-11650"}}},e={name:"All variants & states",render:()=>o.render()};var t,a,s;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  name: 'All variants & states',
  render: () => section.render()
}`,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const u=["AllVariants"];export{e as AllVariants,u as __namedExportsOrder,g as default};
